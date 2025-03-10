import { intro, outro } from '@clack/prompts';
import { isCancel, cancel, text, select, log, confirm, spinner } from '@clack/prompts';
import os from 'os'
import { getProfileNames, type ChromeProfile } from './utils/browser/chrome';
import { BrowserInstance } from './utils/browser/playwright';
import { deliveryOrders, getAllDeliveryOrderNo } from './process/suning';
import { getDeliveryIds, type DeliveryResponse } from './process/erp';


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


intro(`开始执行`);

try {
  const profile = await getProfile()

  if (!profile || typeof profile !== 'string') {
    outro("无效的用户，执行终止")
    process.exit(0);
  }

  const shouldCloseBrowserContinue = await confirm({
    message: '是否已关闭选中用户的 chrome 实例',
  });

  if (!shouldCloseBrowserContinue) {
    process.exit(0);
  }

  const browser = new BrowserInstance()
  const ctx = await browser.createContext({ profileName: profile, headless: false })

  const shouldLoginContinue = await confirm({
    message: '是否已登录聚水潭和苏宁云台',
  });

  if (!shouldLoginContinue) {
    await browser.close()
    process.exit(0);
  }

  const s = spinner();
  s.start('收集需要执行的订单');
  const orders = await getAllDeliveryOrderNo(ctx)
  s.stop(`收集到 ${orders.length} 个订单`);

  s.start('收集已发货的订单');
  const deliveryIds = await getDeliveryIds(ctx, orders)
  const validDeliveryIds = deliveryIds.filter(deliveryId => deliveryId.logistics_company && deliveryId.l_id) as DeliveryResponse[]
  s.stop(`收集到 ${validDeliveryIds.length} 个已发货的订单`);

  s.start('开始发货');
  const deliveryResults = await deliveryOrders(ctx, validDeliveryIds)
  s.stop("发货结束")

  const successResults = deliveryResults.filter(result => result.isSuccess)
  const failedResults = deliveryResults.filter(result => !result.isSuccess)

  outro(`执行完成,${successResults.length} 个订单发货成功,${failedResults.length} 个订单发货失败`);
}
catch (error) {
  outro(`执行失败,${error}`);
}
