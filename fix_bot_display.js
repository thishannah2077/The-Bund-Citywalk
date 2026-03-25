const fs = require('fs');
let content = fs.readFileSync('xiaohongshu-cover-generator-optimized.html', 'utf8');

// 修复底部文字显示 - 添加条件渲染
// 匹配 pattern: <div style={{...}}>{s.bot}</div> 但没有 s.bot && 的情况

// 这些是已经正确处理的情况，跳过
const alreadyFixed = [
  '{s.bot && <div',
  '{s.bot ?'
];

// 需要修复的模式 - 将 <div...>{s.bot}</div> 改为 {s.bot && <div...>{s.bot}</div>}
// 但要小心不要重复修改

// 方法：找到所有包含 {s.bot} 的行，检查是否已经有条件渲染
const lines = content.split('\n');
const newLines = lines.map((line, idx) => {
  // 如果行已经包含条件渲染，跳过
  if (line.includes('s.bot &&') || line.includes('s.bot ?')) {
    return line;
  }
  
  // 如果行包含 {s.bot} 并且是 div 显示
  if (line.includes('{s.bot}') && line.includes('<div')) {
    // 检查是否已经在条件块中（前一行有 s.bot &&）
    const prevLine = idx > 0 ? lines[idx - 1] : '';
    if (prevLine.includes('s.bot &&') || prevLine.includes('s.bot ?')) {
      return line;
    }
    
    // 添加条件渲染
    return line.replace(/<div/, '{s.bot && <div').replace(/>\{s\.bot\}<\/div>/, '>{s.bot}</div>}');
  }
  
  return line;
});

content = newLines.join('\n');
fs.writeFileSync('xiaohongshu-cover-generator-optimized.html', content);
console.log('Done fixing bot display');
