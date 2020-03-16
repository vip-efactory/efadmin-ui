<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" :placeholder="$t('menu.searchPlaceholder')" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          :start-placeholder="$t('common.startTime')"
          :end-placeholder="$t('common.endTime')"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表单渲染-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="670px">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="120px">
        <el-form-item :label="$t('menu.type')" prop="type">
          <el-radio-group v-model="form.type" size="mini" style="width: 300px">
            <el-radio-button label="0">{{ $t('menuType.dir') }}</el-radio-button>
            <el-radio-button label="1">{{ $t('menuType.menu') }}</el-radio-button>
            <el-radio-button label="2">{{ $t('menuType.button') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" :label="$t('menu.icon')" prop="icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 450px;" :placeholder="$t('menu.iconPlaceholder')" readonly>
              <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" :label="$t('menu.iFrame')" prop="iframe">
          <el-radio-group v-model="form.iframe" size="mini">
            <el-radio-button label="true">{{ $t('bool.true') }}</el-radio-button>
            <el-radio-button label="false">{{ $t('bool.false') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '1'" :label="$t('menu.cache')" prop="cache">
          <el-radio-group v-model="form.cache" size="mini">
            <el-radio-button label="true">{{ $t('bool.true') }}</el-radio-button>
            <el-radio-button label="false">{{ $t('bool.false') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" :label="$t('menu.hidden')" prop="hidden">
          <el-radio-group v-model="form.hidden" size="mini">
            <el-radio-button label="false">{{ $t('bool.true') }}</el-radio-button>
            <el-radio-button label="true">{{ $t('bool.false') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '2'" :label="$t('menuType.menuTitle')" prop="name">
          <el-input v-model="form.name" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" :placeholder="$t('menuType.menuTitle')" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() === '2'" :label="$t('menuType.btnName')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('menuType.btnName')" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-show="form.type.toString() !== '0'" :label="$t('menu.permission')" prop="permission">
          <el-input v-model="form.permission" :disabled="form.iframe" :placeholder="$t('menu.permission')" style="width: 178px;" />
        </el-form-item>
        <el-form-item v-if="form.type.toString() !== '2'" :label="$t('menu.path')" prop="path">
          <el-input v-model="form.path" :placeholder="$t('menu.path')" style="width: 178px;" />
        </el-form-item>
        <el-form-item :label="$t('menu.sort')" prop="sort">
          <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 140px;" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" :label="$t('menu.componentName')" prop="componentName">
          <el-input v-model="form.componentName" style="width: 178px;" :placeholder="$t('menu.componentNamePlaceholder')" />
        </el-form-item>
        <el-form-item v-show="!form.iframe && form.type.toString() === '1'" :label="$t('menu.component')" prop="component">
          <el-input v-model="form.component" style="width: 178px;" :placeholder="$t('menu.componentPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('menu.pid')" prop="pid">
          <treeselect v-model="form.pid" :options="menus" style="width: 450px;" :placeholder="$t('menu.pidPlaceholder')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">{{ $t('crud.cancel') }}</el-button>
        <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">{{ $t('crud.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" @select="crud.selectChange" @select-all="crud.selectAllChange" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" :show-overflow-tooltip="true" :label="$t('menu.name')" width="125px" prop="name" />
      <el-table-column v-if="columns.visible('icon')" prop="icon" :label="$t('menu.icon')" align="center" width="60px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('sort')" prop="sort" align="center" :label="$t('menu.sort')">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('path')" :show-overflow-tooltip="true" prop="path" :label="$t('menu.path')" />
      <el-table-column v-if="columns.visible('permission')" :show-overflow-tooltip="true" prop="permission" :label="$t('menu.permission')" />
      <el-table-column v-if="columns.visible('component')" :show-overflow-tooltip="true" prop="component" :label="$t('menu.component')" />
      <el-table-column v-if="columns.visible('iframe')" prop="iframe" :label="$t('menu.iFrame')" width="75px">
        <template slot-scope="scope">
          <!--若为true,显示对号-->
          <i v-if="scope.row.iframe" class="el-icon-check" />
          <!--          <span v-if="scope.row.iframe">{{ $t('bool.true') }}</span>-->
          <!--          <span v-else>{{ $t('bool.false') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('cache')" prop="cache" :label="$t('menu.cache')" width="75px">
        <template slot-scope="scope">
          <!--若为true,显示对号-->
          <i v-if="scope.row.cache" class="el-icon-check" />
          <!--          <span v-if="scope.row.cache">{{ $t('bool.true') }}</span>-->
          <!--          <span v-else>{{ $t('bool.false') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('hidden')" prop="hidden" :label="$t('menu.hidden')" width="75px">
        <template slot-scope="scope">
          <!--若为true,显示对号-->
          <i v-if="scope.row.hidden" />
          <i v-else class="el-icon-check" />
          <!--          <span v-if="scope.row.hidden">{{ $t('bool.false') }}</span>-->
          <!--          <span v-else>{{ $t('bool.true') }}</span>-->
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" :label="$t('be.createTime')" width="135px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-permission="['admin','menu:edit','menu:del']" :label="$t('be.operate')" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import i18n from '../../../lang'

// crud交由presenter持有
const adSearchFields = new Map([['name', i18n.t('menu.name')], ['sort', i18n.t('menu.sort')], ['path', i18n.t('menu.path')], ['permission', i18n.t('menu.permission')], ['component', i18n.t('menu.component')], ['createTime', i18n.t('be.createTime')]]) // 需要高级搜索的字段
const defaultCrud = CRUD({ title: i18n.t('menu.TITLE'), url: 'api/menus/all', crudMethod: { ...crudMenu }, adSearchFields: adSearchFields })
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
          { required: true, message: i18n.t('menu.nameRequired'), trigger: 'blur' }
        ],
        path: [
          { required: true, message: i18n.t('menu.pathRequired'), trigger: 'blur' }
        ]
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
      this.form.icon = name
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
