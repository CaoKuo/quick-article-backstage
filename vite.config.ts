import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import {
    ArcoResolver,
} from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true,
                }),
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve('src'),
        },
        // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
        proxy: {
            '/proxy': {
                target: 'http://localhost:5000',
                rewrite: (path) => path.replace(/^\/proxy/, ''),
                changeOrigin: true,
            },
        },
    },
});
