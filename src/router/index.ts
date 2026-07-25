// src/router/index.ts 最终稳定版
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { msgWarning } from '@/utils/message'
import Layout from '@/layouts/index.vue'

// 1. 静态路由：只定义无需权限的页面
const staticRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: { title: '控制台', requiresAuth: true }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404/index.vue'),
        meta: { requiresAuth: false }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: staticRoutes
})

// 2. 标记是否已加载动态路由
let dynamicRoutesLoaded = false

// 3. 简化的路由守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const token = localStorage.getItem('ERP_TOKEN')

    // 无需登录的页面直接放行
    if (!to.meta.requiresAuth) {
        next()
        return
    }

    // 无token跳登录页
    if (!token) {
        msgWarning('请先登录')
        next('/login')
        return
    }

    // 有token但无用户信息，先获取用户信息
    if (token && !userStore.userInfo) {
        try {
            await userStore.getUserInfo()
        } catch {
            next('/login')
            return
        }
    }

    // 加载动态路由（只加载一次）
    if (!dynamicRoutesLoaded) {
        try {
            // 获取用户角色
            const role = userStore.userInfo?.roles[0] || 'admin'

            // 模拟从API获取菜单（实际项目中替换为真实接口）
            const menus = await getMenusByRole(role)

            // 注册动态路由
            menus.forEach(menu => {
                router.addRoute('/', menu)
            })

            dynamicRoutesLoaded = true

            // 关键：重新导航到目标路由，确保路由匹配
            next({ ...to, replace: true })
            return
        } catch (err) {
            console.error('加载动态路由失败:', err)
            next('/dashboard')
            return
        }
    }

    next()
})

// 4. 模拟根据角色获取菜单的函数
async function getMenusByRole(role: string): Promise<RouteRecordRaw[]> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 100))

    // 根据角色返回不同的菜单
    const menuMap: Record<string, RouteRecordRaw[]> = {
        admin: [
            {
                path: '/system',
                name: 'system',
                component: Layout,
                meta: { title: '系统管理', requiresAuth: true },
                children: [
                    {
                        path: 'user',
                        name: 'system-user',
                        component: () => import('@/views/system/user/index.vue'),
                        meta: { title: '用户管理', requiresAuth: true }
                    },// 在动态路由的 system 子路由中添加
                    {
                        path: 'role',
                        name: 'system-role',
                        component: () => import('@/views/system/role/index.vue'),
                        meta: { title: '角色管理', requiresAuth: true }
                    },
                    {
                        path: 'menu',
                        name: 'system-menu',
                        component: () => import('@/views/system/menu/index.vue'),
                        meta: { title: '菜单管理', requiresAuth: true }
                    }
                ]
            }
        ],
        editor: [
            {
                path: '/system',
                name: 'system',
                component: Layout,
                meta: { title: '系统管理', requiresAuth: true },
                children: [
                    {
                        path: 'user',
                        name: 'system-user',
                        component: () => import('@/views/system/user/index.vue'),
                        meta: { title: '用户管理', requiresAuth: true }
                    }
                ]
            }
        ],
        viewer: [
            {
                path: '/system',
                name: 'system',
                component: Layout,
                meta: { title: '系统管理', requiresAuth: true },
                children: [
                    {
                        path: 'user',
                        name: 'system-user',
                        component: () => import('@/views/system/user/index.vue'),
                        meta: { title: '用户管理', requiresAuth: true }
                    }
                ]
            }
        ]
    }

    return menuMap[role] || []
}

export default router