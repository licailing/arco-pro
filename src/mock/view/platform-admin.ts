import { successResponseWrap } from '@/utils/setup-mock';

interface AdminItem {
  uid: string;
  realname: string;
  username: string;
  roleId: string;
  roleName: string;
  status: string;
  password: string;
  repassword: string;
}

let i = 3;
let admins: AdminItem[] = [
  {
    uid: '2',
    username: 'user',
    realname: 'user',
    roleId: '2',
    roleName: '管理员',
    password: '',
    repassword: '',
    status: '1',
  },
  {
    uid: '1',
    username: 'admin',
    realname: 'admin',
    roleId: '1',
    roleName: '超级管理员',
    password: '',
    repassword: '',
    status: '2',
  },
];

function getAdmin({ query }: any) {
  let dataSource = admins;

  if (query.sorter) {
    const s: string[] = query.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (query.uid) {
    dataSource = dataSource.filter((data) =>
      data.uid.includes(query.uid || '')
    );
  }

  if (query.realname) {
    dataSource = dataSource.filter((data) =>
      data.realname.includes(query.realname || '')
    );
  }

  if (query.username) {
    dataSource = dataSource.filter((data) =>
      data.username.includes(query.username || '')
    );
  }

  if (query.roleId) {
    dataSource = dataSource.filter((data) => data.roleId === query.roleId);
  }

  if (query.roleName) {
    dataSource = dataSource.filter((data) =>
      data.roleName.includes(query.roleName || '')
    );
  }

  if (query.status) {
    dataSource = dataSource.filter((data) => data.status === query.status);
  }

  const result = {
    list: dataSource,
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updateAdmin({ body }: any) {
  const { uid, realname, username, roleId, roleName, status } = (body ||
    {}) as AdminItem;

  if (uid) {
    // 编辑
    admins = admins.map((item) => {
      if (item.uid === uid) {
        return {
          ...item,
          username,
          realname,
          uid,
          password: '',
          repassword: '',
          roleId,
          roleName,
          status,
        };
      }
      return item;
    });
  } else {
    // 新增
    admins.unshift({
      uid: `${i}`,
      realname,
      username,
      password: '',
      repassword: '',
      roleId,
      roleName,
      status,
    });
    i += 1;
  }
  return successResponseWrap('ok');
}

function deleteAdmin({ query }: any) {
  if (!query.ids) {
    return successResponseWrap('ok');
  }
  const ids = query.ids.split(',');
  admins = admins.filter((item) => ids.indexOf(item.uid) === -1);
  return successResponseWrap('ok');
}

export default [
  {
    url: '/api/admin/list',
    method: 'get',
    response: getAdmin,
  },
  {
    url: '/api/admin/update',
    method: 'post',
    response: updateAdmin,
  },
  {
    url: '/api/admin/delete',
    method: 'get',
    response: deleteAdmin,
  },
];
