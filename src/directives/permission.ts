import type { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * 按钮级权限指令：v-permission="['admin', 'editor']"
 * 根据用户角色判断是否显示元素
 */
export const permissionDirective = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const userStore = useUserStore()
        const { value: requiredRoles } = binding

        if (!requiredRoles || !Array.isArray(requiredRoles)) {
            throw new Error('v-permission指令需要传入角色数组，如v-permission="[\'admin\']"')
        }

        // 等待用户信息加载完成
        const checkPermission = () => {
            const hasPermission = requiredRoles.some(role =>
                userStore.userInfo?.roles.includes(role)
            )

            if (!hasPermission) {
                el.parentNode?.removeChild(el)
            }
        }

        // 如果用户信息还未加载，监听变化
        if (!userStore.userInfo) {
            const stopWatch = watch(
                () => userStore.userInfo,
                (userInfo) => {
                    if (userInfo) {
                        checkPermission()
                        stopWatch()
                    }
                },
                { immediate: true }
            )
        } else {
            checkPermission()
        }
    }
}

export default function registerPermissionDirective(app: App) {
    app.directive('permission', permissionDirective)
}