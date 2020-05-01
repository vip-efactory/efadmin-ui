<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!--搜索-->
        <el-input v-model="query.filename" clearable size="small" :placeholder="$t('picture.searchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <!-- 上传 -->
        <el-button
          slot="left"
          v-permission="['admin','pictures:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="dialog = true"
        >{{ $t('picture.uploadBtn') }}</el-button>
        <el-tooltip slot="right" class="item" effect="dark" :content="$t('picture.syncTips')" placement="top-start">
          <el-button
            v-permission="['admin','pictures:add']"
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            :loading="syncLoading"
            @click="sync"
          >{{ $t('picture.synchronizeBtn') }}</el-button>
        </el-tooltip>
      </crudOperation>
    </div>
    <!--上传图片-->
    <el-dialog :visible.sync="dialog" :close-on-click-modal="false" append-to-body width="600px" @close="doSubmit">
      <el-upload
        :on-preview="handlePictureCardPreview"
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :file-list="fileList"
        :action="imagesUploadApi"
        list-type="picture-card"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog append-to-body :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmit">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler" @sort-change="crud.doTitleOrder">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('filename')" width="200" prop="filename" :label="$t('picture.filename')" sortable="custom" />
      <el-table-column v-if="columns.visible('username')" prop="username" :label="$t('picture.username')" sortable="custom" />
      <el-table-column v-if="columns.visible('url')" ref="table" :show-overflow-tooltip="true" prop="url" :label="$t('picture.url')">
        <template slot-scope="{row}">
          <el-image
            :src="row.url"
            :preview-src-list="[row.url]"
            fit="contain"
            lazy
            class="el-avatar"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('size')" prop="size" :label="$t('picture.size')" />
      <el-table-column v-if="columns.visible('height')" prop="height" :label="$t('picture.height')" sortable="custom" />
      <el-table-column v-if="columns.visible('width')" prop="width" :label="$t('picture.width')" sortable="custom" />
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
import crudPic from '@/api/tools/picture'
import CRUD, { presenter, header, crud } from '@crud/crud'
import { getToken, getTenant4Dev } from '@/utils/auth'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['filename', i18n.t('picture.filename')], ['username', i18n.t('picture.username')], ['width', i18n.t('picture.width')], ['height', i18n.t('picture.height')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('picture.TITLE'), url: 'api/pictures/page', crudMethod: { ...crudPic }, adSearchFields: adSearchFields })
export default {
  name: 'Pictures',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      dialog: false,
      syncLoading: false,
      headers: {
        'Authorization': getToken(),
        'TENANT_ID': getTenant4Dev()
      },
      permission: {
        del: ['admin', 'pictures:del']
      },
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      pictures: []
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
  },
  methods: {
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          crudPic.del(this.pictures[i].id).then(res => {})
          return true
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmit() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialog = false
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
    },
    sync() {
      this.syncLoading = true
      crudPic.sync().then(res => {
        if (res.code === 0) {
          this.crud.notify(i18n.t('picture.syncOK'), CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.toQuery()
          this.syncLoading = false
        } else {
          this.syncLoading = false
          this.crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
