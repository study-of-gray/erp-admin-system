<!-- src/layouts/index.vue 修正版 -->
<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/user'
  import { HomeFilled, UserFilled, Setting } from '@element-plus/icons-vue'
  import Breadcrumb from '@/components/Breadcrumb.vue'
  import '@/styles/layout.scss'

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  // 侧边栏折叠状态
  const isCollapse = ref(false)

  // 侧边栏菜单配置（静态部分）
  const staticMenuItems = computed(() => [
    {
      path: '/dashboard',
      title: '控制台',
      icon: HomeFilled,
      meta: { requiresAuth: true }
    }
  ])

  // 动态菜单项（从路由中获取）
  const dynamicMenuItems = computed(() => {
    const routes = router.getRoutes()
    return routes
      .filter(route => route.path.startsWith('/system') && route.meta?.title)
      .map(route => ({
        path: route.path,
        title: route.meta.title as string,
        icon: Setting,
        meta: route.meta
      }))
  })

  const handleLogout = (): void => {
    userStore.logout()
  }

  const toggleSidebar = (): void => {
    isCollapse.value = !isCollapse.value
  }
</script>

<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="layout-sidebar" :class="{ 'is-collapse': isCollapse }">
      <div class="logo">
        <h1>ERP系统</h1>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="sidebar-menu"
      >
        <!-- 静态菜单项 -->
        <el-menu-item v-for="item in staticMenuItems" :key="item.path" :index="item.path">
          <component :is="item.icon" class="menu-icon" />
          <template #title>{{ item.title }}</template>
        </el-menu-item>

        <!-- 动态菜单项 -->
        <el-sub-menu v-if="dynamicMenuItems.length > 0" index="/system">
          <template #title>
            <Setting class="menu-icon" />
            <span>系统管理</span>
          </template>
          <el-menu-item v-for="item in dynamicMenuItems" :key="item.path" :index="item.path">
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>

    <!-- 主内容区 -->
    <div class="layout-main">
      <!-- 顶栏 -->
      <header class="layout-header">
        <div class="header-left">
          <el-button type="text" :icon="isCollapse ? 'Expand' : 'Fold'" @click="toggleSidebar" />
          <Breadcrumb />
        </div>
        <div class="header-right">
          <span class="username">{{ userInfo?.username }}</span>
          <el-button type="text" @click="handleLogout">退出登录</el-button>
        </div>
      </header>

      <!-- 关键：确保RouterView在正确的位置 -->
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
