import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
// https://vitejs.dev/config/

// 获取当前时间戳
const timeStamp = new Date().getTime()
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    open: true, // Automatically open the app in the browser
    host: '127.0.0.1'
  },
  build: {
    rollupOptions: {
      output: {
        // 为入口文件和代码块文件添加时间戳
        entryFileNames: `assets/[name].[hash].${timeStamp}.js`,
        chunkFileNames: `assets/[name].[hash].${timeStamp}.js`,
        assetFileNames: `assets/[name].[hash].${timeStamp}.[ext]`,
      },
    },
  },
})
