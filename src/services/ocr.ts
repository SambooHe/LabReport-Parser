import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, BaseMessage, AIMessageChunk } from "@langchain/core/messages";

interface ModelConfig {
  model: string;
  temperature?: number;
  max_tokens?: number;
}

export async function* callLLM(
  messages: BaseMessage[],
  config: ModelConfig
): AsyncGenerator<AIMessageChunk> {
  const apiKey = process.env.COZE_WORKLOAD_IDENTITY_API_KEY;
  const baseURL = process.env.COZE_INTEGRATION_MODEL_BASE_URL;
  
  if (!baseURL || !apiKey) {
    throw new Error("Missing environment variables for LLM integration");
  }

  const streaming = true;

  const llm = new ChatOpenAI({
    modelName: config.model || "doubao-seed-1-6-vision-250815",
    apiKey: apiKey,
    configuration: {
      baseURL: baseURL,
    },
    streaming: streaming,
    temperature: config.temperature,
    maxTokens: config.max_tokens,
  });

  const stream = await llm.stream(messages);

  for await (const chunk of stream) {
    yield chunk;
  }
}

export async function extractMedicalData(imageUrl: string): Promise<string> {
  const messages: BaseMessage[] = [
    new SystemMessage(`你是一个专业的医疗检验单分析助手。请仔细分析图片中的医疗检验单，提取所有检验项目的信息。

请按照以下格式返回结构化数据：
1. 项目名称：实际检测的指标名称
2. 检测结果：该指标的具体数值
3. 单位：检测值的计量单位
4. 参考范围：正常值的范围区间
5. 状态：根据检测结果与参考范围判断（正常/异常/偏低/偏高）

请确保提取的信息准确完整，并按照清晰的格式组织输出。如果某些信息无法识别，请明确标注。`),
    new HumanMessage({
      content: [
        {
          type: "text",
          text: "请分析这张医疗检验单图片，提取所有检验项目的信息。"
        },
        {
          type: "image_url",
          image_url: { url: imageUrl }
        }
      ]
    })
  ];

  const config: ModelConfig = {
    model: "doubao-seed-1-6-vision-250815",
    temperature: 0.1,
    max_tokens: 2000
  };

  let fullResponse = "";
  try {
    for await (const chunk of callLLM(messages, config)) {
      fullResponse += chunk.content;
    }
    return fullResponse;
  } catch (error) {
    console.error("OCR extraction failed:", error);
    throw new Error("Failed to extract medical data from image");
  }
}

export function parseMedicalIndicators(rawText: string): Array<{
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
  
  for (const line of lines) {
    // 尝试匹配常见的检验单格式
    // 格式1: 项目名称 结果 单位 参考范围 状态
    const match1 = line.match(/^(.+?)\s+([\d.]+)\s+([a-zA-Zμ%/]+)\s+([\d.-]+\s*-\s*[\d.]+)\s*(.*)$/);
    if (match1) {
      const [, name, value, unit, referenceRange, statusText] = match1;
      indicators.push({
        id: `indicator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        value: value.trim(),
        unit: unit.trim(),
        referenceRange: referenceRange.trim(),
        status: parseStatus(statusText.trim())
      });
      continue;
    }

    // 格式2: 项目名称: 结果 单位 (参考范围)
    const match2 = line.match(/^(.+?):\s*([\d.]+)\s*([a-zA-Zμ%/]+)\s*\(([^)]+)\)\s*(.*)$/);
    if (match2) {
      const [, name, value, unit, referenceRange, statusText] = match2;
      indicators.push({
        id: `indicator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        value: value.trim(),
        unit: unit.trim(),
        referenceRange: referenceRange.trim(),
        status: parseStatus(statusText.trim())
      });
      continue;
    }

    // 格式3: 简单格式 - 包含数值和单位的行
    const match3 = line.match(/^(.+?)\s+([\d.]+)\s*([a-zA-Zμ%/]+)\s*(.*)$/);
    if (match3 && line.length > 10) { // 避免匹配到太短的行
      const [, name, value, unit, rest] = match3;
      indicators.push({
        id: `indicator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        value: value.trim(),
        unit: unit.trim(),
        referenceRange: rest.includes('参考') ? rest.trim() : '',
        status: 'normal'
      });
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