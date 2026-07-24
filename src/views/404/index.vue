<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { msgWarning } from '@/utils/message'

  const router = useRouter()

  const goHome = (): void => {
    msgWarning('访问的页面不存在，已返回首页')
    router.push('/')
  }
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<style scoped lang="scss">
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--el-text-color-secondary);

    h1 {
      font-size: 72px;
      margin-bottom: 16px;
      color: var(--el-color-primary);
    }

    p {
      font-size: 16px;
      margin-bottom: 24px;
    }
  }
</style>
