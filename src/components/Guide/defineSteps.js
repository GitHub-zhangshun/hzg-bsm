const steps = [
  {
    element: '.guide-guide',
    popover: {
      title: '使用指南',
      description: '页面功能简介,可以使用方向键控制 ➡️下一步 ⬅️上一步',
      position: 'bottom',
      nextBtnText: '下一步'
    }
  },
  {
    element: '.guide-screenfull',
    popover: {
      title: '全屏显示',
      description: '页面可以全屏膜显示',
      position: 'left'
    }
  },
  {
    element: '.guide-qr-code',
    popover: {
      title: '我的归属二维码',
      description: '查看我的归属二维码用于出借人扫码注册',
      position: 'left'
    }
  },
  {
    element: '.guide-lang',
    popover: {
      title: '语言切换',
      description: '可以中英文切换,目前语言包还没有配置,再等等吧少年',
      position: 'left'
    }
  },
  {
    element: '.guide-theme',
    popover: {
      title: '主题切换',
      description: '亲,可以选择你喜欢的颜色哦,粉粉的最可爱(*╹▽╹*)',
      position: 'left'
    }
  },
  {
    element: '.guide-dropdown',
    popover: {
      title: '头像 & 操作下拉',
      description: '所有的操作都隐藏在这里面,可以点开看看哦',
      position: 'left'
    }
  },
  {
    element: '.guide-hamburger',
    popover: {
      title: '菜单折叠',
      description: '打开 && 折叠菜单',
      position: 'bottom'
    }
  },
  {
    element: '.guide-tabs',
    popover: {
      title: '快捷标签栏',
      description: '你打开的所有页面都会存储到这里,可以点击关闭也可以右键选择其他操作',
      position: 'bottom'
    }
  }
]

export default steps
