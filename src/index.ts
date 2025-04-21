import { confirm, intro, outro, select, spinner } from '@clack/prompts';
import { workflow } from './process';
import { goToErp } from './process/erp';
import { goToSuning } from './process/suning';
import { getProfileNames } from './utils/browser/chrome';
import { BrowserInstance } from './utils/browser/playwright';
import { logger } from './utils/logger';


const getProfile = async () => {
  const profiles = getProfileNames()
  if (profiles.length === 0) {
    outro("请先安装并创建 Chrome 用户")
    process.exit(0);
  }
  if (profiles.length === 1) {
    return profiles[0]
  }
  const projectType = await select({
    message: '选择浏览器用户',
    options: profiles.map(profile => ({
      value: profile.realName,
      label: profile.displayName
    }))
  });

  if (typeof projectType === 'string') {
    return profiles.find(profile => profile.realName === projectType)
  }

  return projectType
}

let browser: BrowserInstance | null = null

intro(`开始执行`);
logger.info("开始执行")
const s = spinner();

try {
  const profile = await getProfile()

  if (!profile || typeof profile === 'symbol') {
    outro("执行终止")
    process.exit(0);
  }

  const shouldCloseBrowserContinue = await confirm({
    message: `是否已关闭用户 ${profile?.displayName} 的 chrome 实例`,
  });

  if (!shouldCloseBrowserContinue) {
    process.exit(0);
  }

  browser = new BrowserInstance()
  const ctx = await browser.createContext({ profileName: profile.realName, headless: false })

  await goToErp(ctx)
  await goToSuning(ctx)

  const shouldLoginContinue = await confirm({
    message: '检查是否已登录聚水潭和苏宁云台',
  });

  if (!shouldLoginContinue) {
    await browser.close()
    process.exit(0);
  }
  while (true) {
    await workflow(ctx, s)
    const shouldContinue = await confirm({
      message: '是否再次执行',
    });
    if (!shouldContinue) {
      break;
    }
  }
  outro(`执行结束，停止程序`);
  logger.info("执行结束，停止程序")
}
catch (error) {
  try {
    s.stop("出现异常");
  } catch (error) {
  }
  logger.error(error)
  outro(`执行失败, ${error instanceof Error ? `${error.message} ${error.stack}` : error}`);
}
finally {
  await browser?.close?.()
}