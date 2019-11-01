<template>
  <div class="dashboard-editor-container">
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group> -->
    <el-row>
      <el-col :span="24" style="margin-bottom:30px;">
        <todo-list></todo-list>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import TodoList from './components/TodoList'
import PanelGroup from './components/PanelGroup'

export default {
  name: 'dashboard-admin',
  components: {
    TodoList,
    PanelGroup
  },
  methods: {
    handleSetLineChartData(){

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  height: calc(100vh - 84px);
  background-color: #FAFBFA;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border: 1px solid;
  }
}
</style>
