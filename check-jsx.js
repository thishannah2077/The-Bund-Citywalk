const fs = require('fs');

// 读取HTML文件
const htmlContent = fs.readFileSync('/Users/a1/Documents/trae_projects/hongshu/xiaohongshu-cover-generator-finalnew.html', 'utf8');

// 提取script标签中的内容
const scriptMatch = htmlContent.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

if (!scriptMatch) {
  console.error('未找到Babel脚本标签');
  process.exit(1);
}

const jsxContent = scriptMatch[1];

// 查找所有map函数及其上下文
const lines = jsxContent.split('\n');
let inMapFunction = false;
let mapStartLine = 0;
let mapParenCount = 0;
let mapBraceCount = 0;

lines.forEach((line, index) => {
  // 检测map函数开始
  if (line.match(/\.map\s*\(/)) {
    inMapFunction = true;
    mapStartLine = index + 1;
    mapParenCount = 1;
    mapBraceCount = 0;
    
    // 检查这一行是否包含箭头函数
    if (line.match(/=>/)) {
      // 检查箭头函数后是否有括号包裹
      const afterArrow = line.split('=>')[1];
      if (afterArrow && afterArrow.trim().startsWith('<') && !afterArrow.includes('(')) {
        console.log(`第 ${index + 1} 行: 箭头函数返回JSX元素但没有用括号包裹`);
        console.log(`  ${line.trim()}`);
      }
    }
  }
  
  if (inMapFunction) {
    // 计算括号和花括号
    mapParenCount += (line.match(/\(/g) || []).length;
    mapParenCount -= (line.match(/\)/g) || []).length;
    mapBraceCount += (line.match(/\{/g) || []).length;
    mapBraceCount -= (line.match(/\}/g) || []).length;
    
    // 如果括号计数回到0，map函数结束
    if (mapParenCount === 0 && line.includes(')')) {
      inMapFunction = false;
    }
  }
});

// 检查所有模板定义
console.log('\n检查模板定义...');
let inTemplate = false;
let templateStartLine = 0;
let templateParenCount = 0;
let templateBraceCount = 0;
let templateName = '';

lines.forEach((line, index) => {
  // 检测模板定义开始
  const templateMatch = line.match(/(\w+):\s*\(\)\s*=>/);
  if (templateMatch && !inTemplate) {
    inTemplate = true;
    templateStartLine = index + 1;
    templateName = templateMatch[1];
    templateParenCount = 0;
    templateBraceCount = 0;
  }
  
  if (inTemplate) {
    // 计算括号和花括号
    templateParenCount += (line.match(/\(/g) || []).length;
    templateParenCount -= (line.match(/\)/g) || []).length;
    templateBraceCount += (line.match(/\{/g) || []).length;
    templateBraceCount -= (line.match(/\}/g) || []).length;
    
    // 检查模板是否结束（逗号后跟换行，且括号和花括号计数为0）
    if (templateParenCount === 0 && templateBraceCount === 0 && line.match(/^\s*\),?\s*$/)) {
      console.log(`模板 ${templateName}: 第 ${templateStartLine} - ${index + 1} 行`);
      inTemplate = false;
    }
  }
});

// 检查是否有未闭合的JSX标签
console.log('\n检查JSX标签...');
let jsxTagCount = 0;
lines.forEach((line, index) => {
  // 简单的JSX标签计数
  const openTags = (line.match(/<[a-zA-Z][^>]*>/g) || []).length;
  const closeTags = (line.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
  jsxTagCount += openTags - closeTags;
  
  if (jsxTagCount > 10) {
    console.log(`第 ${index + 1} 行: JSX标签嵌套过深 (${jsxTagCount})`);
    jsxTagCount = 0;
  }
});
