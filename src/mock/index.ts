import userMock from './user'
import menuMock from './menu'
import type { MockMethod } from 'vite-plugin-mock'

const mockModules: MockMethod[] = [
    ...userMock,
    ...menuMock
]

export default mockModules