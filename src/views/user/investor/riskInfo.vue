<template>
  <div class="post-container">
    <div class="post-main-container">
      <el-tag style="width:100%;">当前用户: {{$route.query.name}}</el-tag>
      <TableListHeader @updateData="getList()" @topAction="top_execute" v-if="currentMenuTopRunFuncList && currentMenuTopRunFuncList.length > 0"  v-model="searchForm" :searchItems="searchItems" @change="getList()">

      </TableListHeader>

      <!-- table list -->
      <el-table stripe @row-dblclick="pitchRow" ref="table" :data="table.list" border style="width: 100%;margin-top:5px;" v-loading="table.loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="是否当前">
          <template slot-scope="scope">
            <span>{{scope.row.current ? '当前' : '历史'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级">
          <template slot-scope="scope">
            {{getDicTitleById(scope.row.riskLevel)}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="测评时间">
        </el-table-column>
        <el-table-column v-if="currentMenuRightRunFuncList.length > 0" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-for="action in currentMenuRightRunFuncList" :key="action.Id" @click="right_execute(action, scope.row)">{{action.name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageForm.num" :page-sizes="[5,10,15,20]" :page-size="pageForm.size" layout="total, sizes, prev, pager, next, jumper" :total="pageForm.total">
        </el-pagination>
      </div>

      <!-- dialog -->
      <el-dialog :close-on-click-modal="false" v-el-drag-dialog :title="dialogTitle" :visible.sync="dialogBaseStatus">
        <div class="content">
          <template v-if="infoList && infoList.length > 0">
            <div class="item" v-for="item in infoList" :key="item.Id">
              <div class="question">
                <span>{{item.subjectContent}}</span>
              </div>
              <div class="answer">
                <span>{{item.answerContent}} ({{item.score}} 分)</span>
              </div>
            </div>
          </template>
          <template v-else>
            <span>暂无数据</span>
          </template>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    _func
  } from '@/business/baseFunc'

  export default {
    data() {
      return {
        table: {
          list: [],
          loading: false,
          tableChangeList: []
        },
        pageForm: {
          total: 0,
          num: 1,
          size: 10
        },
        dialogBaseStatus: false,
        currentDialogUrl: '', // 当前弹窗的请求URL
        dialogTitle: '', // 当前弹窗标题
        searchForm: {},
        searchItems: [{
          para: 'riskLevel',
          text: '等级',
          type: 'sys_enum',
          details: {
            type: 'typeEnum',
            path: 'platform_risk_level'
          }
        }, {
          para: 'time',
          text: '开始时间|结束时间',
          type: 'times',
          details: {
            type: 'daterange',
            parse: ['startTime', 'endTime']
          }
        }],
        tableListQuery: {
          dataId: this.$route.query.id
        },
        infoList: []
      }
    },
    created() {
      this.getList()
    },
    computed: {
      ...mapGetters([
        'currentMenuTopRunFuncList',
        'currentMenuRightRunFuncList',
        'currentMenuHiddenRunFuncList'
      ])
    },
    methods: Object.assign(_func(), {
      // 弹窗事件
      func_dialog(action, row) {
        // 根据弹窗类型打开
        switch (action.routeUrl) {
          case 'dialogInfo':
            if (row.length !== 1) {
              this.$message.info('请选择一条数据')
            } else {
              // 获取已有的数据
              this.$request({
                url: action.apiUrl,
                data: row[0].Id
              }).then(data => {
                this.infoList = data.result
                this.dialogTitle = '测评详情'
                this.dialogBaseStatus = true
              })
            }
            break

          default:
            break
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    line-height: 1.5em;

    .item {
      margin: 0 8px 8px 0;

      .question {
        color: blue;
      }

      .answer {
        color: red;
        padding-left: 1em;
      }
    }
  }
</style>
