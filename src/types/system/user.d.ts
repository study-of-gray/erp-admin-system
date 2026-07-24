/** 用户列表项 */
export interface SysUserItem {
    id: number
    username: string
    nickname: string
    role: string
    phone: string
    email: string
    status: 0 | 1 // 0禁用 1启用
    createTime: string
}

/** 用户查询参数 */
export interface UserQueryParams extends PageParams {
    username?: string
    status?: 0 | 1
    startTime?: string
    endTime?: string
}

/** 用户表单参数 */
export interface UserFormParams {
    id?: number
    username: string
    nickname: string
    password?: string
    role: string
    phone: string
    email: string
    status: 0 | 1
}