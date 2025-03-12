import pino from 'pino'
import path from 'path'
import fs from 'fs'

// 确保 logs 目录存在
const logsDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// 获取当前日期作为文件名
const getLogFileName = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.log`
}

// 创建 logger 实例
export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      translateTime: 'SYS:standard',
      destination: path.join(logsDir, getLogFileName()),
    },
  },
})