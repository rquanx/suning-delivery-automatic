import type { DeliveryResponse } from './process/erp'
import type { DeliveryResult } from './process/suning'
import Papa from 'papaparse'
import fs from 'fs'
import path from 'pathe'
import dayjs from 'dayjs'

export const generateReport = (deliveries: DeliveryResponse[], orders: DeliveryResult[]) => {
  if (deliveries.length < 1) {
    return
  }
  const resultMap = orders.reduce((acc, order) => {
    acc[order.orderId] = order
    return acc
  }, {} as Record<string, DeliveryResult>)

  const report = deliveries.map((delivery, index) => {
    const result = resultMap[delivery.orderId]
    return {
      '订单号': delivery.orderId,
      '物流公司': delivery.logistics_company,
      '物流单号': delivery.l_id,
      '发货结果': result?.isSuccess ? '成功' : '失败',
      'sn码': result?.snCode,
      '匹配的物流公司': result?.logisticsCompany,
      '错误信息': delivery?.message || result?.message,
    }
  })
  // 添加 UTF-8 BOM
  const BOM = '\uFEFF'
  const csv = BOM + Papa.unparse(report)

  // Create reports directory if it doesn't exist
  const reportsDir = path.join(import.meta.dirname, 'reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir)
  }

  // Generate filename with current date and time using dayjs
  const formattedDate = dayjs().format('YYYY-MM-DD HH.mm.ss')
  const fileName = `${formattedDate}-report.csv`

  // Write the CSV file to the reports directory
  fs.writeFileSync(path.join(reportsDir, fileName), csv, { encoding: 'utf-8' });
}
