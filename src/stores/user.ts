import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo, LoginParams, LoginResult } from '@/types/user'
import { msgError } from '@/utils/message'
import router from '@/router'

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref<string>('')
        const userInfo = ref<UserInfo | null>(null)

        /**
         * 模拟登录接口，待n8n替换为真实接口
         */
        const login = async (params: LoginParams): Promise<void> => {
            try {
                // TODO: n8n注入真实登录接口
                await new Promise(resolve => setTimeout(resolve, 1000))
                const mockResult: LoginResult = {
                    token: 'mock_jwt_token',
                    userInfo: {
                        id: 1,
                        username: params.username,
                        roles: ['admin']
                    }
                }
                token.value = mockResult.token
                userInfo.value = mockResult.userInfo
                localStorage.setItem('ERP_TOKEN', mockResult.token)
                router.push('/dashboard')
            } catch (err) {
                const error = err as any
                msgError(error.message || '登录失败')
                throw err
            }
        }

        /**
         * 获取用户信息，待n8n替换为真实接口
         */
        const getUserInfo = async (): Promise<UserInfo | null> => {
            if (!token.value) return null
            try {
                // TODO: n8n注入获取用户信息接口
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
    {
        persist: {
            key: 'ERP_USER_STORE',
            storage: localStorage,
            paths: ['token', 'userInfo']
        }
    }
)