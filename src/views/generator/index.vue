<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.name" clearable size="small" :placeholder="$t('codegen.searchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation>
        <el-tooltip slot="right" class="item" effect="dark" :content="$t('codegen.syncTips')" placement="top-start">
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            :loading="syncLoading"
            :disabled="crud.selections.length === 0"
            @click="sync"
          >{{ $t('codegen.synchronizeBtn') }}</el-button>
        </el-tooltip>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('tableName')" :show-overflow-tooltip="true" prop="tableName" :label="$t('codegen.tableName')" />
      <el-table-column v-if="columns.visible('engine')" :show-overflow-tooltip="true" prop="engine" :label="$t('codegen.engine')" />
      <el-table-column v-if="columns.visible('coding')" :show-overflow-tooltip="true" prop="coding" :label="$t('codegen.coding')" />
      <el-table-column v-if="columns.visible('remark')" :show-overflow-tooltip="true" prop="remark" :label="$t('be.remark')" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('be.operate')" width="250px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" style="margin-right: 2px" type="text">
            <router-link :to="'/sys-tools/generator/preview/' + scope.row.tableName">
              {{ $t('codegen.previewBtn') }}
            </router-link>
          </el-button>
          <el-button size="mini" style="margin-left: -1px;margin-right: 2px" type="text" @click="toDownload(scope.row.tableName)">{{ $t('codegen.downloadBtn') }}</el-button>
          <el-button size="mini" style="margin-left: -1px;margin-right: 2px" type="text">
            <router-link :to="'/sys-tools/generator/config/' + scope.row.tableName">
              {{ $t('crud.edit') }}
            </router-link>
          </el-button>
          <el-button type="text" style="margin-left: -1px" size="mini" @click="toGen(scope.row.tableName)">{{ $t('codegen.generateBtn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>

import { generator, sync } from '@/api/generator/generator'
import { downloadFile } from '@/utils/index'
import CRUD, { presenter, header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../lang'

// crud交由presenter持有
const defaultCrud = CRUD({ url: 'api/generator/tables', showAdSearchBtn: false })
export default {
  name: 'GeneratorIndex',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header()],
  data() {
    return {
      syncLoading: false
    }
  },
  created() {
    this.crud.optShow = { add: false, edit: false, del: false, download: false }
  },
  methods: {
    toGen(tableName) {
      // 生成代码
      generator(tableName, 0).then(r => {
        if (r.code === 0) {
          this.$notify({
            title: i18n.t('codegen.generateOK'),
            type: 'success',
            duration: 2500
          })
        } else {
          crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    },
    toDownload(tableName) {
      // 打包下载
      generator(tableName, 2).then(data => {
        downloadFile(data, tableName, 'zip')
      })
    },
    sync() {
      const tables = []
      this.crud.selections.forEach(val => {
        tables.push(val.tableName)
      })
      this.syncLoading = true
      sync(tables).then(r => {
        if (r.code === 0) {
          this.crud.refresh()
          this.crud.notify(i18n.t('codegen.syncOK'), CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.syncLoading = false
        } else {
          this.syncLoading = false
          crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).then(() => {
        this.syncLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
