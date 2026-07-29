<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute, type RouteLocationMatched } from 'vue-router'
  import { ElBreadcrumb, ElBreadcrumbItem } from 'element-plus'

  const route = useRoute()
  // 过滤出需要显示在面包屑的路由记录
  const breadcrumbs = computed(() => {
    return route.matched.map((item: RouteLocationMatched) => {
      const crumb = {
        path: item.path,
        name: item.meta?.title || item.name || 'Unknown',
        redirect: item.redirect
      }

      // 如果 redirect 是函数，转换为字符串路径
      if (typeof crumb.redirect === 'function') {
        // 调用重定向函数获取实际路径
        const resolved = crumb.redirect(route, item)
        crumb.redirect = typeof resolved === 'string' ? resolved : resolved.path || ''
      }

      return crumb
    })
  })

  // 获取实际的跳转路径
  const getToPath = (item: any) => {
    // 优先使用 redirect（如果它是字符串），否则使用 path
    if (typeof item.redirect === 'string' && item.redirect) {
      return item.redirect
    }
    return item.path
  }
</script>

<template>
  <ElBreadcrumb separator="/" class="breadcrumb">
    <ElBreadcrumbItem :to="{ path: '/' }">首页</ElBreadcrumbItem>
    <ElBreadcrumbItem v-for="item in breadcrumbs" :key="item.path" :to="getToPath(item)">
      {{ item.name }}
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<style scoped lang="scss">
  .breadcrumb {
    margin-left: 16px;
  }
</style>
