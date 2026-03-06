<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud?.props?.searchToggle">  <!-- 用可选链防护空值 -->
        <!-- 搜索 -->
        <el-input
          v-model="crud.query.blurry"
          clearable
          size="small"
          :placeholder="$t('menu.searchPlaceholder')"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter="crud.toQuery"
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
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单渲染-->
    <el-dialog
      v-model="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :before-close="() => crud?.cancelCU()"
      :title="crud?.status?.title"
      width="670px"
    >
      <el-form ref="form" :inline="true" :model="crud.form" :rules="rules" size="small" label-width="120px">
        <el-form-item :label="$t('menu.type')" prop="type">
          <el-radio-group v-model="crud.form.type" size="small" style="width: 300px">
            <el-radio-button :value="0">{{ $t('menuType.dir') }}</el-radio-button>
            <el-radio-button :value="1">{{ $t('menuType.menu') }}</el-radio-button>
            <el-radio-button :value="2">{{ $t('menuType.button') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="crud.form.type !== 2" :label="$t('menu.icon')" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <template #reference>
              <el-input v-model="crud.form.icon" style="width: 450px;" :placeholder="$t('menu.iconPlaceholder')" readonly>
                <template #prefix>
                  <svg-icon v-if="crud.form.icon" :icon-class="crud.form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                  <i v-else class="el-icon-search el-input__icon" />
                </template>
              </el-input>
            </template>
          </el-popover>
        </el-form-item>
        <!-- 已修复：是否外链 - 布尔值label -->
        <el-form-item v-show="crud.form.type !== 2" :label="$t('menu.iFrame')" prop="iframe">
          <el-radio-group v-model="crud.form.iframe" size="small">
            <el-radio-button :value="true">{{ $t('bool.true') }}</el-radio-button>
            <el-radio-button :value="false">{{ $t('bool.false') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 已修复：是否缓存 - 布尔值label -->
        <el-form-item v-show="crud.form.type === 1" :label="$t('menu.cache')" prop="cache">
          <el-radio-group v-model="crud.form.cache" size="small">
            <el-radio-button :value="true">{{ $t('bool.true') }}</el-radio-button>
            <el-radio-button :value="false">{{ $t('bool.false') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 已修复：是否可见 - 布尔值label -->
        <el-form-item v-show="crud.form.type !== 2" :label="$t('menu.hidden')" prop="hidden">
          <el-radio-group v-model="crud.form.hidden" size="small">
            <el-radio-button :value="false">{{ $t('bool.true') }}</el-radio-button>
            <el-radio-button :value="true">{{ $t('bool.false') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="crud.form.type !== 2" :label="$t('menuType.menuTitle')" prop="name">
          <el-input v-model="crud.form.name" :style="crud.form.type === 0 ? 'width: 450px' : 'width: 178px'" :placeholder="$t('menuType.menuTitle')" />
        </el-form-item>
        <el-form-item v-show="crud.form.type === 2" :label="$t('menuType.btnName')" prop="name">
          <el-input v-model="crud.form.name" :placeholder="$t('menuType.btnName')" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="crud.form.type !== 0" :label="$t('menu.permission')" prop="permission">
          <el-input v-model="crud.form.permission" :disabled="crud.form.iframe" :placeholder="$t('menu.permission')" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="crud.form.type !== 2" :label="$t('menu.path')" prop="path">
          <el-input v-model="crud.form.path" :placeholder="$t('menu.path')" style="width: 178px;" />
        </el-form-item>
        <el-form-item :label="$t('menu.sort')" prop="sort">
          <el-input-number v-model.number="crud.form.sort" :min="0" :max="999" controls-position="right" style="width: 140px;" />
        </el-form-item>
        <el-form-item v-show="!crud.form.iframe && crud.form.type === 1" :label="$t('menu.componentName')" prop="componentName">
          <el-input v-model="crud.form.componentName" style="width: 178px;" :placeholder="$t('menu.componentNamePlaceholder')" />
        </el-form-item>
        <el-form-item v-show="!crud.form.iframe && crud.form.type === 1" :label="$t('menu.component')" prop="component">
          <el-input v-model="crud.form.component" style="width: 178px;" :placeholder="$t('menu.componentPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('menu.pid')" prop="pid">
          <treeselect v-model="crud.form.pid" :options="menus" style="width: 450px;" :placeholder="$t('menu.pidPlaceholder')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button link @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud?.loading"
      :data="crud?.data"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
      @select="crud?.selectChange"
      @select-all="crud?.selectAllChange"
      @selection-change="crud?.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" :show-overflow-tooltip="true" :label="$t('menu.name')" width="125px" prop="name" />
      <el-table-column v-if="columns.visible('icon')" prop="icon" :label="$t('menu.icon')" align="center" width="60px">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('sort')" prop="sort" align="center" :label="$t('menu.sort')">
        <template #default="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('path')" :show-overflow-tooltip="true" prop="path" :label="$t('menu.path')" />
      <el-table-column v-if="columns.visible('permission')" :show-overflow-tooltip="true" prop="permission" :label="$t('menu.permission')" />
      <el-table-column v-if="columns.visible('component')" :show-overflow-tooltip="true" prop="component" :label="$t('menu.component')" />
      <el-table-column v-if="columns.visible('iframe')" prop="iframe" :label="$t('menu.iFrame')" width="75px">
        <template #default="scope">
          <template v-if="scope.row.iframe">
            <div style="display: flex;align-items: center;justify-content: center">
              <el-icon><Check /></el-icon>
            </div>
          </template>
          <template v-else>
            <div style="display: flex;align-items: center;justify-content: center">
              <el-icon><Close /></el-icon>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('cache')" prop="cache" :label="$t('menu.cache')" width="75px">
        <template #default="scope">
          <template v-if="!scope.row.cache">
            <div style="display: flex;align-items: center;justify-content: center">
              <el-icon><Close /></el-icon>
            </div>
          </template>
          <template v-else>
            <div style="display: flex;align-items: center;justify-content: center">
              <el-icon><Check /></el-icon>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('hidden')" prop="hidden" :label="$t('menu.hidden')" width="75px">
        <template #default="scope">
          <template v-if="!scope.row.hidden">
            <div style="display: flex;align-items: center;justify-content: center">
              <el-icon><Check /></el-icon>
            </div>
          </template>
          <template v-else>
            <div style="display: flex;align-items: center;justify-content: center">
              <el-icon><Close /></el-icon>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" width="135px">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','menu:edit','menu:del']" :label="$t('be.operate')" width="130px" align="center" fixed="right">
        <template #default="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :msg="$t('menu.deleteWarn')"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudMenu from '@/api/system/menu'
import IconSelect from '@/components/IconSelect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import i18n from '../../../lang'

const adSearchFields = [{ fieldName: 'name', labelName: i18n.global.t('menu.name') }, { fieldName: 'sort', labelName: i18n.global.t('menu.sort'), type: 'number' }, { fieldName: 'path', labelName: i18n.global.t('menu.path') }, { fieldName: 'permission', labelName: i18n.global.t('menu.permission') }, { fieldName: 'component', labelName: i18n.global.t('menu.component') }, { fieldName: 'createTime', labelName: i18n.global.t('be.createTime'), type: 'datetime' }]
const defaultCrud = CRUD({ title: i18n.global.t('menu.TITLE'), url: 'api/menus/all', exportUrl: 'api/menus/download', crudMethod: { ...crudMenu }, adSearchFields: adSearchFields })
const defaultForm = { id: null, name: null, sort: 999, path: null, component: null, componentName: null, iframe: false, roles: [], pid: 0, icon: null, cache: false, hidden: false, type: 0, permission: null }
export default {
  name: 'Menu',
  components: { Treeselect, IconSelect, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      menus: [],
      permission: {
        add: ['admin', 'menu:add'],
        edit: ['admin', 'menu:edit'],
        del: ['admin', 'menu:del']
      },
      rules: {
        name: [
          { required: true, message: i18n.global.t('menu.nameRequired'), trigger: 'blur' }
        ],
        path: [
          { required: true, message: i18n.global.t('menu.pathRequired'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        // 用可选链防护：crud、status存在时才判断cu，否则返回false
        return this.crud?.status?.cu > 0 ?? false
      },
      set(newVal) {
        // 仅当newVal为false，且crud、status存在时，才修改cu的值
        if (!newVal && this.crud?.status) {
          this.crud.status.add = CRUD.STATUS.NORMAL
          this.crud.status.edit = CRUD.STATUS.NORMAL
        }
      }
    }
  },
  methods: {
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      crudMenu.getMenusTree().then(res => {
        if (res.code === 0) {
          this.menus = []
          const menu = { id: 0, label: '顶级类目', children: [] }
          menu.children = res.data
          this.menus.push(menu)
        } else {
          crud.notify(res.msg, CRUD.NOTIFICATION_TYPE.ERROR)
        }
      })
    },
    // 选中图标
    selected(name) {
      this.crud.form.icon = name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
