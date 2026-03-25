const fs = require('fs');
let content = fs.readFileSync('xiaohongshu-cover-generator-optimized.html', 'utf8');

// 替换额外文本样式 - 移除边框
content = content.replace(
  /padding: "4px 10px", borderRadius: 999, border: `1px solid \${t\.ac}`, fontSize: s\.extra1Size, color: tc, display: "inline-flex", alignItems: "center", gap: 4/g,
  'fontSize: s.extra1Size, color: tc'
);

// 移除 <span>{s.extra1}</span> 包装
content = content.replace(
  /<span>\{s\.extra1\}<\/span>/g,
  '{s.extra1}'
);

fs.writeFileSync('xiaohongshu-cover-generator-optimized.html', content);
console.log('Done');
