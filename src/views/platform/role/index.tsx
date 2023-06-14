import TableList from '@/components/TableList';
import { Ref, defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import Breadcrumb from '@/components/breadcrumb/index.vue';
import { RenderFormItemData } from '@/components/ProTable/interface';

export default defineComponent({
  name: 'Role',
  setup() {
    const premits = ref<any[]>([]);
    onMounted(() => {
      axios.get('/api/premit/menu').then((res: any) => {
        if (res.success) {
          premits.value = res.data;
        }
      });
    });
    const onCheck = (formRef: Ref, checkedKeys: any) => {
      formRef.value.setFields({
        premits: {
          value: checkedKeys,
        },
      });
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'roleId',
        hideInSearch: true,
        valueType: 'hidden',
      },
      {
        title: '角色名',
        dataIndex: 'roleName',
        rules: [
          {
            required: true,
            message: '角色名不能为空',
          },
        ],
      },
      {
        title: '权限',
        dataIndex: 'premits',
        hideInSearch: true,
        hideInTable: true,
        renderFormItem: ({ formModel, formRef }: RenderFormItemData) => {
          const { roleId } = formModel.value;
          if (roleId === '1') {
            return <span>全部</span>;
          }
          const checkedKeys = formModel.value.premits;
          return (
            <a-tree
              key={roleId}
              checkable={true}
              defaultExpandAll={checkedKeys === undefined}
              data={premits.value}
              checkedKeys={checkedKeys}
              defaultExpandedKeys={checkedKeys}
              onCheck={(keys: any[]) => onCheck(formRef, keys)}
            />
          );
        },
      },
    ];
    const buttons = [
      {
        action: 1,
        alias: 'add',
        path: '/api/role/update',
        name: '新增',
      },
      {
        action: 2,
        alias: 'edit',
        path: '/api/role/update',
        name: '编辑',
      },
      {
        action: 2,
        alias: 'delete',
        path: '/api/role/delete',
        name: '删除',
      },
    ];
    const render = () => {
      return (
        <div>
          <Breadcrumb items={['menu.platform', 'menu.platform.admin']} />
          <TableList
            rowKey="roleId"
            columns={columns}
            url="/api/role/list"
            modal
            buttons={buttons}
          ></TableList>{' '}
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
