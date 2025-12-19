'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    addLog(`开始上传文件: ${file.name} (${file.type}, ${file.size} bytes)`);

    try {
      // 测试基本的文件读取
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      addLog(`文件读取成功，Buffer大小: ${buffer.length} bytes`);

      // 测试环境变量
      addLog(`环境变量检查:`);
      addLog(`- COZE_BUCKET_ENDPOINT_URL: ${process.env.NEXT_PUBLIC_COZE_BUCKET_ENDPOINT_URL || '服务器端变量'}`);
      addLog(`- COZE_BUCKET_NAME: ${process.env.NEXT_PUBLIC_COZE_BUCKET_NAME || '服务器端变量'}`);

      // 简单的测试：创建一个API路由来测试上传
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/test-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        addLog(`上传成功: ${JSON.stringify(result)}`);
      } else {
        const error = await response.text();
        addLog(`上传失败: ${response.status} - ${error}`);
      }
    } catch (error) {
      addLog(`错误: ${error instanceof Error ? error.message : '未知错误'}`);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">文件上传测试页面</h1>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
            disabled={isUploading}
          />
          <label 
            htmlFor="file-input"
            className={`inline-block px-6 py-3 bg-blue-600 text-white rounded cursor-pointer ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isUploading ? '上传中...' : '选择文件或拖拽到此处'}
          </label>
        </div>

        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <h3 className="text-white mb-2">日志:</h3>
          {logs.length === 0 ? (
            <p className="text-gray-400">等待操作...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}