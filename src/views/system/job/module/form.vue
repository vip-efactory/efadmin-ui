<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="610px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="160px"
    >
      <el-form-item
        :label="$t('job.name')"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        :label="$t('job.sort')"
        prop="sort"
      >
        <el-input-number
          v-model.number="form.sort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        v-if="form.pid !== 0"
        :label="$t('job.enabled')"
        prop="enabled"
      >
        <el-radio
          v-for="item in jobStatus"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        :label="$t('job.dept')"
        prop="dept.id"
        :rules="rules.dept"
      >
        <treeselect
          v-model="form.dept.id"
          :options="depts"
          style="width: 370px"
          placeholder="选择部门"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        {{ $t('crud.cancel') }}
      </el-button>
      <el-button
        :loading="crud.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        {{ $t('crud.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, { form } from '@crud/crud'
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

const defaultForm = {
  id: null,
  name: '',
  sort: 999,
  enabled: true,
  dept: {
    id: 1
  }
}
export default {
  components: { Treeselect },
  mixins: [form(defaultForm)],
  props: {
    jobStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      depts: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        dept: { required: true, message: '所属部门不能为空', trigger: 'select' }
      }
    }
  },
  methods: {
    [CRUD.HOOK.beforeToCU]() {
      getDepts({ enabled: true }).then(res => {
        if (res.code === 0) {
          this.depts = res.data.content
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (!this.form.dept.id) {
        this.$notify({
          title: '所属部门不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
