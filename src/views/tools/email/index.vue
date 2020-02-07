<template>
  <el-tabs v-model="activeName" style="padding-left: 5px;">
    <el-tab-pane :label="$t('email.EMAIL_CONFIG_TAB')" name="first">
      <Config />
    </el-tab-pane>
    <el-tab-pane :label="$t('email.EMAIL_SEND_TAB')" name="second">
      <Send />
    </el-tab-pane>
    <el-tab-pane :label="$t('email.INSTRUCTIONS_TAB')" name="third">
      <div>
        <blockquote class="my-blockquote"> {{ $t('email.helpServerConfigTitle') }}</blockquote>
        <pre class="my-code">
        {{ $t('email.helpServerConfigTips') }}
        </pre>
        <blockquote class="my-blockquote">{{ $t('email.helpMoreTitle') }}</blockquote>
        <pre class="my-code">{{ $t('email.moreHelpViewDoc') }}<a style="color:#009688" href="http://hutool.mydoc.io/#text_319499" target="_black">{{ $t('email.hutool') }}</a></pre>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import Send from './send'
export default {
  name: 'Email',
  components: { Config, Send },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style scoped>
</style>
