<template>
  <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="170px">
    <el-form-item :label="$t('aliPay.appId')" prop="appId">
      <el-input v-model="form.appId" style="width: 40%" />
      <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.appIdSpan') }}</span>
    </el-form-item>
    <el-form-item :label="$t('aliPay.sysServiceProviderId')" prop="sysServiceProviderId">
      <el-input v-model="form.sysServiceProviderId" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.sysServiceProviderIdSpan') }}</span>
    </el-form-item>
    <el-form-item :label="$t('aliPay.privateKey')" prop="privateKey">
      <el-input v-model="form.privateKey" type="password" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.privateKeySpan') }}</span>
    </el-form-item>
    <el-form-item :label="$t('aliPay.publicKey')" prop="publicKey">
      <el-input v-model="form.publicKey" type="password" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.publicKeySpan') }}</span>
    </el-form-item>
    <el-form-item :label="$t('aliPay.returnUrl')" prop="returnUrl">
      <el-input v-model="form.returnUrl" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.returnUrlSpan') }}</span>
    </el-form-item>
    <el-form-item :label="$t('aliPay.notifyUrl')" prop="notifyUrl">
      <el-input v-model="form.notifyUrl" style="width: 40%;" />
      <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.notifyUrlSpan') }}</span>
    </el-form-item>
    <el-form-item label="">
      <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">{{ $t('crud.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { get, update } from '@/api/tools/alipay'
import i18n from '../../../lang'

export default {
  name: 'Config',
  data() {
    return {
      loading: false,
      form: { appId: '', sysServiceProviderId: '', privateKey: '', publicKey: '', returnUrl: '', notifyUrl: '' },
      rules: {
        appId: [
          { required: true, message: i18n.t('aliPay.appIdRequired'), trigger: 'blur' }
        ],
        sysServiceProviderId: [
          { required: true, message: i18n.t('aliPay.sysServiceProviderIdRequired'), trigger: 'blur' }
        ],
        privateKey: [
          { required: true, message: i18n.t('aliPay.privateKeyRequired'), trigger: 'blur' }
        ],
        publicKey: [
          { required: true, message: i18n.t('aliPay.publicKeyRequired'), trigger: 'blur' }
        ],
        returnUrl: [
          { required: true, message: i18n.t('aliPay.returnUrlRequired'), trigger: 'blur' }
        ],
        notifyUrl: [
          { required: true, message: i18n.t('aliPay.notifyUrlRequired'), trigger: 'blur' }
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

</style>
