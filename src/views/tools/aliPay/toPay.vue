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
        <el-input v-model="form.body" style="width: 35%" :rows="8" type="textarea" />
      </el-form-item>
      <el-form-item label="">
        <el-button :loading="loading" size="large" type="primary" @click="doSubmit">{{ $t('aliPay.toPayBtn') }}</el-button>
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
          { required: true, message: i18n.global.t('aliPay.commodityNameRequired'), trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: i18n.global.t('aliPay.commodityPriceRequired'), trigger: 'blur' }
        ],
        body: [
          { required: true, message: i18n.global.t('aliPay.commodityDescRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async doSubmit() {
      try {
        // 1. 表单验证
        const valid = await this.$refs.form.validate()
        if (!valid) return

        this.loading = true

        // 2. 确定请求地址
        const apiUrl = /(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
          ? 'aliPay/toPayAsWeb'
          : 'aliPay/toPayAsPC'

        // 3. 调用后端接口（关键：提取res.data）
        const res = await toAliPay(apiUrl, this.form)
        if (res.code !== 0 || !res.data) {
          this.$message.error(res.msg || '支付链接生成失败')
          return
        }

        // 4. 处理后端返回内容（核心修复：区分URL和表单）
        const payContent = res.data
        // 判断是否是URL（包含http/https），否则是表单
        if (payContent.startsWith('http')) {
          // 是URL：直接新窗口跳转
          window.open(payContent, '_blank')
        } else {
          // 是表单：渲染并自动提交
          const formContainer = this.$refs.payForm
          formContainer.innerHTML = payContent
          const form = formContainer.querySelector('form')
          if (form) {
            form.target = '_blank' // 新窗口打开
            form.submit()
          } else {
            this.$message.error('支付表单解析失败')
          }
        }
      } catch (err) {
        // 异常处理
        this.$message.error(err.response?.data?.message || '支付请求失败')
        console.error('支付请求异常：', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
