import { successResponseWrap, failResponseWrap } from '@/utils/setup-mock';

export default [
  {
    url: '/api/user/info',
    method: 'post',
    response: (req: any) => {
      const { isLogin, userRole } = req.body || {};
      if (isLogin) {
        const role = userRole || 'admin';
        return successResponseWrap({
          name: '王立群',
          avatar:
            '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
          email: 'wangliqun@email.com',
          job: 'frontend',
          jobName: '前端艺术家',
          organization: 'Frontend',
          organizationName: '前端',
          location: 'beijing',
          locationName: '北京',
          introduction: '人潇洒，性温存',
          personalWebsite: 'https:// www.arco.design',
          phone: '150****0000',
          registrationDate: '2013-05-10 12:10:00',
          accountId: '15012312300',
          certification: 1,
          role,
        });
      }
      return failResponseWrap(null, '未登录', 50008);
    },
  },
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return successResponseWrap('ok');
    },
  },
  {
    url: '/api/user/login',
    method: 'post',
    response: (req: any) => {
      const { username, password } = req.body;
      if (!username) {
        return failResponseWrap(null, '用户名不能为空', 50000);
      }
      if (!password) {
        return failResponseWrap(null, '密码不能为空', 50000);
      }
      if (username === 'admin' && password === 'admin') {
        return successResponseWrap({
          userRole: 'admin',
          token: '12345',
        });
      }
      if (username === 'user' && password === 'user') {
        return successResponseWrap({
          userRole: 'user',
          token: '54321',
        });
      }
      return failResponseWrap(null, '账号或者密码错误', 50000);
    },
  },
];
