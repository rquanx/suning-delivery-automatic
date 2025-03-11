import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Node.js 内置模块列表
const builtinModules = [
  'assert', 'buffer', 'child_process', 'cluster', 'console', 'constants',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'module',
  'net', 'os', 'path', 'punycode', 'process', 'querystring', 'readline', 'repl',
  'stream', 'string_decoder', 'sys', 'timers', 'tls', 'tty', 'url', 'util',
  'v8', 'vm', 'zlib', 'async_hooks'
];

// 添加复制目录的辅助函数
function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) return;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}


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
      plugins: [{
        name: 'replace-dirname',
        transform(code) {
          return code.replace(
            /__dirname/g,
            `new URL('.', import.meta.url).pathname`
          );
        }
      },
      {
        name: 'replace-require-resolve',
        transform(code) {
          return code.replace(
            /require\.resolve\(['"](.*)['"]\)/g,
            (match, p1) => {
              return `new URL('${p1}', import.meta.url).pathname`;
            }
          );
        }
      },
      {
        name: 'copy-bat-file',
        closeBundle() {
          // 复制 run.bat
          const batSrcPath = resolve(__dirname, 'scripts/run.bat');
          const batDestPath = resolve(__dirname, 'dist/run.bat');
          fs.copyFileSync(batSrcPath, batDestPath);

          // 复制 runtime 目录
          const runtimeSrcPath = resolve(__dirname, 'runtime');
          const runtimeDestPath = resolve(__dirname, 'dist/runtime');
          copyDir(runtimeSrcPath, runtimeDestPath);
        }
      }
      ],
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
        ...builtinModules.map(m => `node:${m}/promises`)
      ],
    },
    // 不要分割 vendor
    modulePreload: false,
    // 清空输出目录
    emptyOutDir: true,
    // 使用 esbuild 压缩
    minify: 'esbuild',
  },
});