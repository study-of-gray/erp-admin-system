import userMock from './user'
import type { MockMethod } from 'vite-plugin-mock'

// 聚合所有Mock接口
const mockModules: MockMethod[] = [
    ...userMock
]

export default mockModules