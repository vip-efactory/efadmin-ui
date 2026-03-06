<template>
  <div>
    <div v-if="dictName === ''">
      <div class="my-code">{{ $t('dictDetail.clickViewDetail') }}</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="query.label" clearable size="small" :placeholder="$t('dictDetail.queryTips')" style="width: 200px;" class="filter-item" @keyup.enter="toQuery" />
        <el-button class="filter-item" size="small" type="success" icon="Search" @click="toQuery">{{ $t('crud.search') }}</el-button>
      </div>
      <!--表单组件-->
      <el-dialog v-model="dialog" append-to-body :close-on-click-modal="false" :before-close="cancel" :title="getFormTitle()" width="520px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item :label="$t('dictDetail.label')" prop="label">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('dictDetail.value')">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item :label="$t('dictDetail.sort')" prop="sort">
            <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button link @click="cancel">{{ $t('crud.cancel') }}</el-button>
            <el-button :loading="loading" type="primary" @click="submitMethod">{{ $t('crud.confirm') }}</el-button>
          </div>
        </template>
      </el-dialog>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" style="width: 100%;">
        <el-table-column :label="$t('dictDetail.dict')">
          {{ dictName }}
        </el-table-column>
        <el-table-column prop="label" :label="$t('dictDetail.label')" />
        <el-table-column prop="value" :label="$t('dictDetail.value')" />
        <el-table-column prop="sort" :label="$t('dictDetail.sort')" />
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
                :ref="`dictPopover_${scope.row.id}`"
                v-permission="['admin','dict:del']"
                placement="top"
                width="230"
                trigger="click"
              >
                <p>{{ $t('dictDetail.deleteTips') }}</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="small"
                    link
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
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="page + 1"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import crud from '@/mixins/crud'
import crudDictDetail from '@/api/system/dictDetail'
import i18n from '../../../lang'

export default {
  mixins: [crud],
  data() {
    return {
      title: i18n.global.t('dictDetail.TITLE'),
      sort: ['sort,asc', 'id,desc'],
      crudMethod: { ...crudDictDetail },
      dictName: '',
      dialog: false, // 新增：弹窗显示状态（crud混入可能未定义，手动补充）
      loading: false, // 新增：提交加载状态
      delLoading: false, // 新增：删除加载状态
      form: { id: null, label: null, value: null, dict: { id: null }, sort: 999 },
      rules: {
        label: [
          { required: true, message: i18n.global.t('dictDetail.labelRequired'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: i18n.global.t('dictDetail.sortRequired'), trigger: 'blur', type: 'number', transform: val => Number(val) }
        ]
      }
    }
  },
  methods: {
    // 核心修复：显式实现提交方法（确定按钮触发）
    submitMethod() {
      // 1. 先触发表单校验，校验失败则提示并返回
      this.$refs.form.validate((valid) => {
        if (!valid) {
          // 校验失败，给出提示（可选，增强用户感知）
          this.$message.warning('表单填写不完整，请检查！')
          return false
        }

        // 2. 校验通过，设置加载状态
        this.loading = true

        // 3. 区分新增/编辑状态（通过 form.id 是否存在）
        const isAdd = !this.form.id // 无id则为新增
        const apiMethod = isAdd ? this.crudMethod.add : this.crudMethod.edit

        // 4. 调用接口提交数据
        apiMethod(this.form).then(res => {
          this.loading = false
          // 5. 接口返回成功
          if (res && res.code === 0) {
            this.$message.success(isAdd ? '新增成功' : '编辑成功')
            this.dialog = false // 关闭弹窗
            this.init() // 刷新字典详情列表
            // 6. 重置表单（可选，避免下次打开残留数据）
            this.form = {
              id: null,
              label: null,
              value: null,
              dict: { id: this.form.dict.id }, // 保留所属字典ID
              sort: 999
            }
            this.$refs.form.clearValidate() // 清空校验状态
          } else {
            // 7. 接口返回失败（如后台校验失败）
            const msg = res && res.msg ? res.msg : (isAdd ? '新增失败' : '编辑失败')
            this.$message.error(msg)
          }
        }).catch(err => {
          // 8. 接口调用异常（如网络错误）
          this.loading = false
          this.$message.error('提交失败，请稍后重试')
          console.log('提交异常：', err)
        })
      })
    },
    // 核心新增：打开字典详情新增弹窗（父组件调用该方法）
    showAddFormDialog() {
      // 1. 打开弹窗
      this.dialog = true
      // 2. 重置表单（保留所属字典ID，清空其他字段，标识新增操作）
      const dictId = this.form.dict?.id || null // 保留选中的字典ID
      this.form = {
        id: null, // 清空ID，区分新增/编辑
        label: null,
        value: null,
        dict: { id: dictId }, // 携带所属字典ID
        sort: 999 // 默认排序
      }
      // 3. 清空表单校验状态
      this.$nextTick(() => {
        this.$refs.form?.clearValidate()
      })
    },
    // 核心新增：关闭弹窗/取消操作（对应dialog的before-close和取消按钮）
    cancel() {
      this.dialog = false
      // 清空校验状态
      this.$nextTick(() => {
        this.$refs.form?.clearValidate()
      })
    },
    // 原有：关闭行弹窗
    closeRowPopover(id) {
      const key = 'dictPopover_' + id
      let pop = this.$refs[key]
      if (Array.isArray(pop)) pop = pop[0]
      if (pop) {
        if (typeof pop.hide === 'function') pop.hide()
        else if (typeof pop.doClose === 'function') pop.doClose()
      }
    },
    // 原有：初始化前设置接口地址
    beforeInit() {
      this.url = 'api/dictDetail/page'
      if (this.dictName) {
        this.params['dictName'] = this.dictName
      }
      return true
    },
    // 可选：编辑弹窗（crud混入可能已实现，补充确保可用）
    showEditFormDialog(row) {
      this.dialog = true
      // 赋值表单（编辑状态）
      this.form = JSON.parse(JSON.stringify(row))
      // 确保dict.id存在
      if (!this.form.dict) {
        this.form.dict = { id: this.form.dictId || null }
      }
      this.$nextTick(() => {
        this.$refs.form?.clearValidate()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
