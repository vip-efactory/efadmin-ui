<template>
  <el-dialog :visible.sync="dialog" append-to-body :title="$t('system.diskDetail')" width="88%">
    <!--表格渲染-->
    <el-table :data="data" style="width: 100%;margin-top: -10px;">
      <el-table-column :show-overflow-tooltip="true" prop="name" :label="$t('system.name')" />
      <el-table-column :show-overflow-tooltip="true" prop="mount" :label="$t('system.mount')" />
      <el-table-column :show-overflow-tooltip="true" :label="$t('system.availablePercent')">
        <template slot-scope="scope">
          <el-tag :type="(scope.row.usableSpace * 100 /scope.row.totalSpace).toFixed(2) > 5.00 ? 'success' : 'danger'">{{ (scope.row.usableSpace * 100 /scope.row.totalSpace).toFixed(2) }}%</el-tag>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="usableSpace" :label="$t('system.availableSize')">
        <template slot-scope="scope">
          <span>{{ (scope.row.usableSpace/1024/1024/1024).toFixed(2) }}GB</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="totalSpace" width="120px" :label="$t('system.totalSize')">
        <template slot-scope="scope">
          <span>{{ (scope.row.totalSpace/1024/1024/1024).toFixed(2) }}GB</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="type" :label="$t('system.fsType')" />
      <el-table-column :show-overflow-tooltip="true" prop="uuid" :label="$t('system.diskUuid')" />
    </el-table>
  </el-dialog>
</template>

<script>

import i18n from '../../../lang'

export default {
  data() {
    return {
      title: '磁盘信息',
      dialog: false,
      data: [],
      errorInfo: '', errorDialog: false,
      enabledTypeOptions: [
        { key: 'true', display_name: i18n.t('common.success') },
        { key: 'false', display_name: i18n.t('common.failure') }
      ]
    }
  },
  methods: {
    doInit(inData) {
      this.$nextTick(() => {
        this.data = inData
      })
    }
  }
}
</script>

<style scoped>
  .java.hljs{
    color: #444;
    background: #ffffff !important;
  }
  /deep/ .el-dialog__body{
    padding: 0 20px 10px 20px !important;
  }
</style>
