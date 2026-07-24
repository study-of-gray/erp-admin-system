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
}

export interface LoginResult {
    token: string
    userInfo: UserInfo
}