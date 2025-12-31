<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud && crud.props && crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="crud.query.blurry"
          clearable
          :placeholder="$t('deployHistory.searchPlaceholder')"
          style="width: 200px"
          class="filter-item"
          @keyup.enter="crud.toQuery"
        />
        <el-date-picker
          v-model="query.deployDate"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: 240px"
          :start-placeholder="$t('common.startDate')"
          :end-placeholder="$t('common.endDate')"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud?.loading"
      :data="crud?.data || []"
      style="width: 100%"
      @selection-change="crud?.selectionChangeHandler"
      @sort-change="crud?.doTitleOrder"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('appName')" prop="appName" :label="$t('deployHistory.appName')" sortable="custom" />
      <el-table-column v-if="columns.visible('ip')" prop="ip" :label="$t('deployHistory.ip')" sortable="custom" />
      <el-table-column v-if="columns.visible('deployUser')" prop="deployUser" :label="$t('deployHistory.deployUser')" sortable="custom" />
      <el-table-column v-if="columns.visible('deployDate')" prop="deployDate" :label="$t('deployHistory.deployDate')" sortable="custom">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deployDate) }}</span>
        </template>
      </el-table-column>

      <el-table-column v-permission="['admin','deployHistory:del']" :label="$t('be.operate')" width="100px" align="center">
        <template #default="scope">
          <el-popover
            :ref="'popover-' + scope.row.id"
            v-permission="['admin','deployHistory:del']"
            placement="top"
            width="180"
            trigger="click"
          >
            <p>{{ $t('crud.deleteTips') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" text @click="$refs['popover-' + scope.row.id].hide()">
                {{ $t('crud.cancel') }}
              </el-button>
              <el-button :loading="delLoading" type="primary" size="small" @click="delMethod(scope.row.id)">
                {{ $t('crud.confirm') }}
              </el-button>
            </div>

            <!-- Element Plus：reference 插槽 + 组件图标 -->
            <template #reference>
              <el-button type="danger" :icon="Delete" size="small" />
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { del } from '@/api/mnt/deployHistory'
import CRUD, { presenter, header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'
import { Delete } from '@element-plus/icons-vue' // 引入图标组件

// crud交由presenter持有
const adSearchFields = [
  { fieldName: 'appName', labelName: i18n.global.t('deployHistory.appName') },
  { fieldName: 'ip', labelName: i18n.global.t('deployHistory.ip') },
  { fieldName: 'deployUser', labelName: i18n.global.t('deployHistory.deployUser') },
  { fieldName: 'deployDate', labelName: i18n.global.t('deployHistory.deployDate'), type: 'datetime' }
]
const defaultCrud = CRUD({
  title: i18n.global.t('deployHistory.TITLE'),
  url: 'api/deployHistory/page',
  exportUrl: 'api/deployHistory/download',
  crudMethod: { del },
  adSearchFields
})

export default {
  name: 'DeployHistory',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header()],
  data() {
    return {
      delLoading: false,
      permission: {
        del: ['admin', 'deployHistory:del']
      },
      Delete // 供模板使用
    }
  },
  created() {
    if (this.crud) {
      this.crud.optShow = {
        add: false,
        edit: false,
        del: true,
        download: true
      }
    }
  },
  methods: {
    delMethod(id) {
      this.delLoading = true
      del([id])
        .then(r => {
          if (r.code === 0) {
            this.delLoading = false
            this.$refs['popover-' + id]?.hide()
            this.crud.dleChangePage(1)
            this.crud.delSuccessNotify()
            this.crud.toQuery()
          } else {
            this.delLoading = false
            this.crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
          }
        })
        .catch(() => {
          this.delLoading = false
          this.$refs['popover-' + id]?.hide()
        })
    }
  }
}
</script>

<style scoped>
</style>
