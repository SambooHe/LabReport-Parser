import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from '@/storage/s3/s3Storage';

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '请上传图片文件' }, { status: 400 });
    }

    // 生成安全的文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeFileName = `medical_report_${timestamp}_${randomStr}`;

    // 将文件转换为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到对象存储
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: safeFileName,
      contentType: file.type || 'application/octet-stream',
    });

    // 生成签名URL
    const fileUrl = await storage.generatePresignedUrl({ 
      key: fileKey, 
      expireTime: 3600 
    });

    return NextResponse.json({
      fileKey,
      fileName: file.name,
      fileUrl,
      message: '上传成功'
    });

  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : '上传失败'
    }, { status: 500 });
  }
}