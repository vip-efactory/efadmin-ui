<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane :label="$t('aliPay.PAY_CONFIG_TAB')" name="first">
      <Config />
    </el-tab-pane>
    <el-tab-pane :label="$t('aliPay.PAY_TEST_TAB')" name="second">
      <ToPay />
    </el-tab-pane>
    <el-tab-pane :label="$t('aliPay.INSTRUCTIONS_TAB')" name="third">
      <div>
        <blockquote class="my-blockquote">{{ $t('aliPay.helpWarningTitle') }}</blockquote>
        <pre class="my-code">
        {{ $t('aliPay.applyAddress') }}<a style="color: #00a0e9" href="https://openhome.alipay.com/platform/appDaily.htm?tab=info" target="_blank">{{ $t('aliPay.aliPayDevPlatform') }}</a>
        {{ $t('aliPay.payTestTips') }}
        </pre>
        <blockquote class="my-blockquote"> {{ $t('aliPay.helpPaySettingsTitle') }}</blockquote>
        <pre class="my-code">
        {{ $t('aliPay.codeRemark') }}
if (/(Android)/i.test(navigator.userAgent)){     // {{ $t('aliPay.ifIsAndroid') }}
    url = "/aliPay/toPayAsWeb"
}else if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){  // {{ $t('aliPay.ifIsApple') }}
    url = "/aliPay/toPayAsWeb"
} else {
    url = "/aliPay/toPayAsPC"
}</pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import ToPay from './toPay'
export default {
  name: 'AliPay',
  components: { Config, ToPay },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style scoped>
</style>
