import { intro, outro } from '@clack/prompts';
import { isCancel, cancel, text, select, log, confirm, spinner } from '@clack/prompts';
import os from 'os'
import { getProfileNames, type ChromeProfile } from './utils/browser/chrome';
import { BrowserInstance } from './utils/browser/playwright';
import { checkIsLogin, deliveryOrders, getAllDeliveryOrderNo, goToSuning } from './process/suning';
import { getDeliveryIds, goToErp, type DeliveryResponse } from './process/erp';


const getProfile = async () => {
  const profiles = getProfileNames()
  if (profiles.length === 0) {
    outro("请先安装并创建 Chrome 用户")
    process.exit(0);
  }
  if (profiles.length === 1) {
    return profiles[0].realName
  }
  const projectType = await select({
    message: '选择浏览器用户',
    options: profiles.map(profile => ({
      value: profile.realName,
      label: profile.displayName
    }))
  });

  return projectType
}

let browser: BrowserInstance | null = null

intro(`开始执行`);
const s = spinner();

try {
  const profile = await getProfile()

  if (!profile || typeof profile !== 'string') {
    outro("执行终止")
    process.exit(0);
  }

  const shouldCloseBrowserContinue = await confirm({
    message: '是否已关闭选中用户的 chrome 实例',
  });

  if (!shouldCloseBrowserContinue) {
    process.exit(0);
  }

   browser = new BrowserInstance()
  const ctx = await browser.createContext({ profileName: profile, headless: false })

  await goToErp(ctx)
  await goToSuning(ctx)

  const shouldLoginContinue = await confirm({
    message: '检查是否已登录聚水潭和苏宁云台',
  });

  if (!shouldLoginContinue) {
    await browser.close()
    process.exit(0);
  }

  await checkIsLogin(ctx)

  s.start('收集需要执行的订单');
  const orders = await getAllDeliveryOrderNo(ctx)
  s.stop(`收集到 ${orders.length} 个订单`);

  if (orders.length === 0) {
    outro("没有需要执行的订单")
    process.exit(0);
  }

  s.start('收集已发货的订单');
  const deliveryIds = await getDeliveryIds(ctx, orders)
  const validDeliveryIds = deliveryIds.filter(deliveryId => deliveryId.logistics_company && deliveryId.l_id) as DeliveryResponse[]
  s.stop(`收集到 ${validDeliveryIds.length} 个已发货的订单`);

  if (validDeliveryIds.length === 0) {
    outro("没有需要执行的订单")
    process.exit(0);
  }

  s.start('开始发货');
  const deliveryResults = await deliveryOrders(ctx, validDeliveryIds)
  s.stop("发货结束")

  const successResults = deliveryResults.filter(result => result.isSuccess)
  const failedResults = deliveryResults.filter(result => !result.isSuccess)
  outro(`执行完成,${successResults.length} 个订单发货成功,${failedResults.length} 个订单发货失败`);
}
catch (error) {
  s.stop("出现异常");
  outro(`执行失败,${error}`);
}
finally {
  await browser?.close?.()
}
