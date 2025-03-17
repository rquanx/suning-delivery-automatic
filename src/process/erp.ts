import type { BrowserContext } from "playwright"
import { sleep } from "../utils/timer"
import pLimit from "p-limit"
import { closePage } from "../utils/browser/playwright"

const limit = pLimit(10)

const erpSite = 'https://www.erp321.com/epaas'

export const goToErp = async (ctx: BrowserContext) => {
  const page = await ctx.newPage()
  await page.goto(erpSite)
  return page;
}

export interface DeliveryResponse {
  orderId: string | number
  logistics_company: string
  l_id: string | number
  message?: string
}

export const getDeliveryId = async (orderId: string | number, cookie: string): Promise<Partial<DeliveryResponse>> => {
  try {
    // 基础参数配置
    const baseParams = {
      __VIEWSTATE: '/wEPDwUKLTg5NDY5MjY3MGRkdgQjzOR1eVC5DO5/BTm0IdK8Yqw=',
      __VIEWSTATEGENERATOR: 'C8154B07',
      insurePrice: '',
      _jt_page_count_enabled: '',
      _jt_page_increament_enabled: 'true',
      _jt_page_increament_page_mode: '',
      _jt_page_increament_key_value: '',
      _jt_page_increament_business_values: '',
      _jt_page_increament_key_name: 'o_id',
      _jt_page_size: '50',
      _jt_page_action: '1',

      // 接收方信息
      fe_node_desc: '',
      receiver_state: '',
      receiver_city: '',
      receiver_district: '',
      receiver_address: '',
      receiver_name: '',
      receiver_phone: '',
      receiver_mobile: '',
      check_name: '',
      check_address: '',

      // 备注相关
      fe_remark_type: 'single',
      fe_flag: '',
      fe_is_append_remark: '',
      feedback: '',

      // 回调相关
      __CALLBACKID: 'JTable1',
      __CALLBACKPARAM: JSON.stringify({
        Method: 'LoadDataToJSON',
        Args: [
          '1',
          JSON.stringify([
            {
              k: 'so_id',
              v: orderId,
              c: '@=',
            },
          ]),
          '{}',
        ],
      }),
    }

    // 将对象转换为URL编码的字符串
    const formBody = new URLSearchParams(baseParams).toString()

    const res = await fetch(`https://www.erp321.com/app/order/order/list.aspx?_c=jst-epaas&filterType=o_unsent&am___=LoadDataToJSON`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: 'https://www.erp321.com',
        priority: 'u=1, i',
        referer: 'https://www.erp321.com/app/order/order/list.aspx?_c=jst-epaas&filterType=o_unsent',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        cookie
      },
      body: formBody,
      mode: 'cors',
      credentials: 'include',
    })

    const response = await res.text()
    if (!response) {
      return {
        orderId,
        message: '获取物流信息失败'
      }
    }
    const jsonStr = response.split('|')[1]
    const returnData = JSON.parse(jsonStr)
    const returnValue = JSON.parse(returnData.ReturnValue)
    const data = returnValue.datas?.[0]
    return {
      orderId,
      logistics_company: data?.logistics_company,
      l_id: data?.l_id,
    }
  } catch (e) {
    return {
      orderId,
      message: e?.toString?.(),
    }
  }
}

export const getDeliveryIds = async (ctx: BrowserContext, orders: (string | number)[], progress?: () => void) => {
  const page = await goToErp(ctx)
  await sleep(3000)
  const cookies = await ctx.cookies()
  const cookieStr = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
  const input = orders.map(order => limit(async () => {
    const r = await getDeliveryId(order, cookieStr)
    await sleep(300)
    progress?.()
    return r;
  }))
  const result = await Promise.all(input);
  await closePage(page)
  return result
}