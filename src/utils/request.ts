import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios'
import { ApiResponse, RequestOptions } from '@/types/http'
import { msgError, msgWarning } from './message'
import { useUserStore } from '@/stores/user'
import { ElLoading } from 'element-plus'

// 存储pending请求，用于取消重复请求
const pendingRequests = new Map<string, CancelTokenSource>()

// 生成请求唯一标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
    const { url, method, params, data } = config
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 移除pending请求
const removePendingRequest = (key: string): void => {
    if (pendingRequests.has(key)) {
        const source = pendingRequests.get(key)
        source?.cancel('取消重复请求')
        pendingRequests.delete(key)
    }
}

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        const options: RequestOptions = config.options || {}

        // 携带token
        if (userStore.token) {
            config.headers!.Authorization = `Bearer ${userStore.token}`
        }

        // 取消重复请求
        if (options.cancelDuplicate !== false) {
            const requestKey = generateRequestKey(config)
            removePendingRequest(requestKey)
            const source = axios.CancelToken.source()
            config.cancelToken = source.token
            pendingRequests.set(requestKey, source)
        }

        // 全局loading
        if (options.showLoading !== false) {
            // TODO: n8n注入loading计数逻辑，避免多个请求叠加loading
            ElLoading.service({ fullscreen: true, text: '加载中...' })
        }

        return config
    },
    (error) => {
        msgError('请求发送失败')
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const config = response.config
        const options: RequestOptions = config.options || {}
        const requestKey = generateRequestKey(config)
        removePendingRequest(requestKey)

        // 关闭loading
        if (options.showLoading !== false) {
            ElLoading.service().close()
        }

        const { code, message, data } = response.data

        // 统一处理业务状态码
        switch (code) {
            case 200:
                return data
            case 401:
                // token过期，退出登录
                msgWarning('登录已过期，请重新登录')
                useUserStore().logout()
                return Promise.reject(new Error(message))
            case 403:
                msgError('无权限访问该资源')
                return Promise.reject(new Error(message))
            case 500:
                msgError('服务端异常，请稍后重试')
                return Promise.reject(new Error(message))
            default:
                if (options.showError !== false) {
                    msgError(message || '未知错误')
                }
                return Promise.reject(new Error(message))
        }
    },
    (error) => {
        const config = error.config
        if (config) {
            const requestKey = generateRequestKey(config)
            removePendingRequest(requestKey)
            if (config.options?.showLoading !== false) {
                ElLoading.service().close()
            }
        }

        // 网络错误处理
        if (error.message.includes('Network Error')) {
            msgError('网络连接失败，请检查网络')
        } else if (error.message.includes('timeout')) {
            msgError('请求超时，请重试')
        } else if (axios.isCancel(error)) {
            // 取消重复请求的错误不提示
            console.warn('请求已取消:', error.message)
        } else {
            msgError('请求处理失败')
        }
        return Promise.reject(error)
    }
)

// 封装常用请求方法
export const http = {
    get<T = any>(url: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
        return request.get(url, { params, options })
    },
    post<T = any>(url: string, data?: Record<string, any>, options?: RequestOptions): Promise<T> {
        return request.post(url, data, { options })
    },
    put<T = any>(url: string, data?: Record<string, any>, options?: RequestOptions): Promise<T> {
        return request.put(url, data, { options })
    },
    delete<T = any>(url: string, params?: Record<string, any>, options?: RequestOptions): Promise<T> {
        return request.delete(url, { params, options })
    }
}

export default request