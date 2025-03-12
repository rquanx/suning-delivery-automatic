import log4js from 'log4js';

log4js.configure({
  appenders: {
    file: {
      type: 'dateFile',
      filename: 'logs/application.log',
      pattern: 'yyyy-MM-dd',
      alwaysIncludePattern: true
    },
  },
  categories: {
    default: { appenders: ['file'], level: 'info' }
  }
});

export const logger = log4js.getLogger();