import { describe, expect, it } from 'vitest'
import { getDeliveryId } from '../src/process/erp'

const yourCookie = 'YOUR_COOKIE'
describe('erp', () => {
  it('getDeliveryId test', async () => {
    const res = await getDeliveryId('36273878861', yourCookie)
    expect(res).toMatchInlineSnapshot(`
      {
        "l_id": "YT1922460375442",
        "logistics_company": "圆通",
        "orderId": "36273878861",
      }
    `);
  })
})