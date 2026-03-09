<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" size="small" type="success" icon="Search" @click="crud.toQuery">{{ $t('crud.search') }}</el-button>
    <el-button class="filter-item" size="small" type="warning" icon="Refresh-left" @click="crud.resetQuery()">{{ $t('crud.resetSearch') }}</el-button>
    <el-button v-if="crud.showAdSearchBtn" class="filter-item" size="small" type="primary" icon="Search" @click="crud.dialogSearch()">{{ $t('crud.advanceSearch') }}</el-button>
    <AdvancedSearch :modal-obj="crud" :modal-show.sync="crud.show" />
  </span>
</template>
<script>
import advancedSearch from '../../views/components/advancedSearch'
export default {
  components: {
    AdvancedSearch: advancedSearch
  },
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
  }
}
</script>
