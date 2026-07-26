import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { vi } from 'vitest'

const FIXED_DATE = new Date('2026-01-01T00:00:00.000Z')
vi.setSystemTime(FIXED_DATE)
// 全局注册 Element Plus
config.global.plugins = [ElementPlus]

// Mock window.confirm and alert if needed, or use ElMessageBox
// 如果你在代码中用了 ElMessageBox，通常需要 mock 掉它的交互或者使用真实的 DOM 事件
// 这里提供一个简单的全局 Mock 示例（如果需要）
window.ResizeObserver =
    window.ResizeObserver ||
    vi.fn().mockImplementation(() => ({
        disconnect: vi.fn(),
        observe: vi.fn(),
        unobserve: vi.fn(),
    }))

// Mock Element Plus 的消息提示（避免测试时真的弹出 DOM）
vi.mock('element-plus', async () => {
    const actual = await vi.importActual('element-plus')
    return {
        ...actual,
        ElMessage: {
            success: vi.fn(),
            error: vi.fn(),
            warning: vi.fn(),
            info: vi.fn(),
        },
        ElMessageBox: {
            confirm: vi.fn().mockResolvedValue('confirm'),
            alert: vi.fn().mockResolvedValue('alert'),
        },
    }
});

export const resetTime = () => {
    vi.useRealTimers()
}

export const setFixedTime = () => {
    vi.setSystemTime(FIXED_DATE)
}