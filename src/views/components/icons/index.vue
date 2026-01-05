<template>
  <div class="icons-container">
    <aside>
      <a href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html" target="_blank">Add and use
      </a>
    </aside>
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <div v-for="item of svgIcons" :key="item" @click="handleClipboard(generateIconCode(item),$event)">
          <el-tooltip placement="top">
            <template #content>
              {{ generateIconCode(item) }}
            </template>
            <div class="icon-item">
              <!-- 【可选】加空值容错，避免item为空时渲染报错 -->
              <svg-icon v-if="item" :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item),$event)">
          <el-tooltip placement="top">
            <template #content>
              {{ generateElementIconCode(item) }}
            </template>
            <div class="icon-item">
              <!-- 【可选】空值容错 + Element Plus图标类名兼容 -->
              <i v-if="item" :class="`el-icon-${item}`" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  data() {
    return {
      svgIcons,
      elementIcons
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      // 【可选】Vue3下阻止事件冒泡，避免触发无关行为
      event.stopPropagation()
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
