<template>
  <div>
    <div v-if="dictName === ''">
      <div class="my-code">{{ $t('dictDetail.clickViewDetail') }}</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="query.label" clearable size="small" :placeholder="$t('dictDetail.queryTips')" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">{{ $t('crud.search') }}</el-button>
      </div>
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="getFormTitle()" width="520px">
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
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancel">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="loading" type="primary" @click="submitMethod">{{ $t('crud.confirm') }}</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" style="width: 100%;">
        <el-table-column :label="$t('dictDetail.dict')">
          {{ dictName }}
        </el-table-column>
        <el-table-column prop="label" :label="$t('dictDetail.label')" />
        <el-table-column prop="value" :label="$t('dictDetail.value')" />
        <el-table-column prop="sort" :label="$t('dictDetail.sort')" />
        <el-table-column v-if="checkPermission(['admin','dict:edit','dict:del'])" :label="$t('be.operate')" width="230px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission="['admin','dict:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','dict:del']"
              placement="top"
              width="230"
            >
              <p>{{ $t('dictDetail.deleteTips') }}</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">{{ $t('crud.cancel') }}</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">{{ $t('crud.confirm') }}</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
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
      title: i18n.t('dictDetail.TITLE'),
      sort: ['sort,asc', 'id,desc'],
      crudMethod: { ...crudDictDetail },
      dictName: '',
      form: { id: null, label: null, value: null, dict: { id: null }, sort: 999 },
      rules: {
        label: [
          { required: true, message: i18n.t('dictDetail.labelRequired'), trigger: 'blur' }
        ],
        sort: [
          { required: true, message: i18n.t('dictDetail.sortRequired'), trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    beforeInit() {
      this.url = 'api/dictDetail/page'
      if (this.dictName) {
        this.params['dictName'] = this.dictName
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
