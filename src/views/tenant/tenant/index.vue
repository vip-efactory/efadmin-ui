<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item :label="$t('tenant.tenantName')" prop="tenantName">
            <el-input v-model="form.tenantName" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('tenant.tenantCode')">
            <el-input v-model="form.tenantCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('tenant.dbUsername')" prop="dbUsername">
            <el-input v-model="form.dbUsername" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('tenant.dbPassword')" prop="dbPassword">
            <el-input v-model="form.dbPassword" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('tenant.driverClassName')" prop="driverClassName">
            <el-input v-model="form.driverClassName" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('tenant.jdbcUrl')" prop="jdbcUrl">
            <el-input v-model="form.jdbcUrl" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('tenant.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="item in dict.tenant_status"
                :key="item.id"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('be.remark')">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('tenantName')" prop="tenantName" :label="$t('tenant.tenantName')" sortable="custom" />
        <el-table-column v-if="columns.visible('tenantCode')" prop="tenantCode" :label="$t('tenant.tenantCode')" sortable="custom" />
        <el-table-column v-if="columns.visible('dbUsername')" prop="dbUsername" :label="$t('tenant.dbUsername')" sortable="custom" />
        <!--<el-table-column v-if="columns.visible('dbPassword')" prop="dbPassword" :label="$t('tenant.dbPassword')" sortable="custom" />-->
        <el-table-column v-if="columns.visible('driverClassName')" :show-overflow-tooltip="true" prop="driverClassName" :label="$t('tenant.driverClassName')" sortable="custom" />
        <el-table-column v-if="columns.visible('jdbcUrl')" :show-overflow-tooltip="true" prop="jdbcUrl" :label="$t('tenant.jdbcUrl')" sortable="custom" />
        <el-table-column v-if="columns.visible('status')" prop="status" :label="$t('tenant.status')" sortable="custom">
          <template slot-scope="scope">
            {{ dict.label.tenant_status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('remark')" prop="remark" :label="$t('be.remark')" sortable="custom" />
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('creatorNum')" prop="creatorNum" :label="$t('be.creatorNum')" sortable="custom" />
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" :label="$t('be.updateTime')" sortable="custom">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updaterNum')" prop="updaterNum" :label="$t('be.updaterNum')" sortable="custom" />
        <el-table-column v-permission="['admin','tenant:edit','tenant:del']" :label="$t('be.operate')" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudTenant from '@/api/tenant/tenant'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['remark', i18n.t('be.remark')], ['createTime', i18n.t('be.createTime')], ['updateTime', i18n.t('be.updateTime')], ['creatorNum', i18n.t('be.creatorNum')], ['updaterNum', i18n.t('be.updaterNum')]]) // 需要高级搜索的字段，此处只是通用的字段，实体自己的需要手动添加！
const defaultCrud = CRUD({ title: i18n.t('tenant.TITLE'), url: 'api/tenant/page', sort: 'id,desc', crudMethod: { ...crudTenant }, adSearchFields: adSearchFields })
const defaultForm = { id: null, tenantName: null, tenantCode: null, dbUsername: null, dbPassword: null, driverClassName: null, jdbcUrl: null, status: null, remark: null, createTime: null, creatorNum: null, updateTime: null, updaterNum: null }
export default {
  name: 'Tenant',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['tenant_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'tenant:add'],
        edit: ['admin', 'tenant:edit'],
        del: ['admin', 'tenant:del']
      },
      rules: {
        tenantName: [
          { required: true, message: i18n.t('tenant.tenantNameRequired'), trigger: 'blur' }
        ],
        dbUsername: [
          { required: true, message: i18n.t('tenant.dbUsernameRequired'), trigger: 'blur' }
        ],
        dbPassword: [
          { required: true, message: i18n.t('tenant.dbPasswordRequired'), trigger: 'blur' }
        ],
        driverClassName: [
          { required: true, message: i18n.t('tenant.driverClassNameRequired'), trigger: 'blur' }
        ],
        jdbcUrl: [
          { required: true, message: i18n.t('tenant.jdbcUrlRequired'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: i18n.t('tenant.statusRequired'), trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'tenantName', display_name: i18n.t('tenant.tenantName') }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
