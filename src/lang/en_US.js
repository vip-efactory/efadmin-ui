export default {
  login: {
    title: 'EF-ADMIN System Login',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember me',
    verificationCode: 'Verification code',
    LoggingIn: 'Logging In...'
  },
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    fullScreen: 'Full Screen',
    theme: 'Theme',
    size: 'Global Size',
    switchLang: 'Switch Language',
    projectDocs: 'Project Docs',
    layoutSettings: 'Layout Settings',
    profile: 'Profile',
    logOut: 'Log Out'
  },
  dashboard: { // 首页数据面板部分
    dayFlow: 'Daily  Flow',
    dayIP: 'Daily IP Amount',
    weekFlow: 'Weekly Flow',
    weekIP: 'Weekly IP Amount'
  },
  crud: {
    new: 'New',
    edit: 'Edit',
    delete: 'Delete',
    export: 'Export',
    selectAll: 'Select All',
    search: 'Search',
    resetSearch: 'Reset Search',
    advanceSearch: 'Advance Search',
    confirm: 'OK',
    cancel: 'Cancel',
    submitSuccess: 'Submit success',
    addSuccess: 'Create success',
    editSuccess: 'Edit success',
    delSuccess: 'Delete success',
    exportData: 'Data',
    deleteTips: 'Are you sure you want to delete this data?',
    deleteWarn: 'Warning',
    multiDeleteTipsStart: 'Are you sure you want to delete the selected ',
    multiDeleteTipsEnd: ' data?',
    selectAtLeastOne: 'Please select at least one column'
  },
  // 组件的属性国际化
  // 基础实体BaseEntity的属性字段
  be: {
    id: 'Primary key',
    createTime: 'Creation Time',
    updateTime: 'Update Time',
    creatorNum: 'Founder',
    updaterNum: 'Updater',
    remark: 'Remark',
    operate: 'Operate'
  },
  // 用户管理表
  user: {
    username: 'Username',
    nickName: 'Nickname',
    usercode: 'Usercode',
    sex: 'Sex',
    userAvatar: 'Profile picture',
    email: 'Email',
    phone: 'Phone',
    enabled: 'Status',
    password: 'Password',
    lastPasswordResetTime: 'Last modified password time',
    roles: 'Role',
    job: 'Job',
    dept: 'Department',
    selectDept: 'Select department',
    selectJob: 'Choose department first',
    selectRole: 'Choose a role'
  },
  sex: {
    male: 'Male',
    female: 'Female'
  },
  userAvatar: {
    realName: '真实姓名',
    path: '路径',
    size: '大小'
  },
  role: {
    name: 'name',
    dataScope: 'dataScope',
    level: 'level',
    remark: 'remark',
    permission: 'permission',
    users: 'users',
    menus: 'menus',
    depts: 'depts'
  },
  menu: {
    name: '菜单名称',
    sort: '排序',
    path: '路径',
    component: '组件',
    type: '类型',
    permission: '权限',
    componentName: '组件名',
    icon: '图标',
    cache: '是否缓存',
    hidden: '是否隐藏',
    pid: '上级菜单',
    iFrame: '是否外链',
    roles: '关联角色'
  },
  dept: {
    name: '名称',
    enabled: '是否启用',
    pid: '上级部门',
    roles: '角色'
  },
  job: {
    name: '职位名称',
    sort: '排序',
    enabled: '是否启用',
    dept: '关联部门'
  },
  dict: {
    name: '名称',
    dictDetails: '关联明细'
  },
  dictDetail: {
    label: '字典标签',
    value: '字典值',
    sort: '排序',
    dict: '关联字典'
  },
  employee: {
    name: '姓名',
    idNumber: '身份证号',
    sex: '性别',
    code: '编码',
    avatar: '头像',
    email: '邮箱',
    phone: '电话',
    status: '状态',
    birthday: '生日',
    address: '地址',
    job: '职位',
    dept: '部门'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Display Sidebar Logo',
    menuUniqueOpened: 'Menu Unique Opened'
  }
}
