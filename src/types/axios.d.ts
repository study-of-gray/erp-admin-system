import 'axios'

declare module 'axios' {
    export interface InternalAxiosRequestConfig {
        options?: {
            showLoading?: boolean
            showError?: boolean
            retry?: number
        }
    }

    export interface AxiosRequestConfig {
        options?: {
            showLoading?: boolean
            showError?: boolean
            retry?: number
        }
    }
}