import { S3Storage } from '../storage/s3/s3Storage';

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

export async function uploadMedicalReport(file: File): Promise<{
  fileKey: string;
  fileName: string;
  fileUrl: string;
}> {
  try {
    // 生成唯一的文件名，保留原始扩展名
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueId = generateUUID();
    const fileName = `medical-report_${uniqueId}.${fileExtension}`;
    
    // 将文件转换为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 上传到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type || 'application/octet-stream',
    });

    // 生成签名URL用于访问
    const fileUrl = await storage.generatePresignedUrl({ 
      key: fileKey, 
      expireTime: 3600 // 1小时有效期
    });

    return {
      fileKey,
      fileName: file.name,
      fileUrl
    };
  } catch (error) {
    console.error('File upload failed:', error);
    throw new Error('文件上传失败，请重试');
  }
}

export async function generateImageUrl(fileKey: string): Promise<string> {
  try {
    return await storage.generatePresignedUrl({ 
      key: fileKey, 
      expireTime: 3600 
    });
  } catch (error) {
    console.error('Failed to generate image URL:', error);
    throw new Error('生成图片访问链接失败');
  }
}

// 生成UUID的简单实现
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}