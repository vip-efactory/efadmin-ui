<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="$t('db.execScript')" width="420px">
    <el-form ref="form" :rules="rules" size="small">
      <el-upload
        :action="databaseUploadApi"
        :data="databaseInfo"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        class="upload-demo"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          {{ $t('common.dragFileUpload') }}
          <em>{{ $t('common.clickUpload') }}</em>
        </div>
        <div slot="tip" class="el-upload__tip">{{ $t('db.execSqlTips') }}</div>
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel">{{ $t('common.close') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  props: {
    databaseInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      headers: {
        Authorization: getToken()
      },
      rules: {}
    }
  },
  computed: {
    ...mapGetters(['databaseUploadApi'])
  },
  mounted() {
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    handleSuccess(response, file, fileList) {
      if (response === 'success') {
        this.$notify({
          title: '执行成功',
          type: 'success',
          duration: 2500
        })
      } else {
        this.$notify({
          title: response,
          type: 'error',
          duration: 0
        })
      }
    },
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 0
      })
    }
  }
}
</script>

<style scoped>
</style>
