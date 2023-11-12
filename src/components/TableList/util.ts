import { Modal, Message } from '@arco-design/web-vue';
import axios from 'axios';
import { HttpResponse } from '@/api/interceptor';
import type {
  ActionType,
  UseFetchDataAction,
} from '@arco-vue-pro-components/pro-components';

/**
 *  删除节点
 * @param keys
 */
export const handleRemove = (
  path: string,
  keys: (string | number)[],
  action: UseFetchDataAction<any>,
  confirmInfo: any
) => {
  if (keys.length <= 0) {
    Message.warning('请先选择要删除的记录!');
    return false;
  }
  Modal.confirm({
    title: '删除确认',
    content: '确定删除选中记录?',
    okText: '确定',
    titleAlign: 'start',
    messageType: 'warning',
    cancelText: '取消',
    async onOk() {
      const hide = Message.loading('正在删除');
      try {
        const { success = false }: HttpResponse = await axios.get(path, {
          params: {
            ids: keys.join(','),
          },
        });
        hide.close();
        if (success) {
          Message.success('删除成功，即将刷新');
          action.reload();
          return true;
        }
      } catch (error) {
        hide.close();
        Message.error('删除失败，请重试');
      }
      return false;
    },
    onCancel() {},
    ...confirmInfo,
  });
  return false;
};

/**
 * 新增和修改
 * @param path
 * @param id
 * @param fields
 * @param addFlag
 * @returns
 */
export const handleUpdate = async (
  fields: any,
  addFlag: boolean,
  path: string,
  action: ActionType
) => {
  const type = addFlag ? '添加' : '修改';
  const hide = Message.loading(`正在${type}`);
  try {
    const { success = false }: HttpResponse = await axios.post(path, fields);
    hide.close();
    if (success) {
      Message.success(`${type}成功`);
      action.reload();
      return true;
    }
    Message.error(`${type}失败请重试！`);
  } catch (error) {
    hide.close();
    Message.error(`${type}失败请重试！`);
  }
  return false;
};
