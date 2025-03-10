import type { DeliveryResponse } from './erp';
import type { BrowserContext, Page } from "playwright"
import { sleep } from "../utils/timer"
import { customAlphabet } from 'nanoid'
import pLimit from 'p-limit';
import { confirm } from '@clack/prompts';
import { deliveries } from './delivery-map';

const nanoid = customAlphabet('1234567890', 17)
const limit = pLimit(5)

export const suningLoginSite = 'https://mpassport.suning.com/ids/login'

export const suningDeliveryListSite = 'https://moms.suning.com/moms/delivery/toHaveSoldBabyMain.action?tabtype=3'
export const getSuningDeliverySite = (no: number | string) => `https://moms.suning.com/moms/delivery/toDeliveryGoods.action?pagetype=1&b2corderNos=${no}`

export const goToSuning = async (ctx: BrowserContext) => {
  const page = await ctx.newPage()
  await page.goto(suningDeliveryListSite)
  return page;
}

const getCurrentPageOrders = async (page: Page) => {
  const orderNos = await page.locator('span.order-list-orderNum').all()
  const orders = (await Promise.all(orderNos.map(orderNo => orderNo.textContent()))).filter(Boolean) as string[]
  return orders.map(order => order.split('：')[1]).filter(Boolean)
}

export const checkIsLogin = async (ctx: BrowserContext) => {
  const page = await goToSuning(ctx)
  await sleep(3000)
  if (page.url().includes(suningLoginSite)) {
    const shouldLoginContinue = await confirm({
      message: '检测到苏宁未登录，登录完成后继续',
    });
    if (!shouldLoginContinue) {
      process.exit(0);
    }
  }
  await page.close()
}

export const getAllDeliveryOrderNo = async (ctx: BrowserContext) => {
  const page = await ctx.newPage()
  await page.goto(suningDeliveryListSite)
  await sleep(3000)
  const orders: string[] = []
  while (true) {
    const pageOrders = await getCurrentPageOrders(page)
    if (pageOrders.length === 0) {
      break
    }
    orders.push(...pageOrders)
    const nextButton = page.locator('a.next').first()
    const isExistNextButton = await nextButton.isVisible()
    if (!isExistNextButton) {
      break;
    }
    const nextLink = await nextButton.getAttribute('href')
    if (!nextLink) {
      break;
    }
    await nextButton.click()
    await sleep(3000)
  }
  await page.close()
  return [...new Set(orders)]
}


interface DeliveryResult {
  orderId: string | number
  isSuccess: boolean
  message?: string
}


const deliveryOrder = async (ctx: BrowserContext, order: DeliveryResponse): Promise<DeliveryResult> => {
  const page = await ctx.newPage()
  await page.goto(getSuningDeliverySite(order.orderId))
  await sleep(3000)

  // 填写 SN 码
  const table = page.locator('table.sensitiveFlag')
  const body = table.locator('tbody')
  const row = body.locator('tr').first()
  const numTd = row.locator('td').last()
  const isExistNumTd = await numTd.isVisible()
  if (!isExistNumTd) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: '找不到商品数量',
    }
  }
  const numText = await numTd.textContent()
  const num = parseInt(numText?.split?.('x')?.[1] || '0')
  const snCode = Array.from({ length: num }, () => nanoid()).join(';')
  const textArea = page.locator('textarea').first()
  const isExistTextArea = await textArea.isVisible()
  if (!isExistTextArea) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: '找不到 SN 码输入框',
    }
  }
  await textArea.fill(snCode)


  const infoContainer = page.locator('div.manySelfLogisticsfun')
  const inputs = await infoContainer.locator('input').all()
  // 填写物流单号
  const orderInput = inputs[0]
  const isExistInput = await orderInput.isVisible()
  if (!isExistInput) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: '找不到物流单号输入框',
    }
  }
  await orderInput.fill(order.l_id?.toString?.() || '')
  // const label = span.locator('label').first()
  // await sleep(100)
  // await label.click()
  await sleep(100)

  try {
    const isExistAreaHide = await page.locator('div.areaHide').isVisible()
    if (isExistAreaHide) {
      await page.locator('div.areaHide').click()
      await sleep(100)
    }
  }
  catch (e) { }

  const deliveryCompanyInput = inputs[1]
  const isExistDeliveryCompanyInput = await deliveryCompanyInput.isVisible()
  if (!isExistDeliveryCompanyInput) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: '找不到物流公司输入框',
    }
  }
  await deliveryCompanyInput.click()
  await sleep(100)
  try {
    const isExistAreaHide = await page.locator('div.areaHide').isVisible()
    if (isExistAreaHide) {
      await page.locator('div.areaHide').click()
      await sleep(100)
    }
  }
  catch (e) { }
  const targetCompany = deliveries.find(company => company.text?.includes?.(order.logistics_company))
  if (!targetCompany) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: `未找到匹配的物流公司 ${order.logistics_company}`,
    }
  }
  await deliveryCompanyInput.evaluate((e, company) => {
    e.value = company.text
    e.setAttribute('code', company.code)
  }, targetCompany)

  const deliveryButtonContainer = page.locator('div.fh-center').first()
  const deliveryButton = deliveryButtonContainer.locator('a').first()
  const isExistDeliveryButton = await deliveryButton.isVisible()
  if (!isExistDeliveryButton) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: '找不到发货按钮',
    }
  }
  await deliveryButton.click()
  await sleep(3000)
  await page.close()
  return {
    orderId: order.orderId,
    isSuccess: true,
  }
}


export const deliveryOrders = async (ctx: BrowserContext, orders: DeliveryResponse[]) => {
  return Promise.all(orders.map(order => limit(async () => deliveryOrder(ctx, order))))
}