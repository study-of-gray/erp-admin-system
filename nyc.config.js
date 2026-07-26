module.exports = {
  reporter: ['text', 'json', 'html'],
  reportDir: './coverage',
  exclude: ['test/**', 'node_modules/**', 'dist/**', '*.config.*'],
  skipEmpty: true,
  // ✅ 关键配置：HTML 报告选项
  html: {
    skipTimestamp: true, // 禁用时间戳
    linkMapper: {}
  }
}
