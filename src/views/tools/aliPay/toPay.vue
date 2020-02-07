<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" style="margin-top: 6px;" size="small" label-width="170px">
      <el-form-item :label="$t('aliPay.commodityName')" prop="subject">
        <el-input v-model="form.subject" style="width: 35%" />
      </el-form-item>
      <el-form-item :label="$t('aliPay.commodityPrice')" prop="totalAmount">
        <el-input v-model="form.totalAmount" style="width: 35%" />
        <span style="color: #C0C0C0;margin-left: 10px;">{{ $t('aliPay.priceRangeTips') }}</span>
      </el-form-item>
      <el-form-item :label="$t('aliPay.commodityDesc')" prop="body">
        <el-input v-model="form.body" style="width: 35%" rows="8" type="textarea" />
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="loading" size="medium" type="primary" @click="doSubmit">{{ $t('aliPay.toPayBtn') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { toAliPay } from '@/api/tools/alipay'
import i18n from '../../../lang'

export default {
  data() {
    return {
      url: '',
      // 新窗口的引用
      newWin: null,
      loading: false, form: { subject: '', totalAmount: '', body: '' },
      rules: {
        subject: [
          { required: true, message: i18n.t('aliPay.commodityNameRequired'), trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: i18n.t('aliPay.commodityPriceRequired'), trigger: 'blur' }
        ],
        body: [
          { required: true, message: i18n.t('aliPay.commodityDescRequired'), trigger: 'blur' }
        ]
      }
    }
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
  methods: {
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          // 先打开一个空的新窗口，再请求
          this.newWin = window.open()
          let url = ''
          if (/(Android)/i.test(navigator.userAgent)) { // 判断是否为Android手机
            url = 'aliPay/toPayAsWeb'
          } else if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { // 判断是否为苹果手机
            url = 'aliPay/toPayAsWeb'
          } else {
            url = 'aliPay/toPayAsPC'
          }
          toAliPay(url, this.form).then(res => {
            // if (res.code === 0) {
            this.loading = false
            this.url = res
            // }
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
