const relate = [
  {
    path: 'relate/bidTemplateInfo',
    name: 'bus-relate-bidTemplateInfo',
    component: () => import('@/views/system/dictionary/typeItem'),
    meta: {
      title: '披露信息模板管理',
      simplify: 'bid_template_info'
    }
  },
  {
    path: 'relate/bidTemplateInfo/key',
    name: 'bus-relate-bidTemplateInfo-key',
    hidden: true,
    component: () => import('@/views/business/relate/bidTemplateInfo-key'),
    meta: {
      title: '披露模板KEY管理'
    }
  },
  {
    path: 'relate/riskEvaluation',
    name: 'bus-relate-riskEvaluation',
    component: () => import('@/views/system/dictionary/typeItem'),
    meta: {
      title: '出借人测评模板',
      simplify: 'investor_risk_evaluation'
    }
  },
  {
    path: 'relate/riskLevel',
    name: 'bus-relate-riskLevel',
    component: () => import('@/views/system/dictionary/typeItem'),
    meta: {
      title: '测评等级管理',
      simplify: 'platform_risk_level'
    }
  },
  {
    path: 'relate/bidType',
    name: 'bus-relate-bidType',
    component: () => import('@/views/business/relate/bidType'),
    meta: {
      title: '标的类型管理'
    }
  },
  {
    path: 'relate/bidFilterConfig',
    name: 'bus-relate-bidFilterConfig',
    component: () => import('@/views/business/relate/bidFilterConfig'),
    meta: {
      title: '高级筛选配置'
    }
  },
  {
    path: 'relate/cooperate',
    name: 'bus-relate-cooperate',
    component: () => import('@/views/business/relate/cooperate'),
    meta: {
      title: '合作单位管理'
    }
  },
  {
    path: 'relate/hbCode',
    name: 'bus-relate-hbCode',
    component: () => import('@/views/business/relate/hbCode'),
    meta: {
      title: '和宝码管理'
    }
  },
  {
    path: 'relate/hbCode/bidList',
    name: 'bus-relate-hbCode-item-bid',
    hidden: true,
    component: () => import('@/views/business/relate/hbCode-item-bid'),
    meta: {
      title: '和宝码-标的列表',
      parent: '/bus/relate/hbCode'
    }
  },
  {
    path: 'relate/hbCode/cooperate',
    name: 'bus-relate-hbCode-cooperate',
    hidden: true,
    component: () => import('@/views/business/relate/hbCode-item-cooperate'),
    meta: {
      title: '和宝码-合作单位',
      parent: '/bus/relate/hbCode'
    }
  }
]

export default relate
