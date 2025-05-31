import Mock from 'mockjs';
import { successResponseWrap } from '@/utils/setup-mock';
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

function getRole({ query }: any) {
  let dataSource = role;

  if (query.sorter) {
    const s: string[] = query.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (query.roleName) {
    dataSource = dataSource.filter((menuData) =>
      menuData.roleName.includes(query.roleName || '')
    );
  }
  const result = {
    list: dataSource,
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updateRole({ body }: any) {
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

function deleteRole({ query }: any) {
  if (!query.ids) {
    return successResponseWrap('ok');
  }
  const ids = query.ids.split(',');
  role = role.filter((item) => ids.indexOf(item.roleId) === -1);
  return successResponseWrap('ok');
}

export default [
  {
    url: '/api/role/list',
    method: 'get',
    response: getRole,
  },
  {
    url: '/api/role/all',
    method: 'get',
    response: getRoleAll,
  },
  {
    url: '/api/role/update',
    method: 'post',
    response: updateRole,
  },
  {
    url: '/api/role/delete',
    method: 'get',
    response: deleteRole,
  },
];
