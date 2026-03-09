<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.name" clearable size="small" :placeholder="$t('job.jobSearchPlaceholder')" style="width: 150px;" class="filter-item" @keyup.enter="crud.toQuery" />
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
    <el-select v-model="query.enabled" clearable size="small" :placeholder="$t('job.enabled')" class="filter-item" style="width: 90px" @change="crud.toQuery">
      <el-option v-for="item in dict.dict.job_status" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
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
  mixins: [header()],
  props: {
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  }
}
</script>
