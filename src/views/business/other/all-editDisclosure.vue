<template>
  <div class="post-container" style="margin-bottom: 100px;">
    <sticky class-name="sub-navbar published" :zIndex="999">
      <el-button :type="action.cssClass" v-for="action in currentMenuTopRunFuncList" :key="action.Id" @click="top_execute(action)">{{action.name}}
      </el-button>
    </sticky>
    <div class="post-main-container">
      <!-- 表单 -->
      <el-form :model="baseForm" :hide-required-asterisk="false" ref="baseForm" status-icon :rules="rules" :inline="true" size="mini" label-width="100px">
        <section class="info_action">
          <el-button round type="primary" size="mini" @click="addGroup('text')">新增文字组别</el-button>
          <el-button round type="success" size="mini" @click="addGroup('img')">新增图片组别</el-button>
          <el-button round type="warning" size="mini" @click="addGroup('text_img')">新增图文组别</el-button>
        </section>
        <section :id="`section-${index}`" v-for="(section, index) in this.baseForm.discloseGroupList" :key="index" class="info_section shadow" :style="section.showType === 'text' ? 'border-top: 2px solid #1D93F5;' : (section.showType === 'img' ? 'border-top: 2px solid #5CBA33;' : 'border-top: 2px solid #E29735;')">
          <el-row type="flex" align="middle" justify="center">
            <el-col :span="1">
              <div @click="addItem(index)">
                <svg-icon icon-class="add" className="icon_class add" />
              </div>
              <div @click="delGroup(index)">
                <svg-icon icon-class="delete" className="icon_class del" />
              </div>
              <div :id="`section-up-${index}`" @click="foldUp(index)">
                <svg-icon icon-class="up" className="icon_class up" />
              </div>
              <div :id="`section-down-${index}`" style="display: none" @click="foldDown(index)">
                <svg-icon icon-class="down" className="icon_class up" />
              </div>
            </el-col>
            <el-col :span="23">
              <el-row>
                <el-col :span="24">
                  <el-input placeholder="请输入组别名称" v-model="section.name" size="mini">
                    <template slot="prepend">
                      <svg-icon icon-class="gather"></svg-icon>
                    </template>
                  </el-input>
                </el-col>
              </el-row>
              <div class="group_item" v-for="(item, indexItem) in section.itemList" :key="indexItem">
                <el-row type="flex" justify="space-between">
                  <el-col :span="8">
                    <el-input placeholder="请输入标题" v-model="item.title" size="mini">
                      <template slot="prepend">
                        <svg-icon icon-class="list"></svg-icon>
                      </template>
                    </el-input>
                  </el-col>
                  <div class="" style="display: flex;">
                    <!-- <div v-if="item.Id" @click="recoverItem(index, indexItem, item)" style="margin-right:10px;">
                      <svg-icon icon-class="recover" className="icon_class add" />
                    </div> -->
                    <div @click="delItem(index, indexItem)">
                      <svg-icon icon-class="delete" className="icon_class del" />
                    </div>
                  </div>
                </el-row>
                <el-row v-if="section.showType && (section.showType === 'text' || section.showType === 'text_img')">
                  <el-col :span="24">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="item.content">
                    </el-input>
                  </el-col>
                </el-row>
                <el-row v-if="section.showType && (section.showType === 'img' || section.showType === 'text_img')" style="margin-top:1px;">
                  <el-col :span="24">
                    <Upload5 v-model="item.imgLinkList"></Upload5>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </section>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import Mallki from '@/components/TextHoverEffect/Mallki'
  import {
    _func
  } from '@/business/baseFunc'
  import Tinymce from '@/components/Tinymce'
  import Sticky from '@/components/Sticky' // 粘性header组件
  import MDinput from '@/components/MDinput'
  import {
    baseFormRules
  } from '@/business/rules'
  export default {
    components: {
      Mallki,
      Tinymce,
      Sticky,
      MDinput
    },
    created() {
      // 获取标的详情
      this.$request({
        url: this.currentMenuHiddenRunFuncList['O_BASE_INFO'],
        data: this.$route.query.id
      }).then(data => {
        this.baseForm.discloseGroupList = data.result
      })
    },
    data() {
      return {
        rules: baseFormRules.bidRules,
        baseForm: {
          discloseGroupList: []
        },
        borrowerList: [], // 借款人查询列表
        providerList: [], // 助贷机构查询列表
        factoringList: [], // 保理机构查询列表
        tipText: '', // 借款人详细信息提示
        selectLoading: false,
        tabsName: 'baseInfo', // 当前选项卡
        disablePeriods: false, // 期数框状态
        disableInterestType: false, // 计息框状态
        disabledCount: false, // 期限框状态
        productTypeAttachInfo: {}, // 披露信息
        productTypeAttachInfoByRecover: [], // 已选择的披露信息 用于复原
        borrowerSearchType: '1',
        showBorrowerSearchType: false
      }
    },
    computed: {
      ...mapGetters([
        'baseRunFuncList',
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ]),
      uploadUrl() {
        return this.baseRunFuncList['O_UPLOAD_IMG']
      },
      typeEnumUrl() {
        return this.baseRunFuncList['O_TYPE_ENUM_LIST']
      },
      // 标的金额显示的格式化
      showFormatMoney() {
        return `${this.baseForm.money/10000 || 0} 万`
      }
    },
    methods: Object.assign(_func(), {
      // 产品录入提交
      func_execute(action) {
        this.$refs['baseForm'].validate((valid) => {
          if (valid) {
            this.$request({
              url: action.apiUrl,
              data: {
                bidId: this.$route.query.id,
                discloseGroupList: this.baseForm.discloseGroupList
              }
            }).then(data => {
              this.$message.success(data.result?'修改成功':'修改失败')
              if (data.result) {
                this.$router.go(-1)
              }

            })
          }
        })
      },
      winScroll(e) {
        let element = document.getElementById('custom_tabs')
        let tabsViewTop = this.getElementViewTop(element.childNodes[0])
        if (tabsViewTop < 75) {
          element.className = 'sticky'
        } else {
          element.className = 'el-tabs el-tabs--top'
          // element.className = element.className.replace(new RegExp("(\\s|^)" + 'sticky' + "(\\s|$)"), " ")
        }
      },
      // 获取元素的相对顶部高度
      getElementViewTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
          actualTop += current.offsetTop;
          current = current.offsetParent;
        }

        if (document.compatMode == "BackCompat") {
          var elementScrollTop = document.body.scrollTop;
        } else {
          var elementScrollTop = document.documentElement.scrollTop;
        }

        return actualTop - elementScrollTop;
      },
      // 新增组别
      addGroup(e) {
        this.baseForm.discloseGroupList.push({
          name: '',
          sort: this.baseForm.discloseGroupList.length + 1,
          itemList: [{
            title: '',
            content: '',
            imgLinkList: [],
            sort: '1'
          }],
          showType: e
        })
        this.$message.success('组别新增成功')
      },
      // 删除组别
      delGroup(e) {
        this.$confirm('此操作将删除该组别, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.baseForm.discloseGroupList.splice(e, 1)
        })
      },
      // 新增子集
      addItem(e) {
        this.baseForm.discloseGroupList[e].itemList.push({
          title: '',
          content: '',
          imgLinkList: [],
          sort: this.baseForm.discloseGroupList[e].itemList.length + 1
        })
        this.$message.success('子集新增成功')
      },
      // 删除子集
      delItem(ge, ie) {
        this.$confirm('此操作将删除该子集, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.baseForm.discloseGroupList[ge].itemList.splice(ie, 1)
        })
      },
      // 恢复子集
      recoverItem(ge, ie, item) {
        this.$confirm('此操作将把内容替换为模板内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = null
          // 匹配模板内容
          let children = []
          this.productTypeAttachInfoByRecover.map(i => {
            if (i.children) {
              children.push(...i.children)
            }
          })
          let template = children.filter(i => i.Id === item.typeId)
          if (template && template.length > 0) {
            let item = this.baseForm.discloseGroupList[ge].itemList[ie]
            item.title = template[0].title
            item.content = template[0].remark
          } else {
            this.$message.info('没有找到恢复数据，请联系管理员，或者自行填入')
          }
        })
      },
      foldUp(index) {
        const element = document.getElementById(`section-${index}`)
        if (element.className === 'info_section shadow') {
          element.className = 'info_section shadow fold'
        } else {
          element.className = 'info_section shadow'
        }
        document.getElementById(`section-up-${index}`).style.display = 'none'
        document.getElementById(`section-down-${index}`).style.display = 'block'
      },
      foldDown(index) {
        const element = document.getElementById(`section-${index}`)
        if (element.className === 'info_section shadow') {
          element.className = 'info_section shadow fold'
        } else {
          element.className = 'info_section shadow'
        }
        document.getElementById(`section-up-${index}`).style.display = 'block'
        document.getElementById(`section-down-${index}`).style.display = 'none'
      },
      seriesTypeChange(e) {
        const oldValue = this.baseForm.seriesType
        if (!oldValue) {
          // 首次选择 直接构造模板
          this.constructionSeriesTemplate(e).then(() => {}).catch(() => {
            this.baseForm.seriesType = oldValue
          })
        }
        if (oldValue && oldValue !== e) {
          this.$confirm('此操作将替换信息披露模板并且更改你所填写的模板内容, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (e) {
              this.constructionSeriesTemplate(e).then(() => {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              }).catch(() => {
                this.baseForm.seriesType = oldValue
              })
            } else {
              this.baseForm.discloseGroupList = []
              this.baseForm.extendList = []
            }
          }).catch(() => {
            this.baseForm.seriesType = oldValue
            this.$message({
              type: 'info',
              message: '已取消'
            });
          })
        }
      },
      // 构造信息披露模板
      async constructionSeriesTemplate(seriesType) {
        // 获取信息披露模板
        await this.getSeriesTemplate(seriesType).then(data => {
          if (data.length === 0) {
            return
          }
          // 获取模板key
          this.getSeriesTemplateKey(seriesType).then(data => {
            this.baseForm.extendList = []
            if (data.result) {
              // 获取显示key
              data.result.map(i => {
                i.isShow && this.baseForm.extendList.push({
                  key: i.replaceKey,
                  keyId: i.Id,
                  title: i.title,
                  replaceTxt: '',
                })
              })
            }
          })
          // 构造披露模板
          this.baseForm.discloseGroupList = []
          data.map((i, index) => {
            this.baseForm.discloseGroupList.push({
              id: i.Id,
              name: i.title,
              sort: i.sort || '1',
              itemList: [],
              showType: i.extend
            })
            if (i.children && i.children.length > 0) {
              i.children.map(j => {
                this.baseForm.discloseGroupList[index].itemList.push({
                  groupId: i.Id,
                  title: j.title,
                  content: j.remark,
                  imgLinkList: [],
                  sort: j.sort || '1'
                })
              })
            }
          })
        })
      },
      // 获取信息披露模板
      getSeriesTemplate(seriesType) {
        return this.getTypeEnum(this.typeEnumUrl, 'bid_template_info', seriesType)
      },
      // 获取信息披露模板key
      getSeriesTemplateKey(seriesType) {
        return this.$request({
          url: this.currentMenuHiddenRunFuncList['O_TEMPLATE_KEY'],
          data: seriesType
        })
      }
    })
  }
