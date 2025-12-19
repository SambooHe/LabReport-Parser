import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from '../../../storage/s3/s3Storage';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

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

    // 使用多模态大模型进行真实的OCR识别
    const rawText = await performOCR(imageUrl);
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

async function performOCR(imageUrl: string): Promise<string> {
  try {
    console.log('开始OCR识别，图片URL:', imageUrl);
    
    const apiKey = process.env.COZE_WORKLOAD_IDENTITY_API_KEY;
    const baseURL = process.env.COZE_INTEGRATION_MODEL_BASE_URL;
    
    if (!baseURL || !apiKey) {
      throw new Error("Missing environment variables: COZE_INTEGRATION_BASE_URL or COZE_WORKLOAD_IDENTITY_API_KEY");
    }

    // 使用视觉模型进行OCR识别
    const llm = new ChatOpenAI({
      modelName: "doubao-seed-1-6-vision-250815", // 使用视觉模型
      apiKey: apiKey,
      configuration: {
        baseURL: baseURL,
      },
      streaming: false, // OCR需要完整结果
      temperature: 0.1, // 低温度确保准确性
      maxTokens: 2000,
    });

    const messages = [
      new SystemMessage(`你是一个专业的医疗检验单OCR识别专家。请仔细分析图片中的医疗检验报告，提取所有可见的检验指标数据。

要求：
1. 识别图片中所有的检验项目名称
2. 提取每个项目的检测值/结果
3. 识别单位信息
4. 提取参考范围
5. 判断状态（正常/异常/偏高/偏低）
6. 按照下面的格式输出，每行一个字段：

项目：[项目名称]
检测结果：[检测值]
单位：[单位]
参考范围：[参考范围]
状态：[状态]

注意：
- 只输出图片中真实存在的数据，不要编造任何内容
- 如果某些字段在图片中不存在，可以省略
- 保持数据准确性，这是医疗数据
- 连续输出多个指标，每个指标之间用空行分隔`),
      new HumanMessage({
        content: [
          { 
            type: "text", 
            text: "请识别这张医疗检验单中的所有数据" 
          },
          { 
            type: "image_url", 
            image_url: { url: imageUrl } 
          }
        ]
      })
    ];

    console.log('发送请求到视觉模型...');
    
    let fullResponse = "";
    const stream = await llm.stream(messages);
    
    for await (const chunk of stream) {
      fullResponse += chunk.content;
    }
    
    console.log('OCR识别完成，结果长度:', fullResponse.length);
    console.log('识别结果预览:', fullResponse.substring(0, 200) + '...');
    
    if (!fullResponse || fullResponse.trim().length < 20) {
      throw new Error('OCR识别结果为空或过短');
    }
    
    return fullResponse;
    
  } catch (error) {
    console.error('OCR识别失败，详细错误:', error);
    throw new Error('OCR识别失败: ' + (error instanceof Error ? error.message : '未知错误'));
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
  
  console.log('开始解析医疗指标，原始文本长度:', rawText.length);
  
  // 按空行分割文本块
  const sections = rawText.split(/\n\s*\n/).filter(section => section.trim());
  
  console.log('找到的区块数量:', sections.length);
  
  for (const section of sections) {
    const lines = section.split('\n').filter(line => line.trim());
    const currentIndicator: any = {};
    
    console.log('处理区块:', lines);
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 匹配项目名称（多种可能的前缀）
      if (trimmedLine.match(/^项目[：:]|^指标[：:]|^检验项目[：:]/i)) {
        currentIndicator.name = trimmedLine.replace(/^(项目|指标|检验项目)[：:]/, '').trim();
        currentIndicator.id = `indicator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      // 匹配检测结果（多种可能的前缀）
      else if (trimmedLine.match(/^检测结果[：:]|^结果[：:]|^测定值[：:]|^数值[：:]/i)) {
        currentIndicator.value = trimmedLine.replace(/^(检测结果|结果|测定值|数值)[：:]/, '').trim();
      }
      // 匹配单位
      else if (trimmedLine.match(/^单位[：:]/i)) {
        currentIndicator.unit = trimmedLine.replace(/^单位[：:]/, '').trim();
      }
      // 匹配参考范围（多种可能的前缀）
      else if (trimmedLine.match(/^参考范围[：:]|^参考值[：:]|^正常范围[：:]|^范围[：:]/i)) {
        currentIndicator.referenceRange = trimmedLine.replace(/^(参考范围|参考值|正常范围|范围)[：:]/, '').trim();
      }
      // 匹配状态
      else if (trimmedLine.match(/^状态[：:]|^结果状态[：:]/i)) {
        currentIndicator.status = parseStatus(trimmedLine.replace(/^状态[：:]|^结果状态[：:]/, '').trim());
      }
      // 尝试从自由格式中提取信息
      else {
        // 尝试匹配类似 "白细胞 5.2 10^9/L 4.0-10.0 正常" 的格式
        const parts = trimmedLine.split(/\s+/);
        if (parts.length >= 3 && !currentIndicator.name) {
          currentIndicator.name = parts[0];
          currentIndicator.value = parts[1];
          currentIndicator.unit = parts[2];
          if (parts.length >= 4) {
            currentIndicator.referenceRange = parts[3];
          }
          if (parts.length >= 5) {
            currentIndicator.status = parseStatus(parts[4]);
          }
          currentIndicator.id = `indicator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
      }
    }
    
    // 如果有完整的数据，添加到indicators数组
    if (currentIndicator.name && currentIndicator.value) {
      // 确保有默认状态
      if (!currentIndicator.status) {
        currentIndicator.status = 'normal';
      }
      
      indicators.push({
        id: currentIndicator.id,
        name: currentIndicator.name,
        value: currentIndicator.value,
        unit: currentIndicator.unit || '',
        referenceRange: currentIndicator.referenceRange || '',
        status: currentIndicator.status
      });
      
      console.log('添加指标:', currentIndicator.name, currentIndicator.value);
    }
  }

  console.log('总共解析到', indicators.length, '个指标');
  return indicators;
}

function parseStatus(statusText: string): 'normal' | 'abnormal' | 'warning' {
  if (!statusText) {
    return 'normal';
  }
  
  const lowerStatus = statusText.toLowerCase();
  
  // 正常状态
  if (lowerStatus.includes('正常') || 
      lowerStatus.includes('normal') || 
      lowerStatus.includes('参考范围内') ||
      lowerStatus.includes('参考值内') ||
      lowerStatus.includes('(-)') ||
      lowerStatus.includes('negative') ||
      lowerStatus === '') {
    return 'normal';
  }
  
  // 异常状态
  if (lowerStatus.includes('异常') || 
      lowerStatus.includes('abnormal') || 
      lowerStatus.includes('高') || 
      lowerStatus.includes('↑') ||
      lowerStatus.includes('偏高') ||
      lowerStatus.includes('低') || 
      lowerStatus.includes('↓') ||
      lowerStatus.includes('偏低') ||
      lowerStatus.includes('阳性') ||
      lowerStatus.includes('positive') ||
      lowerStatus.includes('(+)')) {
    return 'abnormal';
  }
  
  // 警告状态
  return 'warning';
}