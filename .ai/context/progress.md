# ERP项目进度上下文

- 当前阶段：路由系统重构完成（稳定版）+ Mock数据层统一 + 分页逻辑修复 + 单元测试工程化改造 + **覆盖率报告净化**
- 新增内容：
  1. **Istanbul配置优化**：创建 `.nycrc` 配置文件，设置 `"html.skipTimestamp": true`
  2. **移除时间戳**：彻底消除覆盖率HTML报告中动态生成的时间戳，避免Git产生无意义文件变动
  3. **配置标准化**：使用行业标准的 nyc 配置文件，替代复杂的脚本后处理
- 当前行为：
  1. 运行 `pnpm test:coverage` 生成的HTML报告不再包含时间戳
  2. `coverage/` 目录内容稳定，适合纳入版本控制或CI缓存
  3. 测试环境时间Mock与覆盖率报告生成完全解耦
- 技术细节：
  - 使用 `.nycrc` 配置 Istanbul（Vitest coverage provider）
  - 配置项 `"html.skipTimestamp": true` 直接生效
  - 无需 `vi.setSystemTime()` 等时间Mock手段
- 最近更新：2026-07-26T15:30:00.000Z
- 下一步可选动作（按优先级）：
  1. 【工程化】配置 Husky + lint-staged（commit前自动跑test:coverage）
  2. 【工程化】配置 CI 流水线，利用稳定的覆盖率报告进行趋势分析
  3. 【功能】部门管理页（Dept Management）
- n8n执行建议：
  1. 自动化部署前执行 `pnpm test:coverage`
  2. 由于报告内容稳定，可在 n8n 中配置文件哈希比对，检测覆盖率真实变化
  3. 设置覆盖率阈值，阻断覆盖率下降的部署
