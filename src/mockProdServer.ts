import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

import userMock from './mock/user';
import messageBoxMock from './mock/message-box';

export function setupProdMockServer() {
  createProdMockServer([...userMock, ...messageBoxMock]);
}
