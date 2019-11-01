<template>
  <div class="app-container">
    <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"></upload-excel-component>
    <el-card style="margin-top:3px;">
      <div slot="header">
        <span style="color:#F16E72;font-size:14px;">{{type === 'enterprise' ? '只能上传企业模板' : '只能上传个人模板'}}</span>
      </div>
      <div class="text item">
        <el-table stripe @row-dblclick="pitchRow" ref="table" :data="tableData" height="500" border highlight-current-row style="width: 100%;margin-bottom:2px;">
          <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item'>
          </el-table-column>
        </el-table>
        <el-row justify="center" type="flex">
          <el-col :span="12">
            <el-button style="float: right;width:100%;" size="mini" type="primary" @click="sub">提交开户</el-button>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
  import UploadExcelComponent from '@/components/UploadExcel/index.vue'

  export default {
    name: 'uploadExcel',
    components: {
      UploadExcelComponent
    },
    data() {
      return {
        tableData: [],
        tableHeader: [],
        type: this.$route.meta.type
      }
    },
    methods: {
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1

        if (isLt1M) {
          return true
        }

        this.$message({
          message: 'Please do not upload files larger than 1m in size.',
          type: 'warning'
        })
        return false
      },
      handleSuccess({
        results,
        header
      }) {
        this.tableData = results
        this.tableHeader = header
        console.log('con', results)
        console.log('hea', header)
      },
      sub() {
        this.$request({
          url: '/v1/fin/openAcc/batchOpenPerson',
          data: this.tableData
        }).then(data => {
          if (data.result) {
            this.tableData = data.result
            data.result.map(item => {
              this.tableHeader = Object.keys(item)
            })
          }
        })
      }
    }
  }
</script>
