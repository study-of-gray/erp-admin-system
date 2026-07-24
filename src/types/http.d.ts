/* 统一接口响应格式 */
export interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
    timestamp: number
}

/* 请求配置扩展 */
export interface RequestOptions {
    /** 是否显示全局loading */
    showLoading?: boolean
    /** 是否显示错误提示 */
    showError?: boolean
    /** 是否取消重复请求 */
    cancelDuplicate?: boolean
}

/* 分页查询参数 */
export interface PageParams {
    pageNum: number
    pageSize: number
    [key: string]: any
}

/* 分页响应数据 */
export interface PageResult<T> {
    list: T[]
    total: number
    pageNum: number
    pageSize: number
}