/* vite.config.ts 修正版 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ mode }) => {
  // 关键修复：显式加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      ElementPlus({
        useSource: true,
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
        dts: 'src/types/components.d.ts',
      }),
      // 简化Mock配置：仅在开发环境且启用Mock时生效
      viteMockServe({
        mockPath: 'mock',
        enable: env.VITE_ENABLE_MOCK === 'true' && mode === 'development',
        logger: true
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 已移除additionalData，避免循环加载
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5173',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})