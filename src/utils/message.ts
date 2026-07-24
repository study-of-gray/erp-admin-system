/* src/utils/message.ts 统一消息提示封装 */
import { ElMessage, ElMessageOptions } from 'element-plus'
import { ref } from 'vue'

// 防止重复弹窗的消息缓存
const messageCache = ref<Set<string>>(new Set())

interface CustomMessageOptions extends Omit<ElMessageOptions, 'message'> {
    message: string
    /** 相同消息在duration内不重复弹出，单位ms */
    cacheTime?: number
}

/**
 * 统一消息提示方法，符合项目编码规范
 */
export const showMessage = ({
    message,
    type = 'info',
    duration = 3000,
    cacheTime = 2000,
    ...rest
}: CustomMessageOptions): void => {
    const cacheKey = `${type}-${message}`
    if (messageCache.value.has(cacheKey)) return

    messageCache.value.add(cacheKey)
    ElMessage({
        message,
        type,
        duration,
        ...rest
    })

    setTimeout(() => {
        messageCache.value.delete(cacheKey)
    }, cacheTime)
}

// 快捷方法封装
export const msgSuccess = (message: string, options?: Omit<CustomMessageOptions, 'message' | 'type'>) =>
    showMessage({ ...options, message, type: 'success' })
export const msgError = (message: string, options?: Omit<CustomMessageOptions, 'message' | 'type'>) =>
    showMessage({ ...options, message, type: 'error' })
export const msgWarning = (message: string, options?: Omit<CustomMessageOptions, 'message' | 'type'>) =>
    showMessage({ ...options, message, type: 'warning' })
export const msgInfo = (message: string, options?: Omit<CustomMessageOptions, 'message' | 'type'>) =>
    showMessage({ ...options, message, type: 'info' })