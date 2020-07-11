<template>
  <el-dialog :visible.sync="dialog" append-to-body :title="$t('task.LOGTITLE')" width="88%">
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" style="width: 100%;margin-top: -10px;">
      <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
      <el-table-column :show-overflow-tooltip="true" prop="mount" label="挂载点" />
      <el-table-column :show-overflow-tooltip="true" prop="type" label="文件系统类型" />
      <el-table-column :show-overflow-tooltip="true" prop="uuid" label="磁盘UUID" />
      <el-table-column :show-overflow-tooltip="true" prop="usableSpace" label="可用空间(GB)">
        <template slot-scope="scope">
          <span>{{ scope.row.usableSpace/1024/1024/1024 }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="totalSpace" width="120px" label="总空间(GB)">
        <template slot-scope="scope">
          <span>{{ scope.row.totalSpace/1024/1024/1024 }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>

import i18n from '../../../lang'
import { initData } from '@/api/data'

export default {
  data() {
    return {
      title: '磁盘信息',
      data: {},
      errorInfo: '', errorDialog: false,
      enabledTypeOptions: [
        { key: 'true', display_name: i18n.t('common.success') },
        { key: 'false', display_name: i18n.t('common.failure') }
      ]
    }
  },
  methods: {
    doInit() {
      this.$nextTick(() => {
        this.init()
      })
    },
    init() {
      initData('api/monitor?aaa=1', {}).then(res => {
        if (res.code === 0) {
          this.data = res.data.disk.disks
        } else {
          this.$notify(res.msg, 'error')
        }
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
