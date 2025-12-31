<template>
  <div>
    <el-button v-permission="permission.edit" :disabled="disabledEdit" size="small" type="primary" :title="$t('crud.edit')" icon="Edit" @click="crud.toEdit(data)" />
    <el-popover v-model="pop" v-permission="permission.del" placement="top" width="180" trigger="manual" @show="onPopoverShow" @hide="onPopoverHide">
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="small" type="text" @click="doCancel">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.dataStatus[data.id].delete === 2" type="primary" size="small" @click="crud.doDelete(data)">{{ $t('crud.confirm') }}</el-button>
      </div>
      <template #reference>
        <el-button :disabled="disabledDel" type="danger" :title="$t('crud.delete')" icon="Delete" size="small" @click="toDelete" />
      </template>
    </el-popover>
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'
import i18n from '../../lang'

export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDel: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: i18n.global.t('crud.deleteTips')
    }
  },
  data() {
    return {
      pop: false
    }
  },
  methods: {
    doCancel() {
      this.pop = false
      this.crud.cancelDelete(this.data)
    },
    toDelete() {
      this.pop = true
    },
    [CRUD.HOOK.afterDelete](crud, data) {
      if (data === this.data) {
        this.pop = false
      }
    },
    onPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    onPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.pop = false
    }
  }
}
</script>
