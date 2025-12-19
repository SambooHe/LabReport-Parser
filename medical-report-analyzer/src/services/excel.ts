import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { MedicalIndicator, AnalyzedResult } from '@/types/medical';

export function exportToExcel(results: AnalyzedResult[]): void {
  try {
    // 准备Excel数据
    const wsData: any[][] = [];
    
    // 添加标题行
    wsData.push(['医院检查检验单数据分析']);
    wsData.push([]);
    
    // 添加列头
    wsData.push(['文件名', '上传时间', '检验项目', '检测结果', '单位', '参考范围', '状态']);
    
    // 添加数据行
    results.forEach(result => {
      if (result.indicators.length === 0) {
        // 如果没有指标数据，也添加一行基本信息
        wsData.push([result.fileName, result.uploadedAt, '无识别数据', '', '', '', '']);
      } else {
        // 为每个指标添加一行，第一行包含文件信息
        result.indicators.forEach((indicator, index) => {
          wsData.push([
            index === 0 ? result.fileName : '', // 只在第一行显示文件名
            index === 0 ? result.uploadedAt : '', // 只在第一行显示上传时间
            indicator.name,
            indicator.value,
            indicator.unit,
            indicator.referenceRange,
            getStatusText(indicator.status)
          ]);
        });
      }
      // 添加空行分隔不同文件
      wsData.push([]);
    });

    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // 设置列宽
    const colWidths = [
      { wch: 20 }, // 文件名
      { wch: 20 }, // 上传时间
      { wch: 25 }, // 检验项目
      { wch: 15 }, // 检测结果
      { wch: 10 }, // 单位
      { wch: 20 }, // 参考范围
      { wch: 10 }  // 状态
    ];
    ws['!cols'] = colWidths;

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '检验单数据分析');

    // 生成Excel文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // 保存文件
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const fileName = `医疗检验单分析_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
    
  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Excel导出失败，请重试');
  }
}

export function exportSingleResultToExcel(result: AnalyzedResult): void {
  exportToExcel([result]);
}

function getStatusText(status: MedicalIndicator['status']): string {
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
}