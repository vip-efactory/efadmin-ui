<template>
  <div class="app-container" style="padding: 8px;">
    <!--表单组件-->
    <eForm ref="form" />
    <!-- 工具栏 -->
    <div class="head-container">
      <div v-if="crud && crud.props && crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="crud.query.key"
          clearable
          size="small"
          :placeholder="$t('storage.qiniuSearchPlaceholder')"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter="crud.toQuery"
        />
        <el-date-picker
          v-model="query.c"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="YYYY-MM-DD HH:mm:ss"
          :start-placeholder="$t('common.startDate')"
          :end-placeholder="$t('common.endDate')"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <template #left>
          <!-- 上传 -->
          <el-button class="filter-item" size="small" type="primary" icon="Upload" @click="dialog = true">{{ $t('storage.uploadBtn') }}</el-button>
          <!-- 同步 -->
          <el-button icon="Refresh" class="filter-item" size="small" type="warning" @click="synchronize">{{ $t('storage.synchronizeBtn') }}</el-button>
          <!-- 配置 -->
          <el-button
            class="filter-item"
            size="small"
            type="success"
            icon="Tools"
            @click="doConfig"
          >{{ $t('storage.configBtn') }}</el-button>
        </template>
      </crudOperation>
      <!-- 文件上传 -->
      <el-dialog v-model="dialog" :close-on-click-modal="false" append-to-body width="500px" @close="doSubmit">
        <el-upload
          :before-remove="handleBeforeRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :headers="headers"
          :action="qiNiuUploadApi"
          class="upload-demo"
          multiple
        >
          <el-button size="small" type="primary">{{ $t('storage.clickUpload') }}</el-button>
          <template #tip>
            <div style="display: block;" class="el-upload__tip">{{ $t('storage.qiniuUploadTips') }}</div>
          </template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="doSubmit">{{ $t('crud.confirm') }}</el-button>
          </div>
        </template>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud?.loading"
        :data="crud?.data || []"
        style="width: 100%;"
        @selection-change="crud?.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-if="columns?.visible('name')"
          prop="name"
          :show-overflow-tooltip="true"
          :label="$t('storage.name')"
        >
          <template #default="scope">
            <!-- 规范javascript协议写法（小写） -->
            <a href="javascript:" class="el-link el-link--primary" target="_blank" type="primary" @click="download(scope.row.id)">{{ scope.row.key }}</a>
          </template>
        </el-table-column>
        <el-table-column
          v-if="columns?.visible('suffix')"
          :show-overflow-tooltip="true"
          prop="suffix"
          :label="$t('storage.suffix')"
        />
        <el-table-column
          v-if="columns?.visible('bucket')"
          prop="bucket"
          :label="$t('storage.bucket')"
        />
        <el-table-column
          v-if="columns?.visible('size')"
          prop="size"
          :label="$t('storage.size')"
        />
        <el-table-column
          v-if="columns?.visible('type')"
          prop="type"
          :label="$t('storage.type')"
        />
        <el-table-column
          v-if="columns?.visible('updateTime')"
          :label="$t('be.createTime')"
        >
          <template #default="scope">
            <span>{{ parseTime(scope?.row?.updateTime) }}</span>
          </template>
        </el-table-column>

      </el-table>
      <pagination />
    </div>
  </div>
</template>

<script>
import crudQiNiu from '@/api/tools/qiniu'
import { mapGetters } from 'vuex'
import { getToken, getTenant4Dev } from '@/utils/auth'
import eForm from './form'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../../lang'

// crud交由presenter持有
const adSearchFields = [{ fieldName: 'name', labelName: i18n.global.t('storage.name') }, { fieldName: 'suffix', labelName: i18n.global.t('storage.suffix') }, { fieldName: 'type', labelName: i18n.global.t('storage.type') }, { fieldName: 'bucket', labelName: i18n.global.t('storage.bucket') }, { fieldName: 'updateTime', labelName: i18n.global.t('be.createTime'), type: 'datetime' }] // 需要高级搜索的字段
const defaultCrud = CRUD({ title: '七牛云文件', url: 'api/qiNiuContent/page', crudMethod: { ...crudQiNiu }, adSearchFields: adSearchFields })
export default {
  components: { eForm, pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      permission: {
        del: ['admin', 'storage:del']
      },
      title: '文件', dialog: false,
      icon: 'el-icon-refresh',
      url: '',
      headers: {
        'Authorization': getToken(),
        'TENANT_ID': getTenant4Dev()
      },
      dialogImageUrl: '', dialogVisible: false, fileList: [], files: [], newWin: null
    }
  },
  computed: {
    ...mapGetters([
      'qiNiuUploadApi'
    ])
  },
  watch: {
    url(newVal, oldVal) {
      if (newVal && this.newWin) {
        this.newWin.sessionStorage.clear()
        this.newWin.location.href = newVal
        // 重定向后把url和newWin重置
        this.url = ''
        this.newWin = null
      }
    }
  },
  created() {
    // 先确认crud已初始化，再修改optShow的属性
    if (this.crud) {
      this.crud.optShow.add = false
      this.crud.optShow.edit = false
    }
  },
  methods: {
    // 七牛云配置
    doConfig() {
      const _this = this.$refs.form
      _this.init()
      _this.dialog = true
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.files.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid === file.uid) {
          crudQiNiu.del([this.files[i].id]).then(res => {})
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
      try { // 新增：捕获JSON解析异常
        const msg = JSON.parse(e.message)
        this.crud.notify(msg.message, CRUD.NOTIFICATION_TYPE.ERROR)
      } catch (err) { // 新增：解析失败时静默处理，避免控制台报错
        // 空catch块，仅捕获异常不做额外操作
      }
    },
    // 下载文件
    download(id) {
      this.downloadLoading = true
      // 先打开一个空的新窗口，再请求
      this.newWin = window.open()
      crudQiNiu.download(id).then(res => {
        if (res.code === 0) {
          this.downloadLoading = false
          this.url = res.data.url
        }
      }).catch(err => {
        this.downloadLoading = false
        console.log(err.response.data.message)
      })
    },
    // 同步数据
    synchronize() {
      this.icon = 'el-icon-loading'
      crudQiNiu.sync().then(res => {
        if (res.code === 0) {
          this.icon = 'el-icon-refresh'
          this.$message({
            showClose: true,
            message: '数据同步成功',
            type: 'success',
            duration: 1500
          })
          this.crud.toQuery()
        }
      }).catch(err => {
        this.icon = 'el-icon-refresh'
        console.log(err.response.data.message)
      })
    }
  }
}
</script>

<style scoped>

</style>
