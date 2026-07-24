<!-- src/views/dashboard/index.vue 控制台页 -->
<script setup lang="ts">
import { msgInfo } from '@/utils/message'
import '@/views/dashboard/index.scss'  // 引入独立样式文件

const handleClick = () => {
  msgInfo('当前为测试按钮，功能待n8n扩展')
}
</script>

<template>
  <div class="dashboard-container">
    <h1>欢迎来到ERP控制台</h1>
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span>系统概览</span>
        </div>
      </template>
      <div class="card-content">
        <el-button type="primary" @click="handleClick">
          测试按钮
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped></style>