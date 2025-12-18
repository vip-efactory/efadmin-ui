<template>
  <!-- 简单的404页面结构 -->
  <div class="page-404">
    <div class="content">
      <h1>404</h1>
      <p>页面不存在或无权访问</p>
      <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑，空脚本即可
</script>

<style scoped>
.page-404 {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}
.page-404 .content {
  text-align: center;
}
.page-404 h1 {
  font-size: 80px;
  color: #409eff;
  margin: 0;
}
.page-404 p {
  font-size: 18px;
  color: #666;
  margin: 20px 0;
}
</style>
