<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span v-show="is_zh_CN"> ⋅ </span>
      <a v-show="is_zh_CN" href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a>
      <a v-show="is_zh_CN" href="https://jq.qq.com/?_wv=1027&k=5DTYJ3S" target="_blank" >QQ交流群:601693868</a>
    </div>
  </section>
</template>

<script>
import { getLocale } from '../../lang'

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    // 非中文环境不显示备案号信息
    is_zh_CN: function() {
      return getLocale().indexOf('zh') > -1
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
