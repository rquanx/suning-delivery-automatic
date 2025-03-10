import type { DeliveryResponse } from './erp';
import type { BrowserContext, Page } from "playwright"
import { sleep } from "../utils/timer"
import { customAlphabet } from 'nanoid'
import pLimit from 'p-limit';

const nanoid = customAlphabet('1234567890', 17)
const limit = pLimit(5)

export const suningDeliveryListSite = 'https://moms.suning.com/moms/delivery/toHaveSoldBabyMain.action?tabtype=3'
export const getSuningDeliverySite = (no: number | string) => `https://moms.suning.com/moms/delivery/toDeliveryGoods.action?pagetype=1&b2corderNos=${no}`

const getCurrentPageOrders = async (page: Page) => {
  const orderNos = await page.locator('span.order-list-orderNum').all()
  const orders = (await Promise.all(orderNos.map(orderNo => orderNo.textContent()))).filter(Boolean) as string[]
  return orders.map(order => order.split('：')[1]).filter(Boolean)
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
    await page.goto(nextLink)
    await sleep(3000)
  }
  return orders
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


  // 填写物流单号
  const orderSpan = page.locator('span:has-text("物流单号：")').first()
  const input = orderSpan.locator('input').first()
  const isExistInput = await input.isVisible()
  if (!isExistInput) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: '找不到物流单号输入框',
    }
  }
  await input.fill(order.l_id?.toString?.() || '')
  // const label = span.locator('label').first()
  // await sleep(100)
  // await label.click()
  // await sleep(100)

  const companySpan = orderSpan.locator('span:has-text("物流公司：")').first()
  const deliveryCompanyInput = companySpan.locator('input').first()
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
  const allLi = await companySpan.locator('div._logisCompanyOptionConFig li').all()
  const allCompany = await Promise.all(allLi.map(async li => {
    const text = await li.textContent()
    const value = await li.getAttribute('code')
    return { text, value }
  }))
  const targetCompany = allCompany.find(company => company.text?.includes?.(order.logistics_company))
  if (!targetCompany) {
    return {
      orderId: order.orderId,
      isSuccess: false,
      message: `未找到匹配的物流公司 ${order.logistics_company}`,
    }
  }
  await deliveryCompanyInput.fill(targetCompany.value || '')
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
  return {
    orderId: order.orderId,
    isSuccess: true,
  }
}


export const deliveryOrders = async (ctx: BrowserContext, orders: DeliveryResponse[]) => {
  return Promise.all(orders.map(order => limit(async () => {
    const r = await deliveryOrder(ctx, order)
    await sleep(300)
    return r;
  })))
}