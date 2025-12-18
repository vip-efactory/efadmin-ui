<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane :label="$t('storage.LOCAL_TITLE')" name="first">
      <Local ref="local" />
    </el-tab-pane>
    <el-tab-pane :label="$t('storage.QINIU_TITLE')" name="second">
      <QiNiu ref="qiNiu" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import QiNiu from './qiniu/index'
import Local from './local/index'
export default {
  name: 'Storage',
  components: { QiNiu, Local },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    tabClick(name) {
      if (this.activeName === 'first') {
        // 逐层可选链防护：先确认$refs.local存在，再确认crud存在，最后调用toQuery
        this.$refs.local?.crud?.toQuery()
      } else {
        // 同理防护$refs.qiNiu和对应的crud
        this.$refs.qiNiu?.crud?.toQuery()
      }
    }
  }
}
</script>

<style scoped>
</style>
