# 小红书封面生成器 - 图标保存和主标题块添加实现计划

## 任务分析

根据用户需求，我们需要验证以下两个功能：
1. 修复图标保存问题
2. 添加一个新的主标题块title2，与现有title块完全一样但默认无文字

## 已完成的工作

通过代码检查，发现所有功能都已经实现：

### 1. 图标保存功能
- `loadDraft` 函数已正确处理 `icons` 字段：`icons: parsed.icons || []`
- `saveDraft` 函数保存了除 `img` 外的所有字段，包括 `icons`
- 代码中已经有添加、更新和删除图标的功能
- `saveCustomTpl` 函数已正确保存 `icons` 字段
- `handleUseTpl` 函数已正确加载 `icons` 字段

### 2. 主标题块title2
- `DEF` 对象中已添加 `title2` 字段，默认值为空字符串
- `textBlocks` 配置中已添加 `title2` 的详细配置，与 `title` 完全相同
- `off` 对象中已添加 `title2` 的默认位置
- 所有布局中已添加 `title2` 的渲染
- `saveCustomTpl` 函数已添加 `title2` 字段的保存
- `handleUseTpl` 函数已添加 `title2` 字段的加载

## 验证计划

### [x] 任务1：验证图标保存功能
- **Priority**: P0
- **Depends On**: None
- **Description**: 验证图标是否能够正确保存和加载
- **Success Criteria**: 图标在页面刷新后仍然存在
- **Test Requirements**:
  - `programmatic` TR-1.1: 添加图标后刷新页面，图标仍然存在
  - `programmatic` TR-1.2: 保存为自定义模板后，图标在模板中正确显示
- **Notes**: 检查localStorage中是否正确存储了icons字段

### [x] 任务2：验证主标题块title2功能
- **Priority**: P0
- **Depends On**: None
- **Description**: 验证title2主标题块是否正确显示和保存
- **Success Criteria**: title2主标题块与title块完全一样，默认无文字
- **Test Requirements**:
  - `programmatic` TR-2.1: title2主标题块在所有布局中正确显示
  - `programmatic` TR-2.2: title2主标题块的内容在页面刷新后仍然存在
  - `programmatic` TR-2.3: title2主标题块的内容在保存为自定义模板后正确显示
- **Notes**: 检查title2是否在所有布局中都有正确的渲染代码

## 测试步骤

1. 打开小红书封面生成器页面
2. 添加一个图标到画布
3. 刷新页面，检查图标是否仍然存在
4. 保存当前配置为自定义模板
5. 切换到其他模板，然后切换回刚才保存的模板，检查图标是否仍然存在
6. 在title2主标题块中输入文字
7. 刷新页面，检查title2中的文字是否仍然存在
8. 保存当前配置为自定义模板
9. 切换到其他模板，然后切换回刚才保存的模板，检查title2中的文字是否仍然存在

## 预期结果

- 图标能够正确保存和加载
- title2主标题块与title块完全一样，默认无文字
- title2主标题块的内容能够正确保存和加载
