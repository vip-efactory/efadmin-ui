<template>
  <div v-if="crud.props.searchToggle">
    <el-input
      v-model="crud.query.blurry"
      clearable
      size="small"
      :placeholder="$t('log.simpleSearchPlaceholder')"
      style="width: 200px;"
      class="filter-item"
    />
    <el-date-picker
      v-model="crud.query.createTime"
      type="daterange"
      range-separator=":"
      size="small"
      class="date-item"
      value-format="YYYY-MM-DD HH:mm:ss"
      :start-placeholder="$t('common.startTime')"
      :end-placeholder="$t('common.endTime')"
    />
    <rrOperation
      :crud="crud"
    />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
export default {
  components: { rrOperation },
  mixins: [header()]
}
</script>
