interface Delivery {
  text: string
  code: string
}

const deliveries: Delivery[] = [
  {
    "text": "AAE-中国",
    "code": "A01"
  },
  {
    "text": "澳邮中国快运",
    "code": "AY1"
  },
  {
    "text": "安鲜达",
    "code": "AY2"
  },
  {
    "text": "安能快运（大件）",
    "code": "AN2"
  },
  {
    "text": "abc全球快运",
    "code": "AB1"
  },
  {
    "text": "安得物流",
    "code": "ANN"
  },
  {
    "text": "澳世速递",
    "code": "AS1"
  },
  {
    "text": "安世通",
    "code": "AS2"
  },
  {
    "text": "澳德物流",
    "code": "AD1"
  },
  {
    "text": "安迅物流",
    "code": "AX1"
  },
  {
    "text": "澳大利亚邮政",
    "code": "AUP"
  },
  {
    "text": "BHT",
    "code": "B01"
  },
  {
    "text": "百福东方",
    "code": "B02"
  },
  {
    "text": "百通",
    "code": "B05"
  },
  {
    "text": "比利时邮政",
    "code": "HA3"
  },
  {
    "text": "百世快运（大件）",
    "code": "BS1"
  },
  {
    "text": "奔腾物流",
    "code": "BT2"
  },
  {
    "text": "斑马物联网",
    "code": "BM1"
  },
  {
    "text": "城市一百",
    "code": "C01"
  },
  {
    "text": "程光快递",
    "code": "CG1"
  },
  {
    "text": "承诺达",
    "code": "CND"
  },
  {
    "text": "COE东方快递",
    "code": "COE"
  },
  {
    "text": "传喜物流",
    "code": "CX1"
  },
  {
    "text": "畅灵国际物流",
    "code": "CL1"
  },
  {
    "text": "菜鸟速递",
    "code": "CNL"
  },
  {
    "text": "德邦",
    "code": "D04"
  },
  {
    "text": "DHL",
    "code": "D01"
  },
  {
    "text": "D速快递",
    "code": "D02"
  },
  {
    "text": "大田物流",
    "code": "D03"
  },
  {
    "text": "大达物流",
    "code": "DD2"
  },
  {
    "text": "递四方",
    "code": "D4F"
  },
  {
    "text": "丹麦邮政",
    "code": "DKP"
  },
  {
    "text": "抖快物流",
    "code": "DKL"
  },
  {
    "text": "达达",
    "code": "DAD"
  },
  {
    "text": "EMS",
    "code": "E01"
  },
  {
    "text": "EWE全球快递",
    "code": "EW1"
  },
  {
    "text": "EMS国际件",
    "code": "EGJ"
  },
  {
    "text": "EFS快递",
    "code": "EF1"
  },
  {
    "text": "飞康达物流",
    "code": "F01"
  },
  {
    "text": "FedEx(国外)",
    "code": "F02"
  },
  {
    "text": "富腾达",
    "code": "HA1"
  },
  {
    "text": "泛捷国际速递",
    "code": "HB1"
  },
  {
    "text": "飞洋快递",
    "code": "HB4"
  },
  {
    "text": "方舟国际速递",
    "code": "HW9"
  },
  {
    "text": "丰通快运",
    "code": "FT1"
  },
  {
    "text": "方圆物流",
    "code": "FY2"
  },
  {
    "text": "飞跃物流",
    "code": "FY3"
  },
  {
    "text": "飞远配送",
    "code": "FY4"
  },
  {
    "text": "法国邮政",
    "code": "FRP"
  },
  {
    "text": "丰程物流",
    "code": "FC1"
  },
  {
    "text": "丰网速运",
    "code": "FWS"
  },
  {
    "text": "广东邮政物流",
    "code": "G01"
  },
  {
    "text": "共速达",
    "code": "G04"
  },
  {
    "text": "高捷快运",
    "code": "GJK"
  },
  {
    "text": "海带宝",
    "code": "HA5"
  },
  {
    "text": "恒路物流",
    "code": "HL1"
  },
  {
    "text": "华美快递",
    "code": "HM1"
  },
  {
    "text": "黄马甲快递",
    "code": "HM2"
  },
  {
    "text": "海信物流",
    "code": "HX1"
  },
  {
    "text": "汇强快递",
    "code": "H03"
  },
  {
    "text": "合众快递",
    "code": "UCS"
  },
  {
    "text": "汇森快递",
    "code": "HS1"
  },
  {
    "text": "黑猫宅急便",
    "code": "TC1"
  },
  {
    "text": "环球速运",
    "code": "HQ1"
  },
  {
    "text": "华强物流",
    "code": "HQ2"
  },
  {
    "text": "韩国邮政",
    "code": "KRP"
  },
  {
    "text": "华宇物流",
    "code": "HY1"
  },
  {
    "text": "佳怡物流",
    "code": "J02"
  },
  {
    "text": "京广速递",
    "code": "J03"
  },
  {
    "text": "急先达",
    "code": "J04"
  },
  {
    "text": "佳吉快运",
    "code": "J01"
  },
  {
    "text": "金岸物流",
    "code": "JA1"
  },
  {
    "text": "极地快递",
    "code": "JD1"
  },
  {
    "text": "九曳供应链",
    "code": "JZ1"
  },
  {
    "text": "金象物流",
    "code": "JX1"
  },
  {
    "text": "加州猫速递",
    "code": "JZM"
  },
  {
    "text": "极兔速递",
    "code": "JT1"
  },
  {
    "text": "加运美",
    "code": "JYM"
  },
  {
    "text": "景光物流",
    "code": "JG1"
  },
  {
    "text": "晋越快递",
    "code": "JY1"
  },
  {
    "text": "加拿大邮政",
    "code": "CAP"
  },
  {
    "text": "捷克邮政",
    "code": "CZP"
  },
  {
    "text": "嘉贤物流",
    "code": "JXL"
  },
  {
    "text": "京东物流",
    "code": "JDW"
  },
  {
    "text": "快捷速递",
    "code": "K01"
  },
  {
    "text": "跨越速运",
    "code": "KY1"
  },
  {
    "text": "开心快线",
    "code": "KX1"
  },
  {
    "text": "快刀云",
    "code": "KDY"
  },
  {
    "text": "快服务",
    "code": "KFW"
  },
  {
    "text": "科捷物流",
    "code": "KJL"
  },
  {
    "text": "快捷物流",
    "code": "KJWL"
  },
  {
    "text": "龙邦物流",
    "code": "L01"
  },
  {
    "text": "联昊通速递",
    "code": "L02"
  },
  {
    "text": "联邦快递",
    "code": "L03"
  },
  {
    "text": "蓝天国际航空",
    "code": "HW6"
  },
  {
    "text": "联合快递",
    "code": "LH1"
  },
  {
    "text": "林氏物流",
    "code": "LSW"
  },
  {
    "text": "明亮物流",
    "code": "M01"
  },
  {
    "text": "美团配送",
    "code": "MT1"
  },
  {
    "text": "民航快递",
    "code": "CAE"
  },
  {
    "text": "美快国际",
    "code": "MK1"
  },
  {
    "text": "美联快递",
    "code": "ML1"
  },
  {
    "text": "美通快递",
    "code": "MT2"
  },
  {
    "text": "美国邮政",
    "code": "USP"
  },
  {
    "text": "能达速递",
    "code": "NDA"
  },
  {
    "text": "欧洲快运",
    "code": "OK1"
  },
  {
    "text": "欧亚专线",
    "code": "OY1"
  },
  {
    "text": "PCA EXPRESS",
    "code": "HA8"
  },
  {
    "text": "品骏快递",
    "code": "PJ1"
  },
  {
    "text": "平安快递",
    "code": "PA1"
  },
  {
    "text": "平安达腾飞",
    "code": "PAFD"
  },
  {
    "text": "全一快递",
    "code": "Q01"
  },
  {
    "text": "全晨快递",
    "code": "Q02"
  },
  {
    "text": "全日通快递",
    "code": "Q04"
  },
  {
    "text": "全峰快递",
    "code": "Q03"
  },
  {
    "text": "青岛安捷",
    "code": "AJ1"
  },
  {
    "text": "如风达快递",
    "code": "R01"
  },
  {
    "text": "日日顺",
    "code": "L04"
  },
  {
    "text": "瑞达快递",
    "code": "RD1"
  },
  {
    "text": "日日通国际",
    "code": "RR1"
  },
  {
    "text": "日本邮政",
    "code": "JPP"
  },
  {
    "text": "顺丰速运",
    "code": "S02"
  },
  {
    "text": "申通快递",
    "code": "S01"
  },
  {
    "text": "速尔快递",
    "code": "S03"
  },
  {
    "text": "三态速递",
    "code": "S04"
  },
  {
    "text": "苏宁物流",
    "code": "SN2"
  },
  {
    "text": "速派快递",
    "code": "HB2"
  },
  {
    "text": "速必达",
    "code": "SP1"
  },
  {
    "text": "商桥物流",
    "code": "SQ1"
  },
  {
    "text": "晟邦物流",
    "code": "SB1"
  },
  {
    "text": "SQK国际速递",
    "code": "HA7"
  },
  {
    "text": "顺捷丰达",
    "code": "SJ1"
  },
  {
    "text": "盛丰物流",
    "code": "SF1"
  },
  {
    "text": "顺心捷达",
    "code": "SXJ"
  },
  {
    "text": "速递中国",
    "code": "SDC"
  },
  {
    "text": "盛辉物流",
    "code": "SH1"
  },
  {
    "text": "SYNSHIP快递",
    "code": "SYN"
  },
  {
    "text": "速达快递",
    "code": "SD2"
  },
  {
    "text": "速通物流",
    "code": "ST2"
  },
  {
    "text": "速腾物流",
    "code": "ST1"
  },
  {
    "text": "申通国际",
    "code": "STI"
  },
  {
    "text": "TNT",
    "code": "T01"
  },
  {
    "text": "天地华宇",
    "code": "H02"
  },
  {
    "text": "同舟快递",
    "code": "HW5"
  },
  {
    "text": "泰捷达物流",
    "code": "TJD"
  },
  {
    "text": "天翼快递",
    "code": "TY1"
  },
  {
    "text": "天马转运",
    "code": "TMK"
  },
  {
    "text": "天际快递",
    "code": "TJ1"
  },
  {
    "text": "通用物流",
    "code": "TY2"
  },
  {
    "text": "天翔快递",
    "code": "TX1"
  },
  {
    "text": "腾达速递",
    "code": "TD1"
  },
  {
    "text": "泰进物流",
    "code": "TJ2"
  },
  {
    "text": "UPS",
    "code": "U02"
  },
  {
    "text": "USPS",
    "code": "US1"
  },
  {
    "text": "UEQ",
    "code": "UEQ"
  },
  {
    "text": "万象物流",
    "code": "WX1"
  },
  {
    "text": "沃埃家",
    "code": "WA1"
  },
  {
    "text": "威时沛运",
    "code": "W01"
  },
  {
    "text": "威盛快递",
    "code": "WSL"
  },
  {
    "text": "万家物流",
    "code": "WJ1"
  },
  {
    "text": "新邦物流",
    "code": "X03"
  },
  {
    "text": "信丰物流",
    "code": "X04"
  },
  {
    "text": "迅达速递",
    "code": "XD1"
  },
  {
    "text": "新杰物流",
    "code": "XJ1"
  },
  {
    "text": "小熊物流",
    "code": "XX1"
  },
  {
    "text": "香港邮政",
    "code": "HKP"
  },
  {
    "text": "新干线快递",
    "code": "XGX"
  },
  {
    "text": "新亚物流",
    "code": "XY1"
  },
  {
    "text": "新西兰邮政",
    "code": "NZP"
  },
  {
    "text": "小米物流",
    "code": "XML"
  },
  {
    "text": "圆通速递",
    "code": "Y01"
  },
  {
    "text": "优速快递",
    "code": "Y10"
  },
  {
    "text": "韵达快递",
    "code": "Y02"
  },
  {
    "text": "亚风快递",
    "code": "Y03"
  },
  {
    "text": "远成物流",
    "code": "Y06"
  },
  {
    "text": "运通速运",
    "code": "Y08"
  },
  {
    "text": "亚马逊物流",
    "code": "YM1"
  },
  {
    "text": "易达通快递",
    "code": "YD1"
  },
  {
    "text": "邮政国际",
    "code": "GJ1"
  },
  {
    "text": "原飞航物流",
    "code": "YF1"
  },
  {
    "text": "壹米滴答",
    "code": "YM2"
  },
  {
    "text": "宇鑫物流",
    "code": "YX1"
  },
  {
    "text": "永利八达通",
    "code": "B06"
  },
  {
    "text": "易达国际速递",
    "code": "YD2"
  },
  {
    "text": "鹰运国际速递",
    "code": "YY1"
  },
  {
    "text": "韵达物流（大件）",
    "code": "YD3"
  },
  {
    "text": "优邦速运",
    "code": "YB1"
  },
  {
    "text": "燕文物流",
    "code": "YW1"
  },
  {
    "text": "宇佳物流",
    "code": "YJ1"
  },
  {
    "text": "余氏东风",
    "code": "YS1"
  },
  {
    "text": "银河物流",
    "code": "MW1"
  },
  {
    "text": "圆通香港",
    "code": "YTG"
  },
  {
    "text": "洋包裹",
    "code": "YBG"
  },
  {
    "text": "韵达国际",
    "code": "YDG"
  },
  {
    "text": "邮政快递包裹",
    "code": "B03"
  },
  {
    "text": "邮政电商标快",
    "code": "YZBK"
  },
  {
    "text": "中通快递",
    "code": "Z01"
  },
  {
    "text": "中铁快运",
    "code": "Z02"
  },
  {
    "text": "中邮物流",
    "code": "Z03"
  },
  {
    "text": "宅急送",
    "code": "Z04"
  },
  {
    "text": "中华邮政",
    "code": "HW2"
  },
  {
    "text": "中环快递",
    "code": "HW7"
  },
  {
    "text": "中通快运（大件）",
    "code": "ZT1"
  },
  {
    "text": "芝麻开门",
    "code": "ZM1"
  },
  {
    "text": "长江国际速递",
    "code": "CJ1"
  },
  {
    "text": "中联速运",
    "code": "ZL2"
  },
  {
    "text": "中加国际快递",
    "code": "HW4"
  },
  {
    "text": "增速物流",
    "code": "ZS1"
  },
  {
    "text": "卓志速运",
    "code": "ZZ1"
  },
  {
    "text": "转运四方4PX",
    "code": "HA6"
  },
  {
    "text": "中远e环球",
    "code": "ZY1"
  },
  {
    "text": "中外运速递",
    "code": "ZWY"
  },
  {
    "text": "中骅物流",
    "code": "ZH1"
  },
  {
    "text": "长宇物流",
    "code": "CY1"
  },
  {
    "text": "芝华仕物流",
    "code": "ZSH"
  },
  {
    "text": "中通国际",
    "code": "ZG1"
  }
]

const preferMap: Record<string, Delivery> = {
  '标准快递': {
    "text": "邮政电商标快",
    "code": "YZBK"
  },
}
export const matchCompany = (company: string) => {
  const prefer = preferMap[company]
  if (prefer) {
    return prefer
  }
  return deliveries.find(delivery => delivery.text.includes(company))
}
