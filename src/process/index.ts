import { outro, spinner, log } from '@clack/prompts';
import type { BrowserContext } from 'playwright';
import { generateReport } from '../report';
import { getDeliveryIds, type DeliveryResponse } from './erp';
import { checkIsLogin, deliveryOrders, getAllDeliveryOrderNo } from './suning';
import { logger } from '../utils/logger';

const progressString = (current: number, total: number) => {
  return total > 0 ? `${current} / ${total}` : ''
}

export const workflow = async (ctx: BrowserContext, s: ReturnType<typeof spinner>) => {
  await checkIsLogin(ctx)

  s.start('收集需要执行的订单');
  const orders = await getAllDeliveryOrderNo(ctx)

  logger.info(`收集到 ${typeof orders === 'string' ? (orders || 0) :  orders.length} 个订单`)

  if (typeof orders === 'string') {
    s.stop()
    outro(orders)
    process.exit(0);
  } else {
    s.stop(`收集到 ${orders.length} 个订单`);
  }

  if (orders.length === 0) {
    outro("没有需要执行的订单")
    process.exit(0);
  }

  let collectedOrder = 0
  s.start(`收集订单物流信息中 ${progressString(collectedOrder, orders.length)}`);
  const deliveryIds = await getDeliveryIds(ctx, orders, () => {
    s.message(`收集订单物流信息中 ${progressString(++collectedOrder, orders.length)}`)
  })
  const validDeliveryIds = deliveryIds.filter(deliveryId => deliveryId.logistics_company && deliveryId.l_id) as DeliveryResponse[]
  s.stop(`收集到 ${validDeliveryIds.length} 个订单物流信息`);

  if (validDeliveryIds.length === 0) {
    outro("没有需要执行的订单")
    process.exit(0);
  }

  let deliveredOrder = 0
  s.start(`发货中 ${progressString(deliveredOrder, validDeliveryIds.length)}`);
  const deliveryResults = await deliveryOrders(ctx, validDeliveryIds, () => {
    s.message(`发货中 ${progressString(++deliveredOrder, validDeliveryIds.length)}`)
  })

  const successResults = deliveryResults.filter(result => result.isSuccess)
  const failedResults = deliveryResults.filter(result => !result.isSuccess)
  logger.info(`发货结束 ${successResults.length} 个订单发货成功,${failedResults.length} 个订单发货失败`)
  generateReport(validDeliveryIds, deliveryResults)
  s.stop(`发货结束 ${successResults.length} 个订单发货成功,${failedResults.length} 个订单发货失败,报告已生成`)
}
