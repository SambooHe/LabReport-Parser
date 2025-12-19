#!/usr/bin/env node

// 测试OCR识别功能的脚本
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// 获取部署端口
const PORT = process.env.DEPLOY_RUN_PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function testOCRWithDifferentImages() {
  console.log('开始测试OCR识别功能...');
  
  try {
    // 测试1: 上传第一张测试图片
    console.log('\n=== 测试1: 上传第一张图片 ===');
    const uploadResult1 = await uploadTestImage('test1');
    console.log('图片1上传结果:', uploadResult1.fileKey);
    
    if (uploadResult1.success) {
      const analysis1 = await analyzeImage(uploadResult1.fileKey);
      console.log('图片1识别结果预览:');
      console.log(analysis1.rawText?.substring(0, 200) + '...');
      console.log('识别项目数量:', analysis1.indicators?.length || 0);
    }
    
    // 测试2: 上传第二张测试图片
    console.log('\n=== 测试2: 上传第二张图片 ===');
    const uploadResult2 = await uploadTestImage('test2');
    console.log('图片2上传结果:', uploadResult2.fileKey);
    
    if (uploadResult2.success) {
      const analysis2 = await analyzeImage(uploadResult2.fileKey);
      console.log('图片2识别结果预览:');
      console.log(analysis2.rawText?.substring(0, 200) + '...');
      console.log('识别项目数量:', analysis2.indicators?.length || 0);
    }
    
    // 比较：验证不同图片返回不同结果
    console.log('\n=== 验证结果 ===');
    if (uploadResult1.success && uploadResult2.success) {
      const analysis1 = await analyzeImage(uploadResult1.fileKey);
      const analysis2 = await analyzeImage(uploadResult2.fileKey);
      
      if (analysis1.rawText !== analysis2.rawText) {
        console.log('✅ 成功！不同图片返回了不同的识别结果');
      } else {
        console.log('❌ 失败！不同图片返回了相同的识别结果');
      }
    }
    
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

async function uploadTestImage(imageId) {
  try {
    const form = new FormData();
    
    // 创建一个测试图片（使用不同的随机数据）
    const testData = Buffer.from(`TEST_IMAGE_${imageId}_${Math.random().toString(36).substring(7)}`);
    form.append('file', testData, {
      filename: `${imageId}_test.jpg`,
      contentType: 'image/jpeg'
    });
    
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error(`上传图片${imageId}失败:`, error);
    return { success: false, error: error.message };
  }
}

async function analyzeImage(fileKey) {
  try {
    const response = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileKey })
    });
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('分析图片失败:', error);
    return { success: false, error: error.message };
  }
}

// 运行测试
testOCRWithDifferentImages();