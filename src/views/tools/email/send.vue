<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="130px">
      <el-form-item :label="$t('email.emailTitle')" prop="subject">
        <el-input v-model="form.subject" style="width: 646px" />
      </el-form-item>
      <el-form-item
        v-for="(domain, index) in tos"
        :key="domain.key"
        :label="$t('email.mailTo') + (index === 0 ? '': index)"
      >
        <el-input v-model="domain.value" style="width: 550px" />
        <el-button icon="el-icon-plus" @click="addDomain" />
        <el-button style="margin-left:0;" icon="el-icon-minus" @click.prevent="removeDomain(domain)" />
      </el-form-item>
      <div ref="editor" class="editor" />
      <el-button :loading="loading" style="margin-left:1.6%;" size="medium" type="primary" @click="doSubmit">{{ $t('email.sendBtn') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { send } from '@/api/tools/email'
import { upload } from '@/utils/upload'
import { validEmail } from '@/utils/validate'
import { mapGetters } from 'vuex'
import E from 'wangeditor'
import i18n from '../../../lang'

export default {
  name: 'Index',
  data() {
    return {
      loading: false, form: { subject: '', tos: [], content: '' },
      tos: [{
        value: ''
      }],
      rules: {
        subject: [
          { required: true, message: i18n.global.t('email.emailSubjectRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
  },
  mounted() {
    const _this = this
    // 先判断ref是否存在，避免实例化失败
    if (!this.$refs.editor) return

    // 实例化编辑器（wangEditor 4+ 用 E 或 WangEditor，根据实际引入的名称）
    var editor = new E(this.$refs.editor)

    // 1. 旧版customConfig已改为config
    editor.config.zIndex = 10

    // 2. 文件上传：移除嵌套的files.forEach（避免重复循环）
    editor.config.customUploadImg = function(files, insert) {
      files.forEach(image => {
        // 3. 添加catch捕获上传错误，避免Promise报错
        upload(_this.imagesUploadApi, image)
          .then(data => {
            insert(data.data.url)
          })
          .catch(err => {
            console.error('图片上传失败：', err)
            _this.$message.error('图片上传失败，请重试')
          })
      })
    }

    editor.config.onchange = (html) => {
      _this.form.content = html
    }

    editor.create()
  },
  methods: {
    removeDomain(item) {
      var index = this.tos.indexOf(item)
      if (index !== -1 && this.tos.length !== 1) {
        this.tos.splice(index, 1)
      } else {
        this.$message({
          message: i18n.global.t('email.atLeastOneMailto'),
          type: 'warning'
        })
      }
    },
    addDomain() {
      this.tos.push({
        value: '',
        key: Date.now()
      })
    },
    doSubmit() {
      const _this = this
      this.$refs['form'].validate((valid) => {
        this.form.tos = []
        if (valid) {
          let sub = false
          this.tos.forEach(function(data, index) {
            if (data.value === '') {
              _this.$message({
                message: i18n.global.t('email.mailToRequired'),
                type: 'warning'
              })
              sub = true
            } else if (validEmail(data.value)) {
              _this.form.tos.push(data.value)
            } else {
              _this.$message({
                message: i18n.global.t('email.emailFormatError'),
                type: 'warning'
              })
              sub = true
            }
          })
          if (sub) { return false }
          this.loading = true
          send(this.form).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: i18n.global.t('email.sendOK'),
                type: 'success',
                duration: 2500
              })
              this.loading = false
            } else {
              this.loading = false
              crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
            }
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .editor{
    text-align:left;
    margin: 20px;
    width: 730px;
  }
  :deep(w-e-text-container) {
    height: 360px !important;
  }
</style>
