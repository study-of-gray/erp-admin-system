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

  // 侧边栏折叠状态，预留响应式适配
  const isCollapse = ref(false)

  // 侧边栏菜单配置，待n8n从接口动态注入
  const menuItems = computed(() => [
    {
      path: '/dashboard',
      title: '控制台',
      icon: HomeFilled,
      meta: { requiresAuth: true }
    },
    {
      path: '/system',
      title: '系统管理',
      icon: Setting,
      children: [
        {
          path: '/system/user',
          title: '用户管理',
          icon: UserFilled,
          meta: { requiresAuth: true, roles: ['admin'] }
        }
      ]
    }
  ])

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
        <template v-for="item in menuItems" :key="item.path">
          <!-- 无子菜单 -->
          <el-menu-item v-if="!item.children" :index="item.path">
            <component :is="item.icon" class="menu-icon" />
            <template #title>{{ item.title }}</template>
          </el-menu-item>
          <!-- 有子菜单 -->
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <component :is="item.icon" class="menu-icon" />
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              <component :is="child.icon" class="menu-icon" />
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
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

      <!-- 内容区 -->
      <main class="layout-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>
