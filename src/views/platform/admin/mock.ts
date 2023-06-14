// eslint-disable-next-line import/no-extraneous-dependencies
import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

interface AdminItem {
  uid: string;
  realname: string;
  username: string;
  roleId: string;
  roleName: string;
  status: number;
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
    status: 1,
  },
  {
    uid: '1',
    username: 'admin',
    realname: 'admin',
    roleId: '1',
    roleName: '超级管理员',
    password: '',
    repassword: '',
    status: 2,
  },
];

function getAdmin(options: GetParams) {
  const { url } = options;

  const params = qs.parseUrl(url).query as any;

  let dataSource = admins;

  if (params.sorter) {
    const s: string[] = params.sorter.split('.');
    dataSource = dataSource.sort((prev: any, next: any) => {
      if (s[1] === 'desc') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.uid) {
    dataSource = dataSource.filter((data) =>
      data.uid.includes(params.uid || '')
    );
  }

  if (params.realname) {
    dataSource = dataSource.filter((data) =>
      data.realname.includes(params.realname || '')
    );
  }

  if (params.username) {
    dataSource = dataSource.filter((data) =>
      data.username.includes(params.username || '')
    );
  }

  if (params.roleId) {
    dataSource = dataSource.filter((data) => data.roleId === params.roleId);
  }

  if (params.roleName) {
    dataSource = dataSource.filter((data) =>
      data.roleName.includes(params.roleName || '')
    );
  }

  if (params.status) {
    dataSource = dataSource.filter((data) => data.status === params.status);
  }

  const result = {
    list: dataSource,
    total: dataSource.length,
  };

  return successResponseWrap(result);
}

function updateAdmin(options: GetParams) {
  let { body } = options;
  body = body ? JSON.parse(body) || {} : {};
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

function deleteAdmin(options: GetParams) {
  const { url } = options;
  const params = qs.parseUrl(url).query as any;
  if (!params.ids) {
    return successResponseWrap('ok');
  }
  const ids = params.ids.split(',');
  admins = admins.filter((item) => ids.indexOf(item.uid) === -1);
  return successResponseWrap('ok');
}

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/admin/list'), getAdmin);
    Mock.mock(new RegExp('/api/admin/update'), updateAdmin);
    Mock.mock(new RegExp('/api/admin/delete'), deleteAdmin);
  },
});
