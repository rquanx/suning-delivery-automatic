import { defineConfig } from 'vite';
import { resolve } from 'path';

// Node.js 内置模块列表
const builtinModules = [
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'module',
  'net', 'os', 'path', 'punycode', 'process', 'querystring', 'readline', 'repl',
  'stream', 'string_decoder', 'sys', 'timers', 'tls', 'tty', 'url', 'util',
  'v8', 'vm', 'zlib'
];

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    target: 'node18',
    rollupOptions: {
      output: {
        format: 'es',
        inlineDynamicImports: true,
        preserveModules: false,
        // 确保第三方依赖被打包
        manualChunks: undefined,
        compact: true,
      },
      // 只排除 Node.js 内置模块
      external: [
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`),
        ...builtinModules.map(m => `node:${m}/promises`),
      ],
    },
    // 不要分割 vendor
    modulePreload: false,
    // 清空输出目录
    emptyOutDir: true,
    // 使用 esbuild 压缩
    minify: 'esbuild',
  },
  // 不要转换 __dirname 等 Node.js 变量
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});