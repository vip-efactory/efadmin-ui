<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 加可选链，确保crud、props存在后再判断searchToggle -->
      <div v-if="crud?.props?.searchToggle">
        <el-input
          v-model="crud.query.filter"
          clearable
          size="small"
          :placeholder="$t('online.allTableLikeSearch')"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter="crud?.toQuery"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation>
        <template #left>
          <el-button
            class="filter-item"
            type="danger"
            icon="Delete"
            size="small"
            :loading="delLoading"
            :disabled="crud?.selections?.length === 0"
            @click="doDelete(crud?.selections)"
          >
            {{ $t('online.forceOut') }}
          </el-button>
        </template>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud?.loading"
      :data="crud?.data || []"
      style="width: 100%;"
      @selection-change="crud?.selectionChangeHandler"
      @sort-change="crud?.doTitleOrder"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('userName')" prop="userName" :label="$t('online.userName')" sortable="custom" />
      <el-table-column v-if="columns.visible('nickName')" prop="nickName" :label="$t('online.nickName')" sortable="custom" />
      <el-table-column v-if="columns.visible('job')" prop="job" :label="$t('online.job')" sortable="custom" />
      <el-table-column v-if="columns.visible('ip')" prop="ip" :label="$t('online.ip')" sortable="custom" />
      <el-table-column v-if="columns.visible('address')" :show-overflow-tooltip="true" prop="address" :label="$t('online.address')" sortable="custom" />
      <el-table-column v-if="columns.visible('browser')" prop="browser" :label="$t('online.browser')" sortable="custom" />
      <el-table-column v-if="columns.visible('loginTime')" prop="loginTime" :label="$t('online.loginTime')" sortable="custom">
        <template #default="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('be.operate')" width="120px" fixed="right">
        <template #default="scope">
          <el-popover
            :ref="`pop_${scope.$index}`"
            placement="top"
            width="180"
            trigger="click"
          >
            <p>{{ $t('online.deleteTips') }}</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="small"
                link
                @click="$refs[`pop_${scope.$index}`]?.hide?.()"
              >
                {{ $t('crud.cancel') }}
              </el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="small"
                @click="delMethod(scope.row.key, `pop_${scope.$index}`)"
              >
                {{ $t('crud.confirm') }}
              </el-button>
            </div>
            <template #reference>
              <el-button
                v-permission="['admin']"
                size="small"
                link
                style="margin-left: -10px"
              >
                {{ $t('online.forceOut') }}
              </el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { del } from '@/api/monitor/online'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import i18n from '../../../lang'

// crud交由presenter持有
const defaultCrud = CRUD({
  url: 'auth/online',
  exportUrl: 'auth/online/download',
  title: i18n.global.t('online.TITLE'),
  showAdSearchBtn: false
})

export default {
  name: 'OnlineUser',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      delLoading: false,
      permission: {},
      columns: {
        visible: () => true
      }
    }
  },
  created() {
    if (this.crud) {
      this.crud.msg.del = i18n.global.t('online.deleteOk')
      this.crud.optShow = {
        add: false,
        edit: false,
        del: false,
        download: true
      }
    }
  },
  methods: {
    doDelete(datas) {
      this.$confirm(
        i18n.global.t('online.deleteContentStart') + `${datas.length}` + i18n.global.t('online.deleteContentEnd'),
        i18n.global.t('online.deleteTitle'),
        {
          confirmButtonText: i18n.global.t('crud.confirm'),
          cancelButtonText: i18n.global.t('crud.cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.delMethod(datas)
      }).catch(() => {})
    },
    // 踢出用户
    delMethod(key, popRefKey) {
      const ids = []
      if (Array.isArray(key)) {
        key.forEach(val => ids.push(val.key))
      } else {
        ids.push(key)
      }
      this.delLoading = true
      del(ids).then(r => {
        this.delLoading = false
        if (r.code === 0) {
          // 关闭当前弹出层（如果存在）
          if (popRefKey && this.$refs[popRefKey]?.hide) {
            this.$refs[popRefKey].hide()
          }
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        } else {
          crud.notify(r.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => {
        this.delLoading = false
        if (popRefKey && this.$refs[popRefKey]?.hide) {
          this.$refs[popRefKey].hide()
        }
      })
    }
  }
}
</script>
