import 'babel-polyfill'
import router from './router'
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

// vue 图表
import VCharts from 'v-charts'
Vue.use(VCharts)

import * as filters from './filters' // global filters

// webWorker vue-worker
// import VueWorker from 'vue-worker'
// Vue.use(VueWorker)

// import VueBus from 'vue-bus' // global bus
// Vue.use(VueBus)

/**
 * ==================================全局插件注册=====================================>
 */
/** 请求插件 */
import {
  request
} from './utils/request'
Vue.prototype.$request = request

/**
 * ==================================全局组件注册=====================================>
 */
/** 图片上传组件 */
import Upload1 from '@/components/Upload/singleImage' // 单图片上传
import Upload2 from '@/components/Upload/singleImage2' // 单图片上传
import Upload3 from '@/components/Upload/singleImage3' // 单图片上传
import Upload4 from '@/components/Upload/singleImage4' // 单图片上传
import Upload5 from '@/components/Upload/singleImage5' // 单图片上传
Vue.component('Upload1', Upload1)
Vue.component('Upload2', Upload2)
Vue.component('Upload3', Upload3)
Vue.component('Upload4', Upload4)
Vue.component('Upload5', Upload5)
/** 系统下拉组件 */
import BoolSelect from '@/components/SysEnumSelect/BoolSelect'
import ServiceSelect from '@/components/SysEnumSelect/ServiceSelect'
Vue.component('BoolSelect', BoolSelect)
Vue.component('ServiceSelect', ServiceSelect)
/** 树形下拉组件 */
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
// Vue.component('Treeselect', Treeselect)
/** 列表头部组件 */
import TableListHeader from '@/views/components/TableListHeader.vue'
Vue.component('TableListHeader', TableListHeader)
/**
 * ==================================全局指令注册=====================================>
 */
/** dialog拖曳指令 */
import elDragDialog from '@/directive/el-dragDialog'
Vue.directive('elDragDialog', elDragDialog)

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// if (process.env.NODE_ENV === 'development') {
//   require('./mock') // simulation data
// }

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
