// 非空验证
const validateNull = (rule, value, callback) => {
  if (!value) {
    callback(new Error('此项为必填项'))
  }
  callback()
}
// 正整数验证
const validatePositiveInteger = (rule, value, callback) => {
  if (!/^[1-9]\d*$/.test(value)) {
    callback(new Error())
  }
  callback()
}
// 金额限制
const validateMoney = (rule, value, callback) => {
  if (value / 10000 > 300) {
    callback(new Error())
  }
  callback()
}
// 正浮点数验证
const validatePositiveFloat = (rule, value, callback) => {
  if (!/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value)) {
    callback(new Error())
  }
  callback()
}

// 手机号验证
const validatePhone = (rule, value, callback) => {
  const reg = /^((1[3-9]))\d{9}$/
  if (!reg.test(value)) {
    callback(new Error('手机号码不正确'))
  } else {
    callback()
  }
}

// 弱密码验证
const validateWeakPwd = (rule, value, callback) => {
  const reg = /(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
  if (!reg.test(value)) {
    callback(new Error('密码强度不够，必须包含数字、大小写字母，且6-18位'))
  } else {
    callback()
  }
}

export const baseFormRules = {
  // common
  title: [{ validator: validateNull, trigger: 'blur' }],
  name: [{ validator: validateNull, trigger: 'blur' }],
  content: [{ validator: validateNull, trigger: 'blur' }],
  phone: [{ validator: validateNull, trigger: 'blur' }],
  oldPwd: [{ validator: validateNull, trigger: 'blur', message: '密码不能为空' }],
  newPwd: [{ validator: validateNull, trigger: 'blur', message: '密码不能为空' }, { validator: validateWeakPwd, message: '密码强度不够，必须包含数字、大小写字母，且6-18位', trigger: 'blur' }],
  // bib
  bidRules: {
    borrowCause: [{ validator: validateNull, trigger: 'blur', message: '借款用途不能为空' }],
    businessType: [{ validator: validateNull, trigger: 'change', message: '业务类型不能为空' }],
    contractNum: [{ validator: validateNull, trigger: 'blur', message: '合同编号不能为空' }],
    contractTemplateId: [{ validator: validateNull, trigger: 'change', message: '合同模板不能为空' }],
    count: [
      { validator: validateNull, trigger: 'blur', message: '期限不能为空' },
      { validator: validatePositiveInteger, trigger: 'blur', message: '请输入正整数' }
    ],
    feeRateId: [{ validator: validateNull, trigger: 'change', message: '请选择管理费利率' }],
    interestType: [{ validator: validateNull, trigger: 'change', message: '请选择计息方式' }],
    money: [
      { validator: validateNull, trigger: 'blur', message: '金额不能为空' },
      { validator: validatePositiveInteger, trigger: 'blur', message: '请输入正整数' },
      { validator: validateMoney, trigger: 'blur', message: '金额不能超过300万' }
    ],
    name: [{ validator: validateNull, trigger: 'blur', message: '标的名称不能为空' }],
    periods: [
      { validator: validateNull, trigger: 'blur', message: '期数不能为空' },
      { validator: validatePositiveInteger, trigger: 'blur', message: '请输入正整数' }
    ],
    pledgeDetail: [{ validator: validateNull, trigger: 'blur', message: '借款人描述不能为空' }],
    productType: [{ validator: validateNull, trigger: 'change', message: '请选择产品类型' }],
    rateId: [{ validator: validateNull, trigger: 'change', message: '请选择利率' }],
    repayment: [{ validator: validateNull, trigger: 'change', message: '请选择还款方式' }],
    repaymentSource: [{ validator: validateNull, trigger: 'blur', message: '保障方式不能为空' }],
    userId: [{ validator: validateNull, trigger: 'change', message: '请选择借款人' }],
    providerId: [{ validator: validateNull, trigger: 'change', message: '请选择助贷机构' }],
    seriesType: [{ validator: validateNull, trigger: 'change', message: '请选择披露模板' }],
    replaceTxt: [{ validator: validateNull, trigger: 'blur', message: '保障方式不能为空' }],
    riskLevel: [{ validator: validateNull, trigger: 'change', message: '请选择风险等级' }],
    allowRefund: [{ validator: validateNull, trigger: 'change', message: '请选择还款对象' }],
    loanMoneyFlow: [{ validator: validateNull, trigger: 'change', message: '请选择放款资金流' }]
  },
  dialogRules: {
    remark: [{ validator: validateNull, trigger: 'blur', message: '内容不能为空' }, { min: 1, max: 200, message: '长度在不能超过200个字符', trigger: 'blur' }],
    treasureId: [{ validator: validateNull, trigger: 'blur', message: '和宝码不能为空' }],
    startTime: [{ validator: validateNull, trigger: 'change', message: '请选择时间' }],
    endTime: [{ validator: validateNull, trigger: 'change', message: '请选择时间' }],
    typeId: [{ validator: validateNull, trigger: 'change', message: '请选择权限类型' }],
    title: [{ validator: validateNull, trigger: 'blur', message: '名称不能为空' }],
    imgLink: [{ validator: validateNull, trigger: 'blur', message: '图片不能为空' }],
    portId: [{ validator: validateNull, trigger: 'change', message: '请选择客户端' }],
    showType: [{ validator: validateNull, trigger: 'change', message: '请选择显示位置' }],
    time: [{ validator: validateNull, trigger: 'change', message: '请选择时间' }],
    money: [{ validator: validatePositiveFloat, trigger: 'blur', message: '请输入正浮点数或者正整数' }],
    totalPage: [{ validator: validatePositiveInteger, trigger: 'blur', message: '请输入正整数' }],
    name: [{ validator: validateNull, trigger: 'blur', message: '名称不能为空' }],
    license: [{ validator: validateNull, trigger: 'blur', message: '营业执照号不能为空' }],
    legalName: [{ validator: validateNull, trigger: 'blur', message: '法人姓名不能为空' }],
    legalIdcard: [{ validator: validateNull, trigger: 'blur', message: '身份证号不能为空' }],
    registeredPlace: [{ validator: validateNull, trigger: 'blur', message: '注册地址不能为空' }],
    phone: [{ validator: validatePhone, trigger: 'blur', message: '手机号不正确' }],
    amount: [{ validator: validateNull, trigger: 'blur', message: '金额不能为空' }],
    remarks: [{ validator: validateNull, trigger: 'blur', message: '备注不能为空' }],
    couponType: [{ validator: validateNull, trigger: 'couponType', message: '请选择优惠券类型' }],
    showName: [{ validator: validateNull, trigger: 'blur', message: '名称不能为空' }],
    couponVal: [{ validator: validateNull, trigger: 'blur', message: '面值不能为空' }, { validator: validatePositiveFloat, trigger: 'blur', message: '请输入正浮点数或者正整数' }],
    dicId: [{ validator: validateNull, trigger: 'change', message: '请选择优惠券' }],
    type: [{ validator: validateNull, trigger: 'change', message: '请选择类型' }],
    amt: [{ validator: validatePositiveFloat, trigger: 'blur', message: '请输入正浮点数或者正整数' }],
    inAccount: [{ validator: validatePhone, trigger: 'blur', message: '手机号不正确' }],
    outAccount: [{ validator: validatePhone, trigger: 'blur', message: '手机号不正确' }],
    key: [{ validator: validateNull, trigger: 'blur', message: '请输入KEY' }],
    capAcntNo: [{ validator: validateNull, trigger: 'blur', message: '请输入银行卡号' }],
    province: [{ validator: validateNull, trigger: 'change', message: '请选择省份' }],
    cityId: [{ validator: validateNull, trigger: 'change', message: '请选择城市' }],
    parentBankId: [{ validator: validateNull, trigger: 'change', message: '请选择银行' }]
  }
  // [{ validator: validateNull, trigger: 'blur', message: '' }],

  // [{ validator: validateNull, trigger: 'change', message: '' }],

}
