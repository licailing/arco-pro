import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';
import localeSearchTable from '@/views/list/search-table/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';
import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';
import localeGroupForm from '@/views/form/group/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'menu.platform': '平台管理',
  'menu.platform.admin': '用户管理',
  'menu.platform.premit': '权限管理',
  'menu.platform.customPremit': '自定义权限管理',
  'menu.platform.role': '角色管理',
  'menu.designer': '低代码设计',
  'menu.designer.index': '设计器',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeSearchTable,
  ...localeBasicProfile,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeGroupForm,
};
