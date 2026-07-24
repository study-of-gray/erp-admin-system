import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { msgWarning } from '@/utils/message'

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
                    meta: { title: '控制台', icon: 'HomeFilled', requiresAuth: true }
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
            next()
        } catch {
            next('/login')
        }
        return
    }

    // TODO: n8n注入角色权限校验逻辑
    next()
})

export default router