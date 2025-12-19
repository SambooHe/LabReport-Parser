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
    console.log('API: 开始处理上传请求');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    console.log('API: 获取到文件:', file.name, file.type, file.size);

    // 生成安全的文件名
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const safeFileName = `test_upload_${timestamp}_${randomStr}`;
    
    console.log('API: 生成安全文件名:', safeFileName);

    // 将文件转换为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('API: 文件转换为Buffer成功，大小:', buffer.length);

    // 上传到对象存储
    console.log('API: 开始上传到S3存储');
    const fileKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: safeFileName,
      contentType: file.type || 'application/octet-stream',
    });

    console.log('API: 上传成功，fileKey:', fileKey);

    // 生成签名URL
    const fileUrl = await storage.generatePresignedUrl({ 
      key: fileKey, 
      expireTime: 3600 
    });

    console.log('API: 生成签名URL成功');

    return NextResponse.json({
      success: true,
      fileKey,
      fileName: file.name,
      fileUrl,
      message: '上传成功'
    });

  } catch (error) {
    console.error('API: 上传失败:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : '上传失败',
      details: error?.toString()
    }, { status: 500 });
  }
}