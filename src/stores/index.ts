/* src/stores/index.ts Pinia配置 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 预留状态持久化配置，供n8n后续调整
pinia.use(piniaPluginPersistedstate)

export default pinia