</script>

<style lang="scss" scoped>
  .title {
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    color: #2273FF;
    font-weight: 400;
    font-size: 16px;
  }

  .tipText {
    color: rgb(241, 46, 12);
    margin-left: 5px;
    font-size: 14px;
  }

  .icon_class {
    width: 1.5em;
    height: 1.5em;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .icon_class.add {
    fill: #87CC67;
  }

  .icon_class.del {
    fill: #F36D6F;
  }

  .icon_class.up {
    position: absolute;
    top: 10px;
    left: 5px;
  }

  .info_section {
    border: 1px solid #E0E3EA;
    border-top: 2px solid #1D93F5;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 8px;
    position: relative;
    max-height: 2000px;
    transition: all .5s ease;
    opacity: 1;
  }

  .info_section.fold {
    max-height: 70px;
    overflow: hidden;
    opacity: .4;
  }

  .group_item {
    border: 1px solid #E0E3EA;
    border-top: 2px solid #909399;
    border-radius: 5px;
    margin: 5px 0;
    padding: 5px 5px 15px 25px;
  }

  .info_action {
    margin-bottom: 5px;
  }

  /deep/.el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: none;
  }

  /deep/.custom {
    input {
      &::placeholder {
        color: #606266;
      }
    }
  }

  .searchItem {
    position: relative;

    .searchBox {
      position: absolute;
      top: -50px;
      left: 0;
      width: 400px;
      display: flex;
      flex-direction: column;

      span {
        font-size: 12px;
        color: red;
      }
    }
  }
</style>
