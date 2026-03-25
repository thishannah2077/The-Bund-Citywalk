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

// 检查常见的JSX语法错误
const errors = [];

// 检查未闭合的括号
const openParens = (jsxContent.match(/\(/g) || []).length;
const closeParens = (jsxContent.match(/\)/g) || []).length;
if (openParens !== closeParens) {
  errors.push(`括号不匹配: 开括号 ${openParens}, 闭括号 ${closeParens}`);
}

// 检查未闭合的花括号
const openBraces = (jsxContent.match(/\{/g) || []).length;
const closeBraces = (jsxContent.match(/\}/g) || []).length;
if (openBraces !== closeBraces) {
  errors.push(`花括号不匹配: 开括号 ${openBraces}, 闭括号 ${closeBraces}`);
}

// 检查未闭合的尖括号（JSX标签）
const openAngles = (jsxContent.match(/</g) || []).length;
const closeAngles = (jsxContent.match(/>/g) || []).length;
if (openAngles !== closeAngles) {
  errors.push(`尖括号不匹配: 开括号 ${openAngles}, 闭括号 ${closeAngles}`);
}

// 检查箭头函数中的JSX元素
const arrowFunctionMatches = jsxContent.match(/=>\s*<[^>]*>/g);
if (arrowFunctionMatches) {
  console.log(`找到 ${arrowFunctionMatches.length} 个箭头函数返回JSX元素的模式`);
  arrowFunctionMatches.slice(0, 5).forEach((match, i) => {
    console.log(`  ${i + 1}. ${match.substring(0, 50)}...`);
  });
}

// 检查map函数中的JSX
const mapMatches = jsxContent.match(/\.map\([^)]*=>/g);
if (mapMatches) {
  console.log(`\n找到 ${mapMatches.length} 个map函数`);
  
  // 检查是否有未用括号包裹的map返回
  const problematicMaps = jsxContent.match(/\.map\([^)]*=>\s*<[a-zA-Z]/g);
  if (problematicMaps) {
    console.log(`\n警告: 找到 ${problematicMaps.length} 个可能未用括号包裹的map返回`);
    problematicMaps.slice(0, 5).forEach((match, i) => {
      console.log(`  ${i + 1}. ${match}...`);
    });
  }
}

if (errors.length > 0) {
  console.log('\n发现的错误:');
  errors.forEach(err => console.log(`  - ${err}`));
} else {
  console.log('\n基本语法检查通过');
}

// 检查模板定义
const templateMatches = jsxContent.match(/\w+:\s*\(\)\s*=>/g);
console.log(`\n找到 ${templateMatches ? templateMatches.length : 0} 个模板定义`);
