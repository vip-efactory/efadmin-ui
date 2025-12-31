<template>
  <div class="app-container">
    <!-- 表单组件 -->
    <el-dialog
      v-model="dialog"
      append-to-body
      :close-on-click-modal="false"
      :before-close="cancel"
      :title="getFormTitle()"
      width="520px"
    >
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-form-item :label="$t('dict.name')" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item :label="$t('be.remark')">
          <el-input v-model="form.remark" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="loading" type="primary" @click="submitMethod">
          {{ $t('crud.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 字典列表 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('dict.dictList') }}</span>
            <el-button
              v-permission="['admin','dict:add']"
              class="filter-item"
              size="small"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="Plus"
              @click="showAddFormDialog"
            >{{ $t('crud.new') }}</el-button>
          </div>

          <!-- 工具栏 -->
          <div class="head-container">
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              :placeholder="$t('dict.queryTips')"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="toQuery"
            />
            <el-button class="filter-item" size="small" type="success" icon="Search" @click="toQuery">
              {{ $t('crud.search') }}
            </el-button>
            <el-button
              :loading="downloadLoading"
              size="small"
              class="filter-item"
              type="warning"
              icon="Download"
              @click="downloadMethod"
            >{{ $t('crud.export') }}</el-button>
          </div>

          <!-- 表格 -->
          <el-table
            v-loading="loading"
            :data="data"
            highlight-current-row
            style="width: 100%;"
            @current-change="handleCurrentChange"
          >
            <el-table-column :show-overflow-tooltip="true" prop="name" :label="$t('dict.name')" />
            <el-table-column :show-overflow-tooltip="true" prop="remark" :label="$t('be.remark')" />
            <el-table-column
              v-if="checkPermission(['admin','dict:edit','dict:del'])"
              :label="$t('be.operate')"
              width="230px"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <div v-if="scope.row">
                  <el-button
                    v-permission="['admin','dict:edit']"
                    size="small"
                    type="primary"
                    icon="Edit"
                    @click="showEditFormDialog(scope.row)"
                  />
                  <el-popover
                    :ref="`popover_${scope.row.id}`"
                    v-permission="['admin','dict:del']"
                    placement="top"
                    width="230px"
                    trigger="click"
                  >
                    <p>{{ $t('dict.deleteTips') }}</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="small"
                        type="text"
                        @click.stop="closeRowPopover(scope.row.id)"
                      >{{ $t('crud.cancel') }}</el-button>
                      <el-button
                        :loading="delLoading"
                        type="primary"
                        size="small"
                        @click.stop="delMethod(scope.row.id)"
                      >{{ $t('crud.confirm') }}</el-button>
                    </div>
                    <template #reference>
                      <el-button type="danger" icon="Delete" size="small" />
                    </template>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-card>
      </el-col>

      <!-- 字典详情列表（修改按钮显示条件，解决不显示问题） -->
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('dict.dictDetails') }}</span>
            <!-- 优化：用currentDict判断，更稳定，解决按钮不显示问题 -->
            <el-button
              v-if="checkPermission(['admin','dict:add']) && currentDict"
              class="filter-item"
              size="small"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="Plus"
              @click="$refs.dictDetail.showAddFormDialog"
            >{{ $t('crud.new') }}</el-button>
          </div>
          <dictDetail ref="dictDetail" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import dictDetail from './dictDetail'
import crudDict from '@/api/system/dict'
import i18n from '../../../lang'

export default {
  name: 'Dict',
  components: { dictDetail },
  mixins: [crud],
  data() {
    return {
      title: i18n.global.t('dict.TITLE'),
      crudMethod: { ...crudDict },
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ],
      form: { id: null, name: null, remark: null },
      rules: {
        name: [{ required: true, message: i18n.global.t('dict.nameRequired'), trigger: 'blur' }]
      },
      currentDict: null
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 统一关闭当前行的 popover，兼容数组/实例和新旧 API
    closeRowPopover(id) {
      const refKey = 'popover_' + id
      let pop = this.$refs[refKey]
      if (Array.isArray(pop)) pop = pop[0]
      if (pop) {
        if (typeof pop.hide === 'function') {
          pop.hide()
        } else if (typeof pop.doClose === 'function') {
          pop.doClose()
        }
      }
    },
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dict/page'
      this.exportUrl = 'api/dict/download'
      if (this.$refs.dictDetail) {
        this.$refs.dictDetail.data = []
        this.$refs.dictDetail.dictName = ''
      }
      return true
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      this.currentDict = val // 新增：存储当前选中字典
      if (val) {
        this.$refs.dictDetail.dictName = val.name
        this.$refs.dictDetail.form.dict.id = val.id
        this.$refs.dictDetail.init()
      } else {
        // 取消选中时，清空子组件数据
        if (this.$refs.dictDetail) {
          this.$refs.dictDetail.dictName = ''
          this.$refs.dictDetail.form.dict.id = null
          this.$refs.dictDetail.data = []
        }
      }
    },
    // 覆盖混入里的 delMethod，只改关闭逻辑，其余保持一致
    delMethod(id) {
      if (!this.beforeDelMethod()) return
      this.delLoading = true
      this.crudMethod.del(id).then(r => {
        this.delLoading = false
        if (r && r.code === 0) {
          this.closeRowPopover(id)
          this.dleChangePage()
          this.delSuccessNotify()
          this.afterDelMethod()
          this.init()
        } else {
          this.loading = false
          const msg = r && r.msg ? r.msg : 'Delete failed'
          crud.notify(msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        this.delLoading = false
        // 失败也尽量关闭，避免悬浮
        this.closeRowPopover(id)
      })
    }
  }
}
</script>

<style scoped>
</style>
