/* 用户相关类型定义 */
export interface UserInfo {
    id: number
    username: string
    avatar?: string
    roles: string[]
}

export interface LoginParams {
    username: string
    password: string
    role?: 'admin' | 'user' | 'super'
}

export interface LoginResult {
    token: string
    userInfo: UserInfo
}

export interface UserQueryParams {
    username?: string
    nickname?: string
    role?: string
}

export interface PageParams {
    pageNum?: number
    pageSize?: number
}