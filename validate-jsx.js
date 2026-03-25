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

// 尝试使用简单的正则表达式检查JSX语法
// 检查是否有未闭合的JSX标签
const lines = jsxContent.split('\n');
let jsxStack = [];
let errors = [];

lines.forEach((line, index) => {
  // 跳过注释和字符串
  const cleanLine = line.replace(/"[^"]*"/g, '""').replace(/'[^']*'/g, "''").replace(/`[^`]*`/g, '``');
  
  // 查找JSX标签
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*|D|div|span|option|select|button|input|label|p|h[1-6]|ul|ol|li|table|tr|td|th|thead|tbody|tfoot|form|textarea|a|img|br|hr|meta|link|script|style|head|body|html|header|footer|nav|section|article|aside|main|figure|figcaption|details|summary|dialog|canvas|video|audio|source|track|embed|object|param|iframe|noscript|template|slot|component|Fragment|Suspense|StrictMode|Profiler|Portal|CustomTplBtn|TplBtn|Tg)(?:\s[^>]*)?\/?>/g;
  
  let match;
  while ((match = tagRegex.exec(cleanLine)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    
    // 自闭合标签
    if (fullTag.endsWith('/>')) {
      continue;
    }
    
    // 闭合标签
    if (fullTag.startsWith('</')) {
      if (jsxStack.length === 0) {
        errors.push(`第 ${index + 1} 行: 多余的闭合标签 </${tagName}>`);
      } else {
        const lastTag = jsxStack.pop();
        if (lastTag !== tagName) {
          errors.push(`第 ${index + 1} 行: 标签不匹配，期望 </${lastTag}>，但找到 </${tagName}>`);
        }
      }
    } else {
      // 开标签
      jsxStack.push(tagName);
    }
  }
});

if (jsxStack.length > 0) {
  errors.push(`未闭合的标签: ${jsxStack.join(', ')}`);
}

if (errors.length > 0) {
  console.log('发现的JSX语法错误:');
  errors.slice(0, 20).forEach(err => console.log(`  - ${err}`));
  if (errors.length > 20) {
    console.log(`  ... 还有 ${errors.length - 20} 个错误`);
  }
} else {
  console.log('JSX语法检查通过！');
}
