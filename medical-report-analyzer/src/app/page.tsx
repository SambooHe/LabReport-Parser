'use client';

import { useState } from 'react';
import { MedicalIndicator, AnalyzedResult } from '@/types/medical';
import { uploadMedicalReport, generateImageUrl } from '@/services/upload';
import { extractMedicalData, parseMedicalIndicators } from '@/services/ocr';
import { exportToExcel } from '@/services/excel';

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalyzedResult[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件（JPG、PNG等格式）');
      return;
    }

    setIsUploading(true);
    
    try {
      // 使用API路由上传文件
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const uploadResult = await response.json();
      
      // 开始分析
      setIsAnalyzing(true);
      setIsUploading(false);
      
      // 获取图片URL用于OCR分析
      const imageUrl = uploadResult.fileUrl;
      
      // OCR识别
      const rawText = await extractMedicalData(imageUrl);
      
      // 解析医疗指标数据
      const indicators = parseMedicalIndicators(rawText);
      
      // 创建分析结果
      const newResult: AnalyzedResult = {
        id: Date.now().toString(),
        fileName: uploadResult.fileName,
        uploadedAt: new Date().toLocaleString('zh-CN'),
        indicators: indicators,
        rawText: rawText
      };
      
      setResults(prev => [newResult, ...prev]);
      
    } catch (error) {
      console.error('Upload or analysis failed:', error);
      alert(`处理失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleExportExcel = () => {
    if (results.length === 0) {
      alert('没有可导出的数据');
      return;
    }
    
    try {
      exportToExcel(results);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    }
  };

  const handleDeleteResult = (id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  };

  const getStatusColor = (status: MedicalIndicator['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'abnormal':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: MedicalIndicator['status']) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'abnormal':
        return '异常';
      case 'warning':
        return '警告';
      default:
        return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            医院检查检验单智能识别系统
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            上传医院检查检验单图片，系统将自动识别各项检验指标数据，并整理成Excel格式供您导出分析
          </p>
        </div>

        {/* 上传区域 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              
              <p className="text-lg font-medium text-gray-900 mb-2">
                拖拽图片到此处，或点击选择文件
              </p>
              <p className="text-sm text-gray-500 mb-4">
                支持 JPG、PNG、GIF 等常见图片格式
              </p>
              
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
                disabled={isUploading || isAnalyzing}
              />
              
              <label
                htmlFor="file-input"
                className={`px-6 py-3 rounded-md font-medium text-white cursor-pointer transition-colors ${
                  isUploading || isAnalyzing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUploading ? '上传中...' : isAnalyzing ? '分析中...' : '选择图片'}
              </label>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        {results.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleExportExcel}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              导出Excel
            </button>
          </div>
        )}

        {/* 分析结果 */}
        <div className="space-y-6">
          {results.map(result => (
            <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {result.fileName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      上传时间：{result.uploadedAt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteResult(result.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              {result.indicators.length > 0 ? (
                <div className="p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    检验指标 ({result.indicators.length}项)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            检验项目
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            检测结果
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            单位
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            参考范围
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            状态
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.indicators.map((indicator, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {indicator.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {indicator.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {indicator.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {indicator.referenceRange || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(indicator.status)}`}>
                                {getStatusText(indicator.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>未识别到有效的检验数据</p>
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm text-gray-400">
                      查看原始识别结果
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-auto">
                      {result.rawText}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>

        {results.length === 0 && !isUploading && !isAnalyzing && (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg">暂无分析结果</p>
            <p className="text-sm mt-2">上传图片开始分析</p>
          </div>
        )}
      </div>
    </div>
  );
}