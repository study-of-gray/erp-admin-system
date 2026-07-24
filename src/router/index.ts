import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { msgWarning, msgError, msgSuccess } from '@/utils/message'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/index.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/',
            component: () => import('@/layouts/index.vue'),
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
})

// 存储已加载的动态路由，避免重复注册
let dynamicRoutesLoaded = false

// 路由守卫：权限校验
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
            msgSuccess('登录成功！')
        } catch {
            next('/login')
            return
        }
    }

    // 动态路由注册：仅注册一次
    if (!dynamicRoutesLoaded) {
        try {
            // TODO: n8n注入动态路由接口调用，当前使用Mock数据
            const dynamicRoutes = [
                {
                    path: '/system',
                    name: 'system',
                    meta: { title: '系统管理', requiresAuth: true },
                    children: [
                        {
                            path: 'user',
                            name: 'system-user',
                            component: () => import('@/views/system/user/index.vue'),
                            meta: { title: '用户管理', requiresAuth: true, roles: ['admin', 'editor'] }
                        }
                    ]
                }
            ]

            // 注册动态路由
            dynamicRoutes.forEach(route => {
                router.addRoute('/', route)
            })
            dynamicRoutesLoaded = true

            // 跳转到目标路由（解决首次加载动态路由后页面404的问题）
            next({ ...to, replace: true })
            return
        } catch (err) {
            msgError('加载动态路由失败')
            next('/dashboard')
            return
        }
    }

    // TODO: n8n注入按钮级权限校验逻辑
    next()
})

export default router