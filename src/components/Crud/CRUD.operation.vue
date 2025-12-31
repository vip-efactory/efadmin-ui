<template>
  <div class="crud-opts">
    <span class="crud-opts-left">
      <!--左侧插槽-->
      <slot name="left" />
      <el-button
        v-if="crud && crud.optShow && crud.optShow.add && permission"
        v-permission="permission.add"
        class="filter-item"
        size="small"
        type="primary"
        icon="Plus"
        @click="crud?.toAdd"
      >
        {{ $t('crud.new') }}
      </el-button>
      <el-button
        v-if="crud && crud.optShow && crud.optShow.edit && permission"
        v-permission="permission.edit"
        class="filter-item"
        size="small"
        type="success"
        icon="Edit"
        :disabled="crud?.selections?.length !== 1"
        @click="crud?.toEdit(crud?.selections?.[0])"
      >
        {{ $t('crud.edit') }}
      </el-button>
      <el-button
        v-if="crud && crud.optShow && crud.optShow.del && permission"
        slot="reference"
        v-permission="permission.del"
        class="filter-item"
        type="danger"
        icon="Delete"
        size="small"
        :loading="crud?.delAllLoading"
        :disabled="crud?.selections?.length === 0"
        @click="toDelete(crud?.selections)"
      >
        {{ $t('crud.delete') }}
      </el-button>
      <el-button
        v-if="crud.optShow.download"
        :loading="crud.downloadLoading"
        :disabled="!crud.data.length"
        class="filter-item"
        size="small"
        type="warning"
        icon="Download"
        @click="crud.doExport"
      >
        {{ $t('crud.export') }}
      </el-button>
      <!--右侧-->
      <slot name="right" />
    </span>
    <el-button-group class="crud-opts-right">
      <el-button
        size="small"
        plain
        type="info"
        icon="Search"
        @click="toggleSearch()"
      />
      <el-button
        size="small"
        icon="Refresh"
        @click="crud.refresh()"
      />
      <el-popover
        placement="bottom-end"
        width="150"
        trigger="click"
      >
        <template #reference>
          <el-button
            size="small"
            icon="Grid"
          >
            <i class="fa fa-caret-down" aria-hidden="true" />
          </el-button>
        </template>

        <el-checkbox
          v-model="allColumnsSelected"
          :indeterminate="allColumnsSelectedIndeterminate"
          @change="handleCheckAllChange"
        >
          {{ $t('crud.selectAll') }}
        </el-checkbox>
        <el-checkbox
          v-for="item in crud.props.tableColumns"
          :key="item.label"
          v-model="item.visible"
          @change="handleCheckedTableColumnsChange(item)"
        >
          {{ item.label }}
        </el-checkbox>
      </el-popover>
    </el-button-group>
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'
export default {
  mixins: [crud()],
  props: {
    permission: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false
    }
  },
  created() {
    this.crud.updateProp('searchToggle', true)
  },
  methods: {
    toDelete(datas) {
      this.$confirm(this.$t('crud.multiDeleteTipsStart') + `${datas.length}` + this.$t('crud.multiDeleteTipsEnd'), this.$t('crud.deleteWarn'), {
        confirmButtonText: this.$t('crud.confirm'),
        cancelButtonText: this.$t('crud.cancel'),
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(datas)
      }).catch(() => {
      })
    },
    handleCheckAllChange(val) {
      if (val === false) {
        this.allColumnsSelected = true
        return
      }
      for (const key in this.crud.props.tableColumns) {
        this.crud.props.tableColumns[key].visible = val
      }
      this.allColumnsSelected = val
      this.allColumnsSelectedIndeterminate = false
      // 改动1：替换 $forceUpdate() 为 crud.refresh()，触发表格重新渲染
      this.crud.refresh()
    },
    handleCheckedTableColumnsChange(item) {
      let totalCount = 0
      let selectedCount = 0
      for (const key in this.crud.props.tableColumns) {
        ++totalCount
        selectedCount += this.crud.props.tableColumns[key].visible ? 1 : 0
      }
      if (selectedCount === 0) {
        this.crud.notify(this.$t('crud.selectAtLeastOne'), CRUD.NOTIFICATION_TYPE.WARNING)
        this.$nextTick(function() {
          item.visible = true
        })
        return
      }
      this.allColumnsSelected = selectedCount === totalCount
      this.allColumnsSelectedIndeterminate = selectedCount !== totalCount && selectedCount !== 0
      // 改动2：替换 $forceUpdate() 为 crud.refresh()，触发表格重新渲染
      this.crud.refresh()
    },
    toggleSearch() {
      this.crud.props.searchToggle = !this.crud.props.searchToggle
    }
  }
}
</script>

<style>
  .crud-opts {
    padding: 6px 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
</style>
