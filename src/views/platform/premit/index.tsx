import { defineComponent } from 'vue';
import TableList from '@/components/TableList';
import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import Breadcrumb from '@/components/breadcrumb/index.vue';

export default defineComponent({
  name: 'Premit',
  setup(props) {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'premitId',
        hideInForm: true,
        sortable: {
          sortDirections: ['ascend', 'descend'],
        },
      },
      {
        title: '模块',
        dataIndex: 'premitModule',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '模块不能为空',
            },
          ],
        },
        fieldProps: {
          maxLength: 20,
        },
      },
      {
        title: '模块描述',
        dataIndex: 'premitModuleDesc',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '模块描述不能为空',
            },
          ],
        },
        fieldProps: {
          maxLength: 50,
        },
      },
      {
        title: '方法',
        dataIndex: 'premitAction',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '方法不能为空',
            },
          ],
        },
        fieldProps: {
          maxLength: 50,
        },
      },
      {
        title: '方法描述',
        dataIndex: 'premitActionDesc',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '方法描述不能为空',
            },
          ],
        },
        fieldProps: {
          maxLength: 20,
        },
      },
    ];
    const handleGenerate = async () => {
      const hide = Message.loading('正在生成平台权限');
      try {
        const { success }: any = await axios.get('/api/premit/generate');
        hide.close();
        if (!success) {
          return false;
        }
        Message.success('生成成功，即将刷新');
        return true;
      } catch (error) {
        hide.close();
        Message.error('生成失败，请重试');
        return false;
      }
    };
    const render = () => {
      const buttons = [
        {
          action: 1,
          name: '生成平台权限',
          handleClick: async ({ action }: any) => {
            const ok = await handleGenerate();
            if (ok) {
              action.reload();
            }
          },
        },
        {
          action: 2,
          alias: 'edit',
          path: '/api/premit/update',
          name: '编辑',
        },
        {
          action: 2,
          alias: 'delete',
          path: '/api/premit/delete',
          name: '删除',
        },
      ];
      return (
        <div>
          <Breadcrumb items={['menu.platform', 'menu.platform.premit']} />
          <TableList
            rowKey="premitId"
            columns={columns}
            url="/api/premit/list"
            modal
            buttons={buttons}
          ></TableList>
        </div>
      );
    };
    return {
      render,
    };
  },
  render() {
    return this.render();
  },
});
