// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

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
      // ✅ 已移除 vite-plugin-mock，避免依赖缺失
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern', // 消除 Sass 废弃警告
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: 'localhost',
      port: 5173,
      open: true,
    },
    build: {
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            element: ['element-plus'],
            utils: ['axios', 'lodash-es']
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['test/**/*.spec.ts'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      setupFiles: ['./test/setup.ts'],
      coverage: {
        provider: 'istanbul',
        reporter: [
          'text',
          'json',
          ['html', { skipTimestamp: true }],
        ],
        exclude: ['test/**', 'node_modules/**', 'dist/**', '*.config.*'],
        reportsDirectory: './coverage',
        extension: ['.ts', '.vue'],
        reportOptions: {
          html: {
            skipTimestamp: true,  // 禁用时间戳
            date: false
          }
        }
      },
    },
  }
})