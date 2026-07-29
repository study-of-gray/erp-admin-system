import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, LoginParams, LoginResult } from '@/types/user'
import { msgError, msgSuccess } from '@/utils/message'
import router from '@/router'
import { persistConfig } from '@/config/persist'

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref<string>('')
        const userInfo = ref<UserInfo | null>(null)

        const login = async (params: LoginParams): Promise<void> => {
            try {
                // 模拟登录接口
                await new Promise(resolve => setTimeout(resolve, 1000))
                const mockResult: LoginResult = {
                    token: 'mock_jwt_token',
                    userInfo: {
                        id: 1,
                        username: params.username,
                        roles: [params.role || 'admin'] // 使用登录表单中的角色
                    }
                }
                token.value = mockResult.token
                userInfo.value = mockResult.userInfo
                localStorage.setItem('ERP_TOKEN', mockResult.token)
                msgSuccess('登录成功')
                router.push('/dashboard')
            } catch (err) {
                const error = err as any
                msgError(error.message || '登录失败')
                throw err
            }
        }

        const getUserInfo = async (): Promise<UserInfo | null> => {
            if (!token.value) return null
            try {
                // 模拟获取用户信息接口
                await new Promise(resolve => setTimeout(resolve, 500))
                return userInfo.value
            } catch (err) {
                logout()
                return null
            }
        }

        const logout = (): void => {
            token.value = ''
            userInfo.value = null
            localStorage.removeItem('ERP_TOKEN')
            router.push('/login')
        }

        return {
            token,
            userInfo,
            login,
            getUserInfo,
            logout
        }
    },
    { persist: persistConfig }
)