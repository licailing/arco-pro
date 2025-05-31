import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

import userMock from './mock/user';
import messageBoxMock from './mock/message-box';
import userInfoMock from './mock/view/user-info';
import userSettingMock from './mock/view/user-setting';
import platformAdminMock from './mock/view/platform-admin';
import platformPremitMock from './mock/view/platform-premit';
import platformRoleMock from './mock/view/platform-role';
import profileBasicMock from './mock/view/profile-basic';
import searchTableMock from './mock/view/search-table';
import designerMock from './mock/view/designer';

export function setupProdMockServer() {
  createProdMockServer([
    ...userMock,
    ...messageBoxMock,
    ...userInfoMock,
    ...userSettingMock,
    ...platformAdminMock,
    ...platformPremitMock,
    ...platformRoleMock,
    ...profileBasicMock,
    ...searchTableMock,
    ...designerMock,
  ]);
}
