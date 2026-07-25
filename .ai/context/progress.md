# ERP项目进度上下文

- 当前阶段：路由系统重构完成（稳定版）+ Mock数据层统一 + 分页逻辑修复 + **单元测试工程化改造**
- 新增内容：
  1. **测试目录标准化**：建立 `test/unit` 目录，统一管理所有单元测试文件，替代原有的 `__tests__` 散落模式
  2. **Vitest配置优化**：配置 `include` 扫描 `test` 目录，配置 `resolveAlias` 支持 `@` 路径别名
  3. **全局测试环境**：创建 `test/setup.ts`，全局注册 Element Plus 及必要的 DOM Mocks
- 当前行为：
  1. 运行 `pnpm test` 会自动扫描 `test` 目录下的 `.spec.ts` 文件
  2. 测试文件可通过 `@/` 直接访问 `src` 内的模块，无需冗长相对路径
  3. 测试环境模拟 JSDOM，支持 Vue 组件渲染
- 目录结构变更：
  - 移除 `src/**/__tests__/`
  - 新增 `test/unit/composables/`
  - 新增 `test/unit/mock/`
  - 新增 `test/unit/views/`
- 最近更新：2026-07-24T23:00:00.000Z
- 下一步可选动作（按优先级）：
  1. 【工程化】配置 Husky + lint-staged，实现 Commit 前自动运行 affected tests
  2. 【质量】补充 `useDialog` 和 `userService` 的单元测试
  3. 【功能】创建部门管理页（Dept Management）
- n8n执行建议：
  1. 在自动化构建流程中，加入 `pnpm test` 步骤，确保测试通过方可部署
  2. 监控测试覆盖率变化，防止核心逻辑覆盖率下降
