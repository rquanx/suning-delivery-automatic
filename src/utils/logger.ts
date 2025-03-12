import pino from 'pino'
import path from 'path'
import fs from 'fs'
import * as rfs from "rotating-file-stream";

// 创建一个 rotating-file-stream 实例
const stream = rfs.createStream("app.log", {
  interval: "1d", // 每天轮转一次
  compress: "gzip", // 压缩旧日志文件
});

// 确保 logs 目录存在
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}


// 创建 logger 实例
export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      translateTime: 'SYS:standard',
      destination: stream,
    },
  },
})