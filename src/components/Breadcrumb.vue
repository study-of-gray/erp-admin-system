<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

  const route = useRoute()
  const router = useRouter()

  // 过滤出需要显示在面包屑的路由记录
  const breadcrumbs = computed(() => route.matched.filter(item => item.meta?.title))
</script>

<template>
  <ElBreadcrumb separator="/" class="breadcrumb">
    <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
    <ElBreadcrumbItem v-for="item in breadcrumbs" :key="item.path" :to="item.redirect || item.path">
      {{ item.meta.title }}
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped lang="scss">
  .breadcrumb {
    margin-left: 16px;
  }
</style>
