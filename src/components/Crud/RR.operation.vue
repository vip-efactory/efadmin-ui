<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
    <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="crud.dialogSearch()">高级搜索</el-button>
    <AdvancedSearch  :modal-obj='crud' :modal-show.sync="crud.show"></AdvancedSearch>
  </span>
</template>
<script>
import advancedSearch from '../../views/components/advancedSearch'
export default {
  props: {
    crud: {
      type: Object,
      required: true
    },
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  components:{
    AdvancedSearch : advancedSearch
  }
}
</script>
