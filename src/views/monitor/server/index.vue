<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" :placeholder="$t('server.simpleSearchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="520px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item :label="$t('server.name')" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item :label="$t('server.address')" prop="address">
          <el-input v-model="form.address" style="width: 370px;" />
        </el-form-item>
        <el-form-item :label="$t('server.port')" prop="port">
          <el-input-number v-model.number="form.port" />
        </el-form-item>
        <el-form-item :label="$t('server.sort')" prop="sort">
          <el-input-number v-model.number="form.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="45" />
      <el-table-column v-if="columns.visible('state')" prop="state" :label="$t('server.state')" width="90px" sortable="custom">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.state === '1' ? 'success' : 'info'"
            disable-transitions
          >
            <i v-if="scope.row.state === '1'" class="el-icon-success" />
            <i v-if="scope.row.state === '0'" class="el-icon-error" />
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('name')" prop="name" :label="$t('server.name')" sortable="custom" />
      <el-table-column v-if="columns.visible('address')" prop="address" :label="$t('server.address')" sortable="custom" />
      <el-table-column v-if="columns.visible('port')" prop="port" :label="$t('server.port')" width="100px" align="center" sortable="custom" />
      <el-table-column v-if="columns.visible('cpuRate')" :formatter="formatCpuRate" prop="cpuRate" :label="$t('server.cpuRate')" width="120px" align="center" sortable="custom" />
      <el-table-column v-if="columns.visible('cpuCore')" prop="cpuCore" :label="$t('server.cpuCore')" width="120px" align="center" sortable="custom" />
      <el-table-column v-if="columns.visible('memTotal')" prop="memTotal" :label="$t('server.memTotal')" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatMem(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.memUsed,scope.row.memTotal)" :status="percentStatus(scope.row.memUsed,scope.row.memTotal)" :show-text="false" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('diskTotal')" prop="diskTotal" :formatter="formatDisk" :label="$t('server.diskTotal')" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatDisk(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.diskUsed,scope.row.diskTotal)" :status="percentStatus(scope.row.diskUsed,scope.row.diskTotal)" :show-text="false" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('swapTotal')" prop="swapTotal" :label="$t('server.swapTotal')" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24">{{ formatSwap(scope.row) }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-progress :percentage="percentNumber(scope.row.swapUsed,scope.row.swapTotal)" :status="percentStatus(scope.row.swapUsed,scope.row.swapTotal)" :show-text="false" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','server:edit','server:del']" :label="$t('be.operate')" width="150px" align="center">
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template> v-if="columns.visible('name')"
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudServer from '@/api/monitor/server'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('server.name')], ['address', i18n.t('server.address')], ['port', i18n.t('server.port')], ['state', i18n.t('server.state')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('server.TITLE'), url: 'api/server/page', sort: 'sort,asc', crudMethod: { ...crudServer }, adSearchFields: adSearchFields })
const defaultForm = { id: null, address: 'localhost', name: null, ip: null, port: 8777, state: null, cpuRate: null, cpuCore: null, memTotal: null, memUsed: null, diskTotal: null, diskUsed: null, swapTotal: null, swapUsed: null, sort: 999 }
export default {
  name: 'ServerMonitor',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'server:add'],
        edit: ['admin', 'server:edit'],
        del: ['admin', 'server:del']
      },
      rules: {
        name: [
          { required: true, message: i18n.t('server.nameRequired'), trigger: 'blur' }
        ],
        address: [
          { required: true, message: i18n.t('server.addressRequired'), trigger: 'blur' }
        ],
        port: [
          { required: true, message: i18n.t('server.portRequired'), trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  created() {
    this.crud.optShow.download = false
  },
  methods: {
    formatCpuRate(row, column) {
      const value = row.cpuRate
      if (!value) {
        return 0
      }
      return (Math.floor(value * 10000) / 100) + '%'
    },
    percentNumber(value, total) {
      if (!value || !total) {
        return 0
      }
      return value / total * 100
    },
    percentStatus(value, total) {
      const percent = this.percentNumber(value, total)
      if (percent < 60) {
        return 'success'
      } else if (percent < 90) {
        return 'warning'
      } else {
        return 'exception'
      }
    },
    convertToGb(num) {
      if (!num) {
        return '-'
      }
      let unit = 'G'
      if (num > 1024) {
        num = num / 1024
        unit = 'T'
      }
      num = Math.floor(num * 100) / 100
      return num + unit
    },
    formatMem(row, column) {
      return this.convertToGb(row.memUsed) + ' / ' + this.convertToGb(row.memTotal)
    },
    formatDisk(row, column) {
      return this.convertToGb(row.diskUsed) + ' / ' + this.convertToGb(row.diskTotal)
    },
    formatSwap(row, column) {
      return this.convertToGb(row.swapUsed) + ' / ' + this.convertToGb(row.swapTotal)
    }
  }
}
</script>

<style scoped>
  .el-col {
    text-align: center;
  }
</style>
