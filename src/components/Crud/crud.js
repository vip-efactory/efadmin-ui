import { download, initData } from '@/api/data'
import { downloadFile, parseTime } from '@/utils/index'
import { reactive } from 'vue'
import i18n from '../../lang'
import { ElNotification } from 'element-plus'

/**
 * CRUD核心配置（Vue3 适配版）
 * @param {Object} options 自定义配置项
 * @return {Object} 响应式CRUD实例
 */
function CRUD(options) {
  // 默认配置（兜底所有属性，避免undefined）
  const defaultOptions = {
    title: '',
    url: '',
    exportUrl: '',
    data: [],
    selections: [],
    query: {},
    params: {},
    showAdSearchBtn: true,
    adSearchFields: [],
    adSearchConditions: [],
    form: {},
    defaultForm: () => ({}),
    sort: ['createTime,desc'],
    time: 50,
    crudMethod: {
      add: (form) => Promise.resolve({ code: 0 }),
      delete: (id) => Promise.resolve({ code: 0 }),
      edit: (form) => Promise.resolve({ code: 0 }),
      get: (id) => Promise.resolve({ code: 0 })
    },
    optShow: {
      add: true,
      edit: true,
      del: true,
      download: true
    },
    props: {},
    queryOnPresenterCreated: true,
    debug: false
  }

  // 深度合并配置（解决嵌套对象未初始化问题）
  const mergeDeep = (target, source) => {
    const result = { ...target }
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = mergeDeep(target[key] || {}, source[key])
        } else {
          result[key] = source[key]
        }
      }
    }
    return result
  }
  options = mergeDeep(defaultOptions, options || {})

  // 初始化响应式核心数据
  const data = reactive({
    ...options,
    dataStatus: {},
    status: {
      add: CRUD.STATUS.NORMAL,
      edit: CRUD.STATUS.NORMAL,
      get cu() {
        if (this.add === CRUD.STATUS.NORMAL && this.edit === CRUD.STATUS.NORMAL) return CRUD.STATUS.NORMAL
        if (this.add === CRUD.STATUS.PREPARED || this.edit === CRUD.STATUS.PREPARED) return CRUD.STATUS.PREPARED
        if (this.add === CRUD.STATUS.PROCESSING || this.edit === CRUD.STATUS.PROCESSING) return CRUD.STATUS.PROCESSING
        throw new Error('wrong crud\'s cu status')
      },
      get title() {
        return this.add > CRUD.STATUS.NORMAL
          ? i18n.global.t('crud.new') + ` ${data.title}`
          : this.edit > CRUD.STATUS.NORMAL
            ? i18n.global.t('crud.edit') + ` ${data.title}`
            : data.title
      }
    },
    msg: {
      submit: i18n.global.t('crud.submitSuccess'),
      add: i18n.global.t('crud.addSuccess'),
      edit: i18n.global.t('crud.editSuccess'),
      del: i18n.global.t('crud.delSuccess')
    },
    page: {
      page: 0,
      size: 10,
      total: 0
    },
    showAdSearchDialog: false,
    loading: true,
    downloadLoading: false,
    delAllLoading: false,
    defaultQuery: JSON.parse(JSON.stringify(options.query || {})),
    vms: Array(4).fill(null),

    // 注册组件实例（增强空值校验）
    registerVM(type, vm, index = -1) {
      if (!vm) return
      const vmObj = { type, vm }
      if (index < 0) {
        this.vms.push(vmObj)
        return
      }
      this.vms.length = Math.max(this.vms.length, index + 1)
      this.vms.splice(index, 1, vmObj)
    },

    // 取消注册组件实例
    unregisterVM(vm) {
      if (!vm) return
      const index = this.vms.findIndex(e => e && e.vm === vm)
      if (index > -1) this.vms.splice(index, 1)
    }
  })

  // 核心方法定义（全量空值校验 + Vue3 适配）
  const methods = {
    // 提示语封装
    submitSuccessNotify() { this.notify(this.msg.submit, CRUD.NOTIFICATION_TYPE.SUCCESS) },
    addSuccessNotify() { this.notify(this.msg.add, CRUD.NOTIFICATION_TYPE.SUCCESS) },
    editSuccessNotify() { this.notify(this.msg.edit, CRUD.NOTIFICATION_TYPE.SUCCESS) },
    delSuccessNotify() { this.notify(this.msg.del, CRUD.NOTIFICATION_TYPE.SUCCESS) },

    // 搜索/刷新
    toQuery() {
      this.page.page = 1
      this.refresh()
    },
    dialogSearch() {
      this.showAdSearchDialog = true
    },
    refresh() {
      if (!callVmHook(this, CRUD.HOOK.beforeRefresh)) return Promise.reject('beforeRefresh rejected')
      return new Promise((resolve, reject) => {
        this.loading = true
        const method = this.adSearchConditions?.length > 0 ? 'post' : 'get'
        initData(this.url, this.getQueryParams(), method).then(r => {
          this.loading = false
          if (r.code === 0) {
            const resData = r.data || {}
            this.page.total = resData.totalElements || resData.totalCount || 0
            this.data = resData.content || []
            this.resetDataStatus()
            setTimeout(() => callVmHook(this, CRUD.HOOK.afterRefresh), this.time)
            resolve(resData)
          } else {
            this.notify(r.msg || i18n.global.t('common.requestFail'), CRUD.NOTIFICATION_TYPE.ERROR)
            reject(r)
          }
        }).catch(err => {
          this.loading = false
          this.notify(i18n.global.t('common.networkError'), CRUD.NOTIFICATION_TYPE.ERROR)
          reject(err)
        })
      })
    },

    // 新增/编辑/删除 操作
    toAdd() {
      if (!(callVmHook(this, CRUD.HOOK.beforeToAdd, this.form) && callVmHook(this, CRUD.HOOK.beforeToCU, this.form))) return
      this.resetForm()
      this.status.add = CRUD.STATUS.PREPARED
      callVmHook(this, CRUD.HOOK.afterToAdd, this.form)
      callVmHook(this, CRUD.HOOK.afterToCU, this.form)
    },
    toEdit(data) {
      if (!data?.id) return
      // 【改动】先重置表单，再执行钩子
      this.resetForm(JSON.parse(JSON.stringify(data)))
      if (!(callVmHook(this, CRUD.HOOK.beforeToEdit, this.form) && callVmHook(this, CRUD.HOOK.beforeToCU, this.form))) return
      this.status.edit = CRUD.STATUS.PREPARED
      const dataStatus = this.getDataStatus(data.id)
      dataStatus.edit = CRUD.STATUS.PREPARED
      callVmHook(this, CRUD.HOOK.afterToEdit, this.form)
      callVmHook(this, CRUD.HOOK.afterToCU, this.form)
    },
    toDelete(data) {
      if (!data?.id) return
      const dataStatus = this.getDataStatus(data.id)
      dataStatus.delete = CRUD.STATUS.PREPARED
    },
    cancelDelete(data) {
      if (!data?.id || !callVmHook(this, CRUD.HOOK.beforeDeleteCancel, data)) return
      const dataStatus = this.getDataStatus(data.id)
      dataStatus.delete = CRUD.STATUS.NORMAL
      callVmHook(this, CRUD.HOOK.afterDeleteCancel, data)
    },
    cancelCU() {
      const addStatus = this.status.add
      const editStatus = this.status.edit
      const formVm = this.findVM('form')

      // 取消新增
      if (addStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(this, CRUD.HOOK.beforeAddCancel, this.form)) return
        this.status.add = CRUD.STATUS.NORMAL
      }

      // 取消编辑
      if (editStatus === CRUD.STATUS.PREPARED) {
        if (!callVmHook(this, CRUD.HOOK.beforeEditCancel, this.form)) return
        this.status.edit = CRUD.STATUS.NORMAL
        const dataStatus = this.getDataStatus(this.form?.id)
        dataStatus.edit = CRUD.STATUS.NORMAL
      }

      // 重置表单 + 清除验证
      this.resetForm()
      if (formVm?.$refs?.form) formVm.$refs.form.clearValidate?.()

      // 触发钩子
      if (addStatus === CRUD.STATUS.PREPARED) callVmHook(this, CRUD.HOOK.afterAddCancel, this.form)
      if (editStatus === CRUD.STATUS.PREPARED) callVmHook(this, CRUD.HOOK.afterEditCancel, this.form)
    },

    // 提交新增/编辑
    submitCU() {
      if (!callVmHook(this, CRUD.HOOK.beforeValidateCU)) return
      const formVm = this.findVM('form')
      if (!formVm?.$refs?.form) {
        this.notify(i18n.global.t('common.formNotFound'), CRUD.NOTIFICATION_TYPE.ERROR)
        return
      }
      formVm.$refs.form.validate((valid) => {
        if (!valid) return
        if (!callVmHook(this, CRUD.HOOK.afterValidateCU)) return
        this.status.add === CRUD.STATUS.PREPARED ? this.doAdd() : this.doEdit()
      })
    },
    doAdd() {
      if (!callVmHook(this, CRUD.HOOK.beforeSubmit)) return
      this.crudMethod.add(this.form).then(r => {
        if (r.code === 0) {
          this.status.add = CRUD.STATUS.NORMAL
          this.resetForm()
          this.addSuccessNotify()
          callVmHook(this, CRUD.HOOK.afterSubmit)
          this.toQuery()
        } else if (r.code === 1020400) {
          Object.keys(r.data || {}).forEach(key => this.notify(r.data[key], CRUD.NOTIFICATION_TYPE.ERROR))
        } else {
          this.notify(r.msg || i18n.global.t('crud.addFail'), CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => callVmHook(this, CRUD.HOOK.afterAddError))
    },
    doEdit() {
      if (!callVmHook(this, CRUD.HOOK.beforeSubmit)) return
      this.crudMethod.edit(this.form).then(r => {
        if (r.code === 0) {
          this.status.edit = CRUD.STATUS.NORMAL
          const dataStatus = this.getDataStatus(this.form?.id)
          dataStatus.edit = CRUD.STATUS.NORMAL
          this.editSuccessNotify()
          this.resetForm()
          callVmHook(this, CRUD.HOOK.afterSubmit)
          this.refresh()
        } else if (r.code === 1020400) {
          Object.keys(r.data || {}).forEach(key => this.notify(r.data[key], CRUD.NOTIFICATION_TYPE.ERROR))
        } else {
          this.notify(r.msg || i18n.global.t('crud.editFail'), CRUD.NOTIFICATION_TYPE.ERROR)
        }
      }).catch(() => callVmHook(this, CRUD.HOOK.afterEditError))
    },
    doDelete(data) {
      if (!data) return Promise.reject('data is empty')
      // 修复ESLint：拆分let声明 + ids改const
      let delAll = false
      let dataStatus
      const ids = []

      if (Array.isArray(data)) {
        delAll = true
        data.forEach(val => val.id && ids.push(val.id))
      } else {
        if (!data.id) return Promise.reject('id is empty')
        ids.push(data.id)
        dataStatus = this.getDataStatus(data.id)
      }
      if (ids.length === 0) {
        this.notify(i18n.global.t('crud.noDeleteData'), CRUD.NOTIFICATION_TYPE.WARNING)
        return Promise.reject('ids is empty')
      }
      if (!callVmHook(this, CRUD.HOOK.beforeDelete, data)) return Promise.reject('beforeDelete rejected')

      // 执行删除
      if (!delAll && dataStatus) dataStatus.delete = CRUD.STATUS.PROCESSING
      if (delAll) this.delAllLoading = true
      return this.crudMethod.del(ids).then(r => {
        if (r.code === 0) {
          delAll ? this.delAllLoading = false : dataStatus.delete = CRUD.STATUS.PREPARED
          this.dleChangePage(1)
          this.delSuccessNotify()
          callVmHook(this, CRUD.HOOK.afterDelete, data)
          this.refresh()
        } else {
          this.notify(r.msg || i18n.global.t('crud.deleteFail'), CRUD.NOTIFICATION_TYPE.ERROR)
          delAll ? this.delAllLoading = false : dataStatus.delete = CRUD.STATUS.PREPARED
        }
        return r
      }).catch(() => {
        delAll ? this.delAllLoading = false : dataStatus.delete = CRUD.STATUS.PREPARED
        return Promise.reject('delete failed')
      })
    },

    // 导出
    doExport() {
      this.downloadLoading = true
      download(this.exportUrl, this.getQueryParams()).then(result => {
        downloadFile(result, this.title + i18n.global.t('crud.exportData'), 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
        this.notify(i18n.global.t('crud.exportFail'), CRUD.NOTIFICATION_TYPE.ERROR)
      })
    },

    // 分页/排序/查询参数
    getQueryParams() {
      return {
        page: this.page.page - 1,
        size: this.page.size,
        conditions: this.adSearchConditions || [],
        sort: this.sort || [],
        ...this.query,
        ...this.params
      }
    },
    pageChangeHandler(e) {
      this.page.page = e
      this.refresh()
    },
    sizeChangeHandler(e) {
      this.page.size = e
      this.page.page = 1
      this.refresh()
    },
    dleChangePage(size = 1) {
      if (this.data?.length === size && this.page.page !== 1) {
        this.page.page -= 1
      }
    },
    selectionChangeHandler(val) {
      this.selections = val || []
    },
    removeArrayItem(array, val) {
      if (!Array.isArray(array)) return
      const index = array.indexOf(val)
      index > -1 && array.splice(index, 1)
    },
    doTitleOrder(column) {
      this.sort = []
      if (column?.order) {
        this.sort.push(column.prop + (column.order.includes('descending') ? ',desc' : ',asc'))
      }
      this.page.page = 1
      this.refresh()
    },

    // 重置查询/表单
    resetQuery(toQuery = true) {
      const defaultQuery = JSON.parse(JSON.stringify(this.defaultQuery || {}))
      this.params = {}
      this.adSearchConditions = []
      // 修复ESLint：箭头函数加{}，避免返回赋值
      Object.keys(this.query || {}).forEach(key => {
        this.query[key] = defaultQuery[key]
      })
      toQuery && this.toQuery()
    },
    resetForm(data) {
      const formData = data || (typeof this.defaultForm === 'function' ? this.defaultForm() : this.defaultForm || {})
      // Vue3 reactive 对象直接赋值（无需 vueSet）
      Object.keys(this.form).forEach(key => delete this.form[key])
      Object.assign(this.form, formData)
      // 【核心改动】强制兜底 dept 和 job
      this.form.dept = this.form.dept || { id: null }
      this.form.job = this.form.job || { id: null }
    },

    // 数据状态管理
    resetDataStatus() {
      const dataStatus = {}
      const resetStatus = (datas) => {
        if (!Array.isArray(datas)) return
        datas.forEach(e => {
          if (e?.id) {
            dataStatus[e.id] = { delete: CRUD.STATUS.NORMAL, edit: CRUD.STATUS.NORMAL }
            e.children && resetStatus(e.children)
          }
        })
      }
      resetStatus(this.data)
      this.dataStatus = dataStatus
    },
    getDataStatus(id) {
      return this.dataStatus?.[id] || { delete: CRUD.STATUS.NORMAL, edit: CRUD.STATUS.NORMAL }
    },

    // 树形表格选中逻辑
    selectAllChange(selection) {
      const presenterVm = this.findVM('presenter')
      if (!presenterVm?.$refs?.table) return
      if (selection?.length === (this.data?.length || 0)) {
        selection.forEach(val => this.selectChange(selection, val))
      } else {
        presenterVm.$refs.table.clearSelection()
      }
    },
    selectChange(selection, row) {
      if (!row || !selection) return
      const presenterVm = this.findVM('presenter')
      if (!presenterVm?.$refs?.table) return
      const isSelected = selection.findIndex(val => val?.id === row.id) > -1
      if (isSelected) {
        const recursiveSelect = (parentRow) => {
          if (!parentRow?.children) return
          parentRow.children.forEach(val => {
            if (!val?.id) return
            presenterVm.$refs.table.toggleRowSelection(val, true)
            !selection.find(item => item.id === val.id) && selection.push(val)
            recursiveSelect(val)
          })
        }
        recursiveSelect(row)
      } else {
        this.toggleRowSelection(selection, row)
      }
    },
    toggleRowSelection(selection, data) {
      if (!data) return
      const presenterVm = this.findVM('presenter')
      if (!presenterVm?.$refs?.table) return
      const recursiveUnselect = (parentData) => {
        if (!parentData?.children) return
        parentData.children.forEach(val => {
          if (!val?.id) return
          presenterVm.$refs.table.toggleRowSelection(val, false)
          const idx = selection.findIndex(item => item.id === val.id)
          idx > -1 && selection.splice(idx, 1)
          recursiveUnselect(val)
        })
      }
      recursiveUnselect(data)
    },

    // 辅助方法
    findVM(type) {
      if (!this.vms || !Array.isArray(this.vms)) return null
      return this.vms.find(vm => vm?.type === type)?.vm || null
    },
    notify(title, type = CRUD.NOTIFICATION_TYPE.INFO) {
      ElNotification({
        title: title || i18n.global.t('common.tip'),
        type: ['success', 'warning', 'info', 'error'].includes(type) ? type : 'info',
        duration: 2500
      })
    },
    updateProp(name, value) {
      if (!name) return
      if (!this.props) this.props = {}
      this.props[name] = value // Vue3 直接赋值响应式
    }
  }

  // 绑定方法到响应式对象（确保this指向CRUD实例）
  Object.keys(methods).forEach(key => {
    data[key] = methods[key].bind(data)
  })

  return data
}

// 钩子调用工具函数
function callVmHook(crud, hook) {
  if (!crud || !hook) return true
  if (crud.debug) console.log('callVmHook: ' + hook)
  let ret = true
  const nargs = [crud, ...Array.from(arguments).slice(2)]
  const vmSet = new Set()
  crud.vms?.forEach(vm => vm?.vm && vmSet.add(vm.vm))
  vmSet.forEach(vm => {
    if (vm && typeof vm[hook] === 'function') {
      ret = vm[hook].apply(vm, nargs) !== false && ret
    }
  })
  return ret
}

// crud.js 中的 presenter 函数
function presenter(crudInstance) {
  if (!crudInstance) {
    console.error('presenter 必须传入 CRUD 实例')
    return {}
  }
  function obColumns(columns) {
    return {
      visible(col) {
        return !columns || !columns[col] ? true : columns[col].visible
      }
    }
  }
  return {
    // 关键修改：直接把 crudInstance 作为组件的 data 属性（不再用 inject）
    data() {
      return {
        crud: crudInstance, // 直接挂载传入的 CRUD 实例到组件
        searchToggle: true,
        columns: obColumns({})
      }
    },
    // 提供给子组件的依赖（保持不变）
    provide() {
      return {
        crud: crudInstance,
        'crud.query': crudInstance.query,
        'crud.page': crudInstance.page,
        'crud.form': crudInstance.form
      }
    },
    methods: { parseTime },
    created() {
      // 现在 this.crud 就是有效的 crudInstance，无需判空
      this.crud.registerVM('presenter', this, 0)
      this.crud.queryOnPresenterCreated && this.crud.toQuery()
    },
    beforeUnmount() {
      this.crud?.unregisterVM(this)
    },
    mounted() {
      this.$nextTick(() => {
        if (!this.$refs?.table || !this.crud) return
        const columns = {}
        this.$refs.table.columns?.forEach(e => {
          if (e?.property && e.type === 'default') {
            columns[e.property] = { label: e.label, visible: true }
          }
        })
        this.columns = obColumns(columns)
        this.crud.updateProp('tableColumns', columns)
      })
    }
  }
}

// 组件配置：Header（头部）
function header() {
  return {
    inject: {
      crud: { from: 'crud', default: () => null },
      query: { from: 'crud.query', default: () => ({}) }
    },
    created() {
      this.crud?.registerVM('header', this, 1)
    },
    beforeUnmount() {
      this.crud?.unregisterVM(this)
    }
  }
}

// 组件配置：Pagination（分页）
function pagination() {
  return {
    inject: {
      crud: { from: 'crud', default: () => null },
      page: { from: 'crud.page', default: () => ({ page: 1, size: 10, total: 0 }) }
    },
    created() {
      this.crud?.registerVM('pagination', this, 2)
    },
    beforeUnmount() {
      this.crud?.unregisterVM(this)
    }
  }
}

// 组件配置：Form（表单）- 修复后
function form(defaultForm) {
  return {
    inject: {
      crud: { from: 'crud', default: () => null },
      form: { from: 'crud.form', default: () => ({}) }
    },
    created() {
      if (this.crud) {
        this.crud.registerVM('form', this, 3)
        // 修复：强制转为函数，避免引用共享
        this.crud.defaultForm = typeof defaultForm === 'function' ? defaultForm : () => ({ ...defaultForm })
        this.crud.resetForm()
        // 兜底 form.dept 和 form.job
        if (!this.form.dept) this.form.dept = { id: null }
        if (!this.form.job) this.form.job = { id: null }
      }
    },
    beforeUnmount() {
      this.crud?.unregisterVM(this)
    }
  }
}

// 组件配置：通用CRUD
function crudExt(options = {}) {
  const opts = { ...{ type: undefined }, ...options }
  return {
    inject: { crud: { from: 'crud', default: () => null }},
    created() {
      this.crud?.registerVM(opts.type, this)
    },
    beforeUnmount() {
      this.crud?.unregisterVM(this)
    }
  }
}

// 常量定义
CRUD.HOOK = {
  beforeRefresh: 'beforeCrudRefresh',
  afterRefresh: 'afterCrudRefresh',
  beforeDelete: 'beforeCrudDelete',
  afterDelete: 'afterCrudDelete',
  beforeDeleteCancel: 'beforeCrudDeleteCancel',
  afterDeleteCancel: 'afterCrudDeleteCancel',
  beforeToAdd: 'beforeCrudToAdd',
  afterToAdd: 'afterCrudToAdd',
  beforeToEdit: 'beforeCrudToEdit',
  afterToEdit: 'afterCrudToEdit',
  beforeToCU: 'beforeCrudToCU',
  afterToCU: 'afterCrudToCU',
  beforeValidateCU: 'beforeCrudValidateCU',
  afterValidateCU: 'afterCrudValidateCU',
  beforeAddCancel: 'beforeCrudAddCancel',
  afterAddCancel: 'afterCrudAddCancel',
  beforeEditCancel: 'beforeCrudEditCancel',
  afterEditCancel: 'afterCrudEditCancel',
  beforeSubmit: 'beforeCrudSubmitCU',
  afterSubmit: 'afterCrudSubmitCU',
  afterAddError: 'afterCrudAddError',
  afterEditError: 'afterCrudEditError'
}

CRUD.STATUS = { NORMAL: 0, PREPARED: 1, PROCESSING: 2 }
CRUD.NOTIFICATION_TYPE = { SUCCESS: 'success', WARNING: 'warning', INFO: 'info', ERROR: 'error' }

// 导出
export default CRUD
export { presenter, header, form, pagination, crudExt as crud }
