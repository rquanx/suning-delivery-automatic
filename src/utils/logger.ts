import pino from 'pino'
import path from 'pathe'


const transport = pino.transport({
  target: 'pino-roll',
  options: { file: path.join('logs', 'app'), frequency: 'daily', mkdir: true, extension: '.log', dateFormat: 'yyyy-MM-dd' }
})

export const logger = pino(transport)