import Mock from 'mockjs';

import './user';
import './message-box';
import '@/views/list/search-table/mock';
import '@/views/profile/basic/mock';
import '@/views/user/info/mock';
import '@/views/user/setting/mock';
import '@/views/platform/admin/mock';
import '@/views/platform/role/mock';
import '@/views/platform/premit/mock';

Mock.setup({
  timeout: '600-1000',
});
