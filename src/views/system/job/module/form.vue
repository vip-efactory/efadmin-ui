<template>
  <el-dialog
    v-model="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :before-close="() => crud.cancelCU()"
    :title="crud.status.title"
    width="610px"
  >
    <el-form
      ref="form"
      :model="crud.form"
      :rules="rules"
      size="small"
      label-width="160px"
    >
      <el-form-item
        :label="$t('job.name')"
        prop="name"
      >
        <el-input
          v-model="crud.form.name"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        :label="$t('job.sort')"
        prop="sort"
      >
        <el-input-number
          v-model.number="crud.form.sort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        v-if="crud.form.pid !== 0"
        :label="$t('job.enabled')"
        prop="enabled"
      >
        <el-radio
          v-for="item in (jobStatus || defaultUserStatus)"
          :key="item.id"
          v-model="crud.form.enabled"
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
          v-model="crud.form.dept.id"
          :options="depts"
          style="width: 370px"
          :placeholder="$t('job.deptSelectPlaceholder')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div
        class="dialog-footer"
      >
        <el-button
          link
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
    </template>
  </el-dialog>
</template>

<script>
import CRUD, { form } from '@crud/crud'
import { getDepts } from '@/api/system/dept'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import i18n from '../../../../lang'

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
      defaultUserStatus: [
        { id: 1, label: this.$t('common.enable'), value: 'true' },
        { id: 2, label: this.$t('common.disable'), value: 'false' }
      ],
      depts: [],
      rules: {
        name: [
          { required: true, message: i18n.global.t('job.nameRequired'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: i18n.global.t('job.sortRequired'), trigger: 'blur', type: 'number' }
        ],
        dept: { required: true, message: i18n.global.t('job.deptRequired'), trigger: 'select' }
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        // 确保 crud 实例存在，避免空值报错
        return this.crud?.status?.cu > 0 ?? false
      },
      set(newVal) {
        // 当弹窗关闭（newVal 为 false）时，重置 CRUD 状态
        if (!newVal && this.crud?.status) {
          this.crud.status.add = CRUD.STATUS.NORMAL
          this.crud.status.edit = CRUD.STATUS.NORMAL
        }
      }
    }
  },
  methods: {
    [CRUD.HOOK.beforeToCU]() {
      getDepts({ enabled: true }).then(res => {
        if (res.code === 0) {
          this.depts = res.data.content
        } else {
          this.$notify({
            title: res.msg,
            type: CRUD.NOTIFICATION_TYPE.ERROR
          })
        }
      })
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (!this.form.dept.id) {
        this.$notify({
          title: i18n.global.t('job.deptRequired'),
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
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
