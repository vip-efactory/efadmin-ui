<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script>
const tagAndTagSpacing = 4 // tagAndTagSpacing

export default {
  name: 'ScrollPane',
  data() {
    return {
      left: 0
    }
  },
  computed: {
    scrollWrapper() {
      // 优化：判空 - 避免$refs.scrollContainer或wrap不存在
      if (!this.$refs.scrollContainer || !this.$refs.scrollContainer.$refs.wrap) {
        return null
      }
      return this.$refs.scrollContainer.$refs.wrap
    }
  },
  methods: {
    handleScroll(e) {
      // 判空：scrollWrapper不存在时直接返回，避免报错
      if (!this.scrollWrapper) return

      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    },
    moveToTarget(currentTag) {
      // 判空1：核心容器不存在直接返回
      if (!this.$refs.scrollContainer || !this.scrollWrapper) return

      const $container = this.$refs.scrollContainer.$el
      const $containerWidth = $container?.offsetWidth || 0 // 兜底：offsetWidth不存在时取0
      const $scrollWrapper = this.scrollWrapper
      // 判空2：父组件的tagList不存在/非数组时直接返回
      const tagList = this.$parent?.$refs?.tag || []
      if (!Array.isArray(tagList)) return

      let firstTag = null
      let lastTag = null

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0]
        lastTag = tagList[tagList.length - 1]
      }

      // 判空3：currentTag不存在时返回
      if (!currentTag) return

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0
      } else if (lastTag === currentTag) {
        // 判空：scrollWidth不存在时兜底为0
        $scrollWrapper.scrollLeft = ($scrollWrapper.scrollWidth || 0) - $containerWidth
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex(item => item === currentTag)
        // 判空4：currentIndex为-1（未找到）时返回
        if (currentIndex === -1) return

        const prevTag = tagList[currentIndex - 1]
        const nextTag = tagList[currentIndex + 1]

        // 判空5：prevTag/nextTag不存在时，不执行后续逻辑
        if (!prevTag || !nextTag || !prevTag.$el || !nextTag.$el) return

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

        if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;

  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
