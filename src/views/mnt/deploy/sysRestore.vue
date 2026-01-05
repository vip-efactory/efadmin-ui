<template>
  <el-dialog v-model="dialog" append-to-body :close-on-click-modal="false" title="系统还原" width="800px">
    <!--工具栏-->
    <div class="head-container">
      <el-date-picker
        v-model="crud.query.createTime"
        type="daterange"
        range-separator=":"
        size="small"
        class="date-item"
        value-format="YYYY-MM-DD HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button class="filter-item" size="small" type="success" icon="Search" @click="toQuery">搜索</el-button>
    </div>
    <el-form size="small" label-width="80px">
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" style="width: 100%" @row-click="showRow">
        <el-table-column width="30px">
          <template #default="scope">
            <el-radio v-model="radio" :label="scope.$index" />
          </template>
        </el-table-column>
        <el-table-column prop="appName" label="应用名称" />
        <el-table-column prop="ip" label="部署IP" />
        <el-table-column prop="deployDate" label="部署时间">
          <template #default="scope">
            <span>{{ parseTime(scope.row.deployDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deployUser" label="部署人员" />
      </el-table>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button v-permission="['admin','deploy:add']" :loading="submitLoading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </template>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud'
import { reducte } from '@/api/mnt/deployHistory'
export default {
  mixins: [crud],
  props: {
    appName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submitLoading: false,
      dialog: false,
      history: [],
      radio: '',
      appNames: '',
      selectIndex: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    beforeInit() {
      this.url = 'api/deployHistory'
      this.deployId = this.$parent.deployId
      if (this.deployId === '') {
        return false
      }
      this.sort = 'deployDate,desc'
      this.params['deployId'] = this.deployId
      return true
    },
    showRow(row) {
      this.radio = this.data.indexOf(row)
      this.selectIndex = row.id
    },
    cancel() {
      this.dialog = false
      this.submitLoading = false
    },
    doSubmit() {
      if (this.selectIndex === '') {
        this.$message.error('请选择要还原的备份')
      } else {
        this.submitLoading = true
        reducte(JSON.stringify(this.data[this.radio]))
          .then(res => {
            if (res.code === 0) {
              this.dialog = false
              this.submitLoading = false
              this.appNames = ''
              this.$parent.crud.toQuery()
            } else {
              this.submitLoading = false
              this.$notify.error({ message: res.msg })
            }
          })
          .catch(err => {
            this.submitLoading = false
            console.log('error:' + err.response.data.message)
          })
      }
    }
  }
}
</script>

<style scoped>
</style>
