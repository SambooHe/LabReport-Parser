import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from '../../../storage/s3/s3Storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileKey } = body;

    if (!fileKey) {
      return NextResponse.json({ error: '缺少文件Key' }, { status: 400 });
    }

    console.log('Analyzing file:', fileKey);

    // 重新生成图片URL
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: "",
      secretKey: "",
      bucketName: process.env.COZE_BUCKET_NAME,
      region: "cn-beijing",
    });

    const imageUrl = await storage.generatePresignedUrl({ 
      key: fileKey, 
      expireTime: 3600 
    });

    console.log('Generated image URL:', imageUrl);

    // 模拟OCR识别结果（用于演示）
    const rawText = `项目：白细胞
检测结果：5.6
单位：10^9/L
参考范围：4.0-10.0
状态：正常

项目：红细胞
检测结果：4.5
单位：10^12/L
参考范围：3.5-5.5
状态：正常

项目：血红蛋白
检测结果：140
单位：g/L
参考范围：110-160
状态：正常

项目：血小板
检测结果：220
单位：10^9/L
参考范围：100-300
状态：正常

项目：血糖
检测结果：5.2
单位：mmol/L
参考范围：3.9-6.1
状态：正常`;

    console.log('OCR result length:', rawText.length);

    // 解析医疗指标数据
    const indicators = parseMedicalIndicators(rawText);
    console.log('Parsed indicators:', indicators.length, 'items');

    return NextResponse.json({
      success: true,
      rawText,
      indicators,
      message: '分析完成'
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : '分析失败',
      details: error?.toString()
    }, { status: 500 });
  }
}

function parseMedicalIndicators(rawText: string): Array<{
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'warning';
}> {
  const indicators: Array<{
    id: string;
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'warning';
  }> = [];
  const lines = rawText.split('\n').filter(line => line.trim());
  
  let currentIndicator: any = {};
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 匹配项目名称
    if (trimmedLine.startsWith('项目：')) {
      currentIndicator.name = trimmedLine.replace('项目：', '').trim();
      currentIndicator.id = `indicator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    // 匹配检测结果
    else if (trimmedLine.startsWith('检测结果：')) {
      currentIndicator.value = trimmedLine.replace('检测结果：', '').trim();
    }
    // 匹配单位
    else if (trimmedLine.startsWith('单位：')) {
      currentIndicator.unit = trimmedLine.replace('单位：', '').trim();
    }
    // 匹配参考范围
    else if (trimmedLine.startsWith('参考范围：')) {
      currentIndicator.referenceRange = trimmedLine.replace('参考范围：', '').trim();
    }
    // 匹配状态
    else if (trimmedLine.startsWith('状态：')) {
      currentIndicator.status = parseStatus(trimmedLine.replace('状态：', '').trim());
      
      // 如果有完整的数据，添加到indicators数组
      if (currentIndicator.name && currentIndicator.value) {
        indicators.push({
          id: currentIndicator.id,
          name: currentIndicator.name,
          value: currentIndicator.value,
          unit: currentIndicator.unit || '',
          referenceRange: currentIndicator.referenceRange || '',
          status: currentIndicator.status
        });
      }
      
      // 重置当前指标
      currentIndicator = {};
    }
  }

  return indicators;
}

function parseStatus(statusText: string): 'normal' | 'abnormal' | 'warning' {
  const lowerStatus = statusText.toLowerCase();
  if (lowerStatus.includes('正常') || lowerStatus.includes('normal') || lowerStatus === '') {
    return 'normal';
  }
  if (lowerStatus.includes('异常') || lowerStatus.includes('abnormal') || 
      lowerStatus.includes('高') || lowerStatus.includes('高') ||
      lowerStatus.includes('低') || lowerStatus.includes('低')) {
    return 'abnormal';
  }
  return 'warning';
}