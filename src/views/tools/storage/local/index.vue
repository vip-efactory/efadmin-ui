<template>
  <div class="app-container" style="padding: 8px;">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" :placeholder="$t('storage.localSearchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="$t('common.startDate')"
          :end-placeholder="$t('common.endDate')"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <!-- 新增 -->
        <el-button
          slot="left"
          v-permission="['admin','storage:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="crud.toAdd"
        >{{ $t('storage.uploadBtn') }}
        </el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.add ? $t('storage.fileUpload') : $t('storage.editFile')" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="80px">
        <el-form-item :label="$t('storage.name')">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <!--   上传文件   -->
        <el-form-item v-if="crud.status.add" :label="$t('storage.uploadBtn')">
          <el-upload
            ref="upload"
            :limit="1"
            :before-upload="beforeUpload"
            :auto-upload="false"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :action="fileUploadApi + '?name=' + form.name"
          >
            <div class="eladmin-upload"><i class="el-icon-upload" /> {{ $t('storage.addFile') }}</div>
            <div slot="tip" class="el-upload__tip">{{ $t('storage.localUploadTips') }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">{{ $t('crud.confirm') }}</el-button>
        <el-button v-else :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" prop="name" :label="$t('storage.name')" sortable="custom">
        <template slot-scope="scope">
          <el-popover
            :content="'file/' + scope.row.realName"
            placement="top-start"
            :title="$t('storage.path')"
            width="200"
            trigger="hover"
          >
            <a
              slot="reference"
              :href="baseApi + '/file/' + scope.row.realName"
              class="el-link--primary"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              target="_blank"
            >
              {{ scope.row.name }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('path')" prop="path" :label="$t('storage.thumbnail')">
        <template slot-scope="{row}">
          <el-image
            :src=" baseApi + '/file/' + row.realName"
            :preview-src-list="[baseApi + '/file/' + row.realName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('suffix')" prop="suffix" :label="$t('storage.suffix')" sortable="custom" />
      <el-table-column v-if="columns.visible('type')" prop="type" :label="$t('storage.type')" sortable="custom" />
      <el-table-column v-if="columns.visible('size')" prop="size" :label="$t('storage.size')" />
      <el-table-column v-if="columns.visible('operate')" prop="operate" :label="$t('storage.operate')" sortable="custom" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" sortable="custom">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken, getTenant4Dev } from '@/utils/auth'
import crudFile from '@/api/tools/localStorage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('storage.name')], ['suffix', i18n.t('storage.suffix')], ['type', i18n.t('storage.type')], ['operate', i18n.t('storage.operate')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: '文件', url: 'api/localStorage/page', crudMethod: { ...crudFile }, adSearchFields: adSearchFields })
const defaultForm = { id: null, name: '' }
export default {
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      headers: {
        'Authorization': getToken(),
        'TENANT_ID': getTenant4Dev()
      },
      permission: {
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      }
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
  },
  methods: {
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error(i18n.t('storage.sizeLimit'))
      }
      this.form.name = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.crud.notify(i18n.t('storage.uploadOK'), CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>
  /deep/ .el-image__error, .el-image__placeholder{
    background: none;
  }
  /deep/ .el-image-viewer__wrapper{
    top: 55px;
  }
</style>
