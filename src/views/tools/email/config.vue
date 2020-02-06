<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="130px">
    <el-form-item :label="$t('email.fromUser')" prop="fromUser">
      <el-input v-model="form.fromUser" style="width: 40%" :placeholder="$t('email.fromUserTips')" />
    </el-form-item>
    <el-form-item :label="$t('email.user')" prop="user">
      <el-input v-model="form.user" style="width: 40%;" :placeholder="$t('email.userTips')" />
    </el-form-item>
    <el-form-item :label="$t('email.pass')" prop="pass">
      <el-input v-model="form.pass" type="password" style="width: 40%;" :placeholder="$t('email.passTips')" />
    </el-form-item>
    <el-form-item :label="$t('email.host')" prop="host">
      <el-input v-model="form.host" style="width: 40%;" :placeholder="$t('email.hostTips')" />
    </el-form-item>
    <el-form-item :label="$t('email.port')" prop="port">
      <el-input v-model="form.port" style="width: 40%;" :placeholder="$t('email.portTips')" />
    </el-form-item>
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">{{ $t('crud.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { get, update } from '@/api/tools/email'
import i18n from '../../../lang'

export default {
  name: 'Config',
  data() {
    return {
      loading: false, form: { id: 1, fromUser: '', user: '', pass: '', host: '', port: '', sslEnable: '' },
      rules: {
        fromUser: [
          { required: true, message: i18n.t('email.fromUserRequired'), trigger: 'blur' },
          { type: 'email', message: i18n.t('email.emailFormatError'), trigger: 'blur' }
        ],
        user: [
          { required: true, message: i18n.t('email.userRequired'), trigger: 'blur' }
        ],
        pass: [
          { required: true, message: i18n.t('email.passRequired'), trigger: 'blur' }
        ],
        host: [
          { required: true, message: i18n.t('email.hostRequired'), trigger: 'blur' }
        ],
        port: [
          { required: true, message: i18n.t('email.portRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      get().then(res => {
        if (res.code === 0) {
          this.form = res.data
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          update(this.form).then(res => {
            if (res.code === 0) {
              this.$notify({
                title: i18n.t('crud.editSuccess'),
                type: 'success',
                duration: 2500
              })
              this.loading = false
            } else {
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

</style>
