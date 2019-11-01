import {
  isNullOrUndefined,
  isObject,
  isString
} from 'util'
import {
  Decimal
} from 'decimal.js'
import {
  parseTime
} from '@/utils/index'
import auth from '@/utils/auth.js'
import store from '@/store'
import router from '@/router/index'
/**
 * 基础函数
 *
 * @export
 * @returns
 */
export function _func() {
  return {
    // 隐藏的查询
    getList() {
      // 添加禁止搜索按钮状态
      store.dispatch('setDisabledSearch', true)
      // 重置分页
      if (window.localStorage.getItem('ResetTablePage') === 'true' && this.pageForm && Object.keys(this.pageForm).length > 0) {
        this.pageForm = {
          total: 0,
          index: 1,
          size: 10
        }
        // 恢复重置分页状态
        window.localStorage.setItem('ResetTablePage', false)
      }
      this.table.loading = true
      let data = ''
      // 处理搜索数据
      if (this.searchForm && Object.keys(this.searchForm).length > 0) {
        Object.keys(this.searchForm).map(item => {
          if (this.searchForm[item] === '') {
            this.searchForm[item] = null
          }
        })
      }
      // 多参数
      if (this.pageForm && Object.keys(this.pageForm).length > 0) {
        // 分页数据存在必定为多参数
        data = Object.assign(this.pageForm, this.searchForm || {}, this.tableListQuery || {})
      } else {
        if (this.searchForm && Object.keys(this.searchForm).length > 1) {
          // 搜索数据存在且参数大于1个
          data = Object.assign(this.pageForm || {}, this.searchForm || {}, this.tableListQuery || {})
        } else if (isObject(this.tableListQuery) && Object.keys(this.tableListQuery).length > 0) {
          // 查询数据存在且参数大于一个
          data = Object.assign(this.pageForm || {}, this.searchForm || {}, this.tableListQuery || {})
        } else if (this.searchForm && Object.keys(this.searchForm).length > 0 && this.tableListQuery && Object.keys(this.tableListQuery).length > 0) {
          // 搜索数据存在并且查询数据存在
          data = Object.assign(this.pageForm || {}, this.searchForm || {}, this.tableListQuery || {})
        } else {
          // 剩余的为单参数 搜索数据为1个 或者 查询数据为1个
          if (isObject(this.searchForm) && Object.keys(this.searchForm).length === 1) {
            data = this.searchForm[Object.keys(this.searchForm)[0]]
          } else if (isObject(this.tableListQuery) && Object.keys(this.tableListQuery).length === 1) {
            data = this.tableListQuery[Object.keys(this.tableListQuery)[0]]
          } else {
            data = this.tableListQuery
          }
        }
      }

      // 获取查询地址 隐藏按钮 获取 查询按钮
      let url = this.currentMenuHiddenRunFuncList['F_TABLE_LIST']
      if (!url) {
        // 尝试从查询按钮获取
        const cmt = this.currentMenuTopRunFuncList.find(item => item.funcName === 'func_query')
        if (cmt) {
          url = cmt.apiUrl
        } else {
          // location.reload()
          router.push('/401')
        }
      }
      if (!url) {
        return
      }
      this.$request({
        url,
        data
      }).then(data => {
        if (this.pageForm) {
          this.pageForm.total = data.total
        }
        this.table.list = data.result
        this.table.loading = false
        store.dispatch('setDisabledSearch', false)
      }).catch(() => {
        this.table.loading = false
        store.dispatch('setDisabledSearch', false)
      })
    },
    // 查询按钮的查询
    func_query(action) {
      // 添加禁止搜索按钮状态
      store.dispatch('setDisabledSearch', true)
      // 重置分页
      if (window.localStorage.getItem('ResetTablePage') === 'true' && this.pageForm && Object.keys(this.pageForm).length > 0) {
        this.pageForm = {
          total: 0,
          index: 1,
          size: 5
        }
        // 恢复重置分页状态
        window.localStorage.setItem('ResetTablePage', false)
      }
      this.table.loading = true
      let data = ''
      // 处理搜索数据
      if (this.searchForm && Object.keys(this.searchForm).length > 0) {
        Object.keys(this.searchForm).map(item => {
          if (this.searchForm[item] === '') {
            this.searchForm[item] = null
          }
        })
      }
      // 多参数
      if (this.pageForm && Object.keys(this.pageForm).length > 0) {
        // 主动查询 分页重置
        this.pageForm.num = 1
        // 分页数据存在必定为多参数
        data = Object.assign(this.pageForm, this.searchForm || {}, this.tableListQuery || {})
      } else {
        if (this.searchForm && Object.keys(this.searchForm).length > 1) {
          // 搜索数据存在且参数大于1个
          data = Object.assign(this.pageForm || {}, this.searchForm || {}, this.tableListQuery || {})
        } else if (isObject(this.tableListQuery) && Object.keys(this.tableListQuery).length > 0) {
          // 查询数据存在且参数大于一个
          data = Object.assign(this.pageForm || {}, this.searchForm || {}, this.tableListQuery || {})
        } else if (this.searchForm && Object.keys(this.searchForm).length > 0 && this.tableListQuery && Object.keys(this.tableListQuery).length > 0) {
          // 搜索数据存在并且查询数据存在
          data = Object.assign(this.pageForm || {}, this.searchForm || {}, this.tableListQuery || {})
        } else {
          // 剩余的为单参数 搜索数据为1个 或者 查询数据为1个
          if (isObject(this.searchForm) && Object.keys(this.searchForm).length === 1) {
            data = this.searchForm[Object.keys(this.searchForm)[0]]
          } else if (isObject(this.tableListQuery) && Object.keys(this.tableListQuery).length === 1) {
            data = this.tableListQuery[Object.keys(this.tableListQuery)[0]]
          } else {
            data = this.tableListQuery
          }
        }
      }

      this.$request({
        url: action.apiUrl,
        data
      }).then(data => {
        if (this.pageForm) {
          this.pageForm.total = data.total
        }
        this.table.list = data.result
        this.table.loading = false
        store.dispatch('setDisabledSearch', false)
      }).catch(() => {
        this.table.loading = false
        store.dispatch('setDisabledSearch', false)
      })
    },
    // table 选中行
    handleSelectionChange(val) {
      this.table.tableChangeList = val
    },
    // 改变每页数量
    handleSizeChange(val) {
      this.pageForm.size = val
      this.getList()
    },
    // 改变页数
    handleCurrentChange(val) {
      this.pageForm.num = val
      this.getList()
    },
    // 重置分页
    resetPage() {
      this.pageForm.page = 1
      this.pageForm.size = 5
    },
    /** 执行顶部对应函数 */
    top_execute(action) {
      let row = []
      // 顶部获取选中的数据
      if (!isNullOrUndefined(this.table) && !isNullOrUndefined(this.table.tableChangeList) && this.table.tableChangeList.length > 0) {
        row = this.table.tableChangeList
      }
      this[action.funcName](action, row)
    },
    /** 执行右侧函数 */
    right_execute(action, row) {
      const rowArr = []
      // 转换为数组
      if (!isNullOrUndefined(row)) {
        rowArr.push(row)
      }
      this[action.funcName](action, rowArr)
    },
    // 删除事件
    func_del(action, row) {
      if (row.length === 0) {
        this.$message.info('请选择数据')
        return
      }
      this.$confirm('是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        row.map(item => {
          ids.push(item.Id)
        })
        this.$request({
          url: action.apiUrl,
          data: ids
        }).then(() => {
          this.getList()
        })
      })
    },
    // 带参数基础路由跳转事件
    func_jump(action, row) {
      if (row.length !== 1) {
        this.$message.info('请选择一条数据')
        return
      }
      // 构建跳转参数
      const query = {
        id: row[0].Id || row[0].id,
        name: row[0].title || row[0].name || row[0].bidName || row[0].enterpriseName || row[0].realName || this.$route.query.name || row[0].providerName
      }
      // 小众参数
      if (row[0].isPrepayment) {
        query.isPrepayment = row[0].isPrepayment
      }
      this.$router.push({
        name: action.routeUrl,
        query
      })
    },
    // 无参数基础路由跳转事件
    func_jump_no_arg(action, row) {
      this.$router.push({
        name: action.routeUrl
      })
    },
    // 获取枚举类型
    async getTypeEnum(url, simplify, parSimplify, queryType) {
      const typeList = []
      await this.$request({
        url: url,
        data: {
          queryType: queryType || '1', // 简化序列号查询
          queryValue: simplify,
          parentValue: parSimplify
        }
      }).then(data => {
        // 构建数据
        data.result.map(item => {
          typeList.push({
            Id: item.Id,
            title: item.title,
            simplify: item.simplify,
            remark: item.remark,
            sort: item.sort,
            children: item.children,
            isUse: item.isUse,
            extend: item.extend
          })
        })
      })
      return typeList
    },
    // 获取枚举状态
    async getStatusEnum(url, simplify) {
      const statusList = []
      await this.$request({
        url,
        data: simplify
      }).then(data => {
        data.result.map(item => {
          statusList.push({
            Id: item.Id,
            title: item.title,
            simplify: item.simplify,
            remark: item.remark,
            sort: item.sort,
            isUse: item.isUse,
            children: item.children,
            extend: item.extend
          })
        })
      })
      return statusList
    },
    // 和宝码模糊查询
    queryHBCodeAsync(query) {
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_HB_CODE_LIST'],
        data: {
          keyword: query,
          num: 1,
          size: 10
        }
      }).then(data => {
        this.codeList = data.result
      })
    },
    // 保理机构模糊查询
    queryFactoringAsync(query) {
      if (query) {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_FACTORING_LIST'],
          data: {
            name: query,
            num: '1',
            size: '10',
            isContract: 'true'
          }
        }).then(data => {
          this.factoringList = data.result
        })
      }
    },
    // 助贷机构模糊查询
    queryProviderAsync(query) {
      if (query) {
        this.selectLoading = true
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_PROVIDER_LIST'],
          data: {
            name: query,
            num: '1',
            size: '10',
            isOpen: 'true'
          }
        }).then(data => {
          this.providerList = data.result
          this.selectLoading = false
        }).catch(() => {
          this.selectLoading = false
        })
      }
    },
    // 借款人模糊查询
    queryBorrowerAsync(query) {
      if (query) {
        let providerId = null
        if (this.baseForm && this.baseForm.providerId) {
          providerId = this.baseForm.providerId
        } else if (this.searchForm && this.searchForm.providerId) {
          providerId = this.searchForm.providerId
        } else if (this.form && this.form.providerId) {
          providerId = this.form.providerId
        }
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_BORROWER_LIST'],
          data: {
            name: query,
            num: '1',
            size: '10',
            providerId: this.borrowerSearchType === '1' ? null : providerId,
            isOpen: 'true'
          }
        }).then(data => {
          this.borrowerList = data.result
        })
      }
    },
    // 省份模糊查询
    queryProvinceAsync(query) {
      if (query) {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_LIKE_PRO'],
          data: query
        }).then(data => {
          this.provinceList = data.result
        })
      }
    },
    // 城市模糊查询
    queryCityAsync(query) {
      if (query) {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_LIKE_CITY'],
          data: query
        }).then(data => {
          this.cityList = data.result
        })
      }
    },
    // 电子合同账户模糊查询
    queryContractAccountAsync(query) {
      if (query) {
        this.$request({
          url: this.currentMenuHiddenRunFuncList['O_ACCOUNT_LIST'],
          data: {
            name: query,
            num: '1',
            size: '10'
          }
        }).then(data => {
          this.contractAccountList = data.result
        })
      }
    },
    // 图片上传
    uploadRequest(fileResult) {
      // 利用html5的fileReader函数监听 获取图片的base_64
      const reader = new FileReader()
      reader.readAsDataURL(fileResult.file)
      reader.onload = (e) => {
        this.$request({
          url: fileResult.action,
          data: {
            base64: e.target.result.split(',')[1],
            fileType: fileResult.file.type,
            title: fileResult.file.name,
            fullLink: true
          },
          onUploadProgress: event => {
            event.percent = event.loaded / event.total * 100
            fileResult.onProgress(event)
          }
        }).then(data => {
          fileResult.file.pictureKey = data.result
          fileResult.onSuccess()
        }).catch(() => {
          fileResult.onError()
        })
      }
    },
    uploadRequestFile(fileResult) {
      // 利用html5的fileReader函数监听 获取图片的base_64
      const reader = new FileReader()
      reader.readAsDataURL(fileResult.file)
      reader.onload = (e) => {
        this.$request({
          url: fileResult.action,
          data: {
            base64: e.target.result.split(',')[1],
            fileType: fileResult.file.type,
            title: fileResult.file.name,
            fullLink: true,
            dir: 'contract-template'
          },
          onUploadProgress: event => {
            event.percent = event.loaded / event.total * 100
            fileResult.onProgress(event)
          }
        }).then(data => {
          fileResult.file.link = data.result
          fileResult.onSuccess()
        }).catch(() => {
          fileResult.onError()
        })
      }
    },
    // 根据简化序列号获取字典对象
    getDicObjBySimplify(simplify) {
      const disList = auth.getDicList()
      let obj = null
      disList.forEach(i => {
        if (i.simplify === simplify) {
          obj = i
        }
      })
      return obj
    },
    // 根据字典ID获取字典对象
    getDicObjById(id) {
      const disList = auth.getDicList()
      let obj = null
      disList.forEach(i => {
        if (i.Id === id) {
          obj = i
        }
      })
      return obj
    },
    // 根据字典ID获取字典描述
    getDicTitleById(id) {
      return this.getDicObjById(id) && this.getDicObjById(id).title
    },
    // 根据字典ID获取简化序列号
    getDicSimplifyById(id) {
      return this.getDicObjById(id) && this.getDicObjById(id).simplify
    },
    // 根据简化序列号获取字典ID
    getDicIdBySimplify(simplify) {
      return this.getDicObjBySimplify(simplify) && this.getDicObjBySimplify(simplify).Id
    },
    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this[formName] = {}
    },
    // 加法 精度运算
    numAdd() {
      let som = 0
      for (let index = 0; index < arguments.length; index++) {
        arguments[index] = arguments[index] || 0
        som = new Decimal(arguments[index]).add(new Decimal(som)).toNumber()
      }
      return som
    },
    // 转时间戳为时间格式
    getTime(time, cFormat) {
      return !time ? '---' : parseTime(time, cFormat)
    },
    /**
     * 金额格式化
     * 格式化后默认保留两位小数
     * @param {*} number
     * @param {*} toNoBoth 是否不保留两位小数
     * @returns
     */
    numberFormat(number, toNoBoth) {
      if (!number) {
        return !toNoBoth ? '0.00' : '0'
      }
      // 转浮点数
      if (isString(number)) {
        number = parseFloat(number)
      }
      // 格式化
      let str = number.toLocaleString('en-US')
      // 是否保留两位小数
      if (!toNoBoth) {
        const subStr = str.split('.')
        if (subStr && subStr.length === 1) {
          str = `${str}.00`
        } else if (subStr && subStr.length > 1) {
          const _str = subStr[1]
          _str.length === 1 && (str = `${str}0`)
        }
      }
      return str
    },
    /**
     * 对象取值 基础方法 不对外调用
     * @param {*} obj
     * @param {*} str
     */
    _getObjValBase(obj, str, objV) {
      if (isNullOrUndefined(obj) || isNullOrUndefined(str)) {
        return
      }
      const realKeys = str.split('_')
      let count = realKeys.length
      for (let index = 0; index < realKeys.length; index++) {
        count--
        if (count === 0) {
          objV['val'] = obj[realKeys[index]]
        } else {
          if (!isNullOrUndefined(obj[realKeys[index]])) {
            this._getObjValBase(obj[realKeys[index]], str.substr(str.indexOf('_') + 1, str.length), objV)
          }
          break
        }
      }
    },
    /**
     * 对象取值自动判断空指针带数据格式转换 对外方法
     * @param {*} obj 数据源 对象
     * @param {*} str 参数层级 e.g.: user_info_amount
     * @param {*} type 转换类型或者自定义默认值
     * nf/nf_t(numberFormat)金额格式化(nf: 只格式化/nf_t: 格式化并保留两位小数)
     * t_y|t_s时间格式化(_y: yyyy-MM-dd/_s: yyyy-MM-dd hh:mm:ss)
     * 如果type不给默认返回空字符串 如果给的值为nf/t_y/t_s则自动匹配类型 如果给其他值则为自定义默认值 e.g.:'---'
     */
    getObjVal(obj, str, type) {
      const objV = {}
      this._getObjValBase(obj, str, objV)
      let val = objV.val
      switch (type) {
        case 'nf':
          val = this.numberFormat(val)
          break
        case 'nf_t':
          val = this.numberFormat(val, true)
          break
        case 't_y':
          val = this.getTime(val, '{y}-{m}-{d}')
          break
        case 't_s':
          val = this.getTime(val, '{y}-{m}-{d} {h}:{i}:{s}')
          break
        default:
          val = val || type || ''
          break
      }
      return val
    },
    // 随机ID
    createRandomId() {
      return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5)
    },
    // 双击选中table row
    pitchRow(row, event) {
      this.$refs['table'].toggleRowSelection(row)
    },
    // JSON转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j] || ''
        }
      }))
    },
    // 数据导出源数据请求方法
    getExportData({
      searchData = null,
      action = {},
      total = 0
    }) {
      // if (total > 20000) {
      //   this.$message.error('数据量不能超过两万')
      //   return
      // }
      // 获取搜索的所有数据
      let progress = 0
      const interId = setInterval(() => {
        progress++
        this.$store.dispatch('setDownProgress', progress)
      }, 1000)
      return this.$request({
        timeout: 5000 * 1000 * 60,
        url: action.apiUrl,
        data: searchData,
        onDownloadProgress: (a) => {
          window.clearInterval(interId)
          progress = parseInt(parseFloat(a.loaded / (total / 10000 * 10918359) * 100).toFixed(0))
          this.$store.dispatch('setDownProgress', progress || 0)
        }
      })
    },
    // 数据导出excel
    exportExcel({
      title = '表格',
      header_key = [],
      header_value = [],
      data = [],
      num = 1,
      total = 1
    }) {
      this.$message.success(`共${total}份文件，正在导出第${num + 1}份文件，请稍后!导出完成前请不要切换页面否则将取消导出。`)
      import('@/vendor/Export2Excel').then(excel => {
        const exportData = this.formatJson(header_value, data)
        excel.export_json_to_excel({
          header: header_key,
          data: exportData,
          filename: title,
          autoWidth: true
        })
      }).catch((e) => {
        this.$message.error(`导出出错:${e}`)
      })
      this.$store.dispatch('setDownProgress', 100)
    },
    downloadURI(uri, name) {
      var link = document.createElement('a')
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 时间差计算
    /* *
     * startDate==>开始时间
     * endDate==>结束时间
     * 事例：diffTime(data.createTime,new Date())
     * */
    diffTime(startDate, endDate) {
      if (!startDate || !endDate) {
        return null
      }
      var diff = endDate - startDate // .getTime();// 时间差的毫秒数

      // 计算出相差天数
      var days = Math.floor(diff / (24 * 3600 * 1000))

      // //计算出小时数
      // var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      // var hours = Math.floor(leave1 / (3600 * 1000));
      // //计算相差分钟数
      // var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      // var minutes = Math.floor(leave2 / (60 * 1000));

      // //计算相差秒数
      // var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      // var seconds = Math.round(leave3 / 1000);

      // var returnStr = seconds + "秒前";
      // if (minutes > 0) {
      //   returnStr = minutes + "分钟前"; //+ returnStr;
      // }
      // if (hours > 0) {
      //   returnStr = hours + "小时前"; // + returnStr;
      // }
      // if (days > 0) {
      //   returnStr = days + "天前"; //+ returnStr;
      // }
      return days
    }
  }
}
