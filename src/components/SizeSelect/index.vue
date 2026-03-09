<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div style="cursor: pointer;">
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="size===item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      sizeOptions: [
        { label: 'Large', value: 'large' },
        { label: 'Default', value: 'default' },
        { label: 'Small', value: 'small' }
      ]
    }
  },
  computed: {
    size() {
      return this.$store.getters.size
    }
  },
  methods: {
    async handleSetSize(size) {
      try {
        // 1. 设置全局尺寸
        window.ELEMENT = { size }
        // 2. 尝试存储到Vuex（加await确保成功）
        await this.$store.dispatch('app/setSize', size)
        // 3. 验证是否设置成功
        const storedSize = this.$store.getters.size
        const globalSize = window.ELEMENT.size
        if (storedSize === size && globalSize === size) {
          this.$message({ message: '布局大小设置成功，页面正在刷新', type: 'success' })
          // 刷新浏览器使配置生效
          this.$nextTick(() => {
            window.location.reload()
          })
        } else {
          this.$message({ message: '布局设置失败', type: 'error' })
        }
      } catch (e) {
        console.error('尺寸设置失败：', e)
        this.$message({ message: '布局设置失败', type: 'error' })
      }
    },
    // 安全的刷新视图方法（避免删除所有缓存）
    safeRefreshView() {
      const currentRoute = this.$route
      // 仅删除当前页面缓存，而非所有
      this.$store.dispatch('tagsView/delCachedView', currentRoute)
      this.$nextTick(() => {
        // 先跳转到空页面，再跳回当前页（避免vnode崩溃）
        this.$router.replace({ path: '/empty' }).then(() => {
          this.$router.replace(currentRoute.fullPath)
        })
      })
    }
  }

}
</script>
