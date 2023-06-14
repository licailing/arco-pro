import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

interface RoleItem {
  roleId: string;
  roleName: string;
  premits: any[];
}

let i = 3;
let role = [
  {
    roleId: '2',
    roleName: '管理员',
    premits: ['4', '5'],
  },
  {
    roleId: '1',
    roleName: '超级管理员',
    premits: [],
  },
];

function getRoleAll() {
  const list: any[] = [];
  if (role.length) {
    role.forEach((v) => {
      list.push({ roleId: v.roleId, roleName: v.roleName });
    });
  }
  return successResponseWrap(list);
}

function getRole(options: GetParams) {
  const { url } = options;
  const params = qs.parseUrl(url).query as any;

  let dataSource = role;

  if (params.sorter) {
    const s: string[] = params.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.roleName) {
    dataSource = dataSource.filter((menuData) =>
      menuData.roleName.includes(params.roleName || '')
    );
  }
  const result = {
    list: dataSource,
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updateRole(options: GetParams) {
  let { body } = options || {};
  body = body ? JSON.parse(body) || {} : {};
  const { roleId, roleName, premits } = body || ({} as RoleItem);

  if (roleId) {
    role = role.map((item) => {
      if (item.roleId === roleId) {
        return { ...item, roleName, premits };
      }
      return item;
    });
  } else {
    role.unshift({
      roleId: `${i}`,
      roleName,
      premits,
    });
    i += 1;
  }
  return successResponseWrap('ok');
}

function deleteRole(options: GetParams) {
  const { url } = options;
  const params = qs.parseUrl(url).query as any;
  if (!params.ids) {
    return successResponseWrap('ok');
  }
  const ids = params.ids.split(',');
  role = role.filter((item) => ids.indexOf(item.roleId) === -1);
  return successResponseWrap('ok');
}
setupMock({
  setup() {
    Mock.mock(new RegExp('/api/role/list'), getRole);
    Mock.mock(new RegExp('/api/role/all'), getRoleAll);
    Mock.mock(new RegExp('/api/role/update'), updateRole);
    Mock.mock(new RegExp('/api/role/delete'), deleteRole);
  },
});
