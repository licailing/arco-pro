import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FORM: AppRouteRecordRaw = {
  path: '/designer',
  name: 'designer',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.designer',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 3,
  },
  children: [
    {
      path: 'index',
      name: 'Designer',
      component: () => import('@/views/designer/index/index.vue'),
      meta: {
        locale: 'menu.designer.index',
        requiresAuth: true,
        roles: ['admin'],
      },
    },
  ],
};

export default FORM;
