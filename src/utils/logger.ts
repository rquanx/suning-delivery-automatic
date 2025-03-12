// import pino from 'pino'
// import path from 'pathe'

// export const logger = pino({
//   transport: {
//     target: roll,
//     options: { file: path.join(import.meta.dirname, 'logs', 'app'), frequency: 'daily', mkdir: true, extension: '.log', dateFormat: 'yyyy-MM-dd' }
//   },
// })

export const logger = (...args: any[]) => {
  // console.log(111, ...args)
}