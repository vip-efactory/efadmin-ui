<template>
  <el-dialog v-model="dialog" append-to-body :close-on-click-modal="false" :title="$t('db.execScript')" width="420px">
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
        <template #tip>
          <div class="el-upload__tip">{{ $t('db.execSqlTips') }}</div>
        </template>
      </el-upload>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="cancel">{{ $t('common.close') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken, getTenant4Dev } from '@/utils/auth'
import i18n from '../../../lang'

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
        'Authorization': getToken(),
        'TENANT_ID': getTenant4Dev()
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
          title: i18n.global.t('common.execOK'),
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
