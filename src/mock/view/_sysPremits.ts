// 菜单配置文件
const premitConfig = [
  {
    moduleName: '/platform',
    moduleDesc: '平台管理',
    moduleType: 'menu',
    actions: {
      '/premit': '权限管理',
      '/role': '角色管理',
      '/admin': '成员管理',
    },
  },
  {
    moduleName: '/dragAdjustPrice',
    moduleDesc: '药库系统',
    moduleType: 'menu',
    actions: {
      '/list': '药品调价',
      '/edit': '药品调价编辑',
    },
  },
  {
    moduleName: 'upload',
    moduleDesc: '上传图片',
    moduleType: 'module',
    actions: {
      uploadImg: '富文本编辑器添加图片',
      uploadImage: '上传图片',
    },
  },
  {
    moduleName: 'premit',
    moduleDesc: '权限管理',
    moduleType: 'module',
    actions: {
      index: '列表',
      generate: '生成平台默认权限',
    },
  },
  {
    moduleName: 'role',
    moduleDesc: '角色管理',
    moduleType: 'module',
    actions: {
      add: '添加',
      update: '修改',
      index: '列表',
    },
  },
  {
    moduleName: 'admin',
    moduleDesc: '用户管理',
    moduleType: 'module',
    actions: {
      add: '添加',
      update: '修改',
      delete: '删除',
      listDetail: '添加/修改视图',
      view: '查看',
      index: '列表',
    },
  },
];

export default premitConfig;
