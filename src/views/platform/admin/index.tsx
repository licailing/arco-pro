import { defineComponent, ref } from 'vue';
import axios from 'axios';
import type { ModalFormData } from '@/components/TableList/interface';
import TableList from '@/components/TableList';
import Breadcrumb from '@/components/breadcrumb/index.vue';

export default defineComponent({
  name: 'Admin',
  setup(props) {
    const formModel = ref<any>({});
    const fetchRole = async (value) => {
      console.log('fetchRole', value);
      const res = await axios.get(`/api/role/all`);
      return res?.data || [];
    };
    const columns = [
      {
        title: 'ID',
        dataIndex: 'uid',
        hideInForm: true,
        sortable: {
          sortDirections: ['ascend', 'descend'],
        },
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: 180,
        ellipsis: true,
        copyable: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
        },
      },
      {
        title: '真实姓名',
        dataIndex: 'realname',
        formItemProps: {
          rules: [
            {
              required: true,
              message: '请输入真实姓名',
            },
          ],
        },
      },
      {
        title: '角色',
        dataIndex: 'roleId',
        valueType: 'select',
        fieldProps: {
          request: fetchRole,
          valueKey: 'roleId',
          labelKey: 'roleName',
          placeholder: '请选择角色',
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        valueEnum: {
          1: { text: '正常', status: 'Success' },
          2: { text: '禁止', status: 'Error' },
        },
      },
    ];
    const buttons = [
      {
        action: 1,
        alias: 'add',
        path: '/api/admin/update',
        name: '新增',
      },
      {
        action: 2,
        alias: 'edit',
        path: '/api/admin/update',
        name: '编辑',
      },
      {
        action: 2,
        alias: 'delete',
        path: '/api/admin/delete',
        name: '删除',
      },
    ];
    const renderModalForm = (data: ModalFormData) => {
      const { isAdd, visible, formRef } = data;
      return (
        <a-modal
          titleAlign="start"
          title={isAdd ? '新增' : '编辑'}
          v-model:visible={visible.value}
          draggable
          maskClosable={false}
          footer={false}
        >
          <a-form
            ref={formRef}
            model={formModel.value}
            onSubmit={({ values, errors }: any) => {
              if (!errors) {
                data.onSubmit(values);
              }
            }}
          >
            <a-form-item
              label="用户名"
              field="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <a-input
                placeholder="请输入"
                v-model={formModel.value.username}
              />
            </a-form-item>
            <a-form-item
              label="真实姓名"
              field="realname"
              rules={[
                {
                  required: true,
                  message: '请输入真实姓名',
                },
              ]}
            >
              <a-input
                placeholder="请填写真实姓名"
                v-model={formModel.value.realname}
              />
            </a-form-item>
            <a-form-item
              label="角色"
              field="roleId"
              rules={[
                {
                  required: true,
                  message: '请选择角色',
                },
              ]}
            >
              <pro-select
                request={fetchRole}
                columnKey="roleId"
                valueKey="roleId"
                labelKey="roleName"
                valueOption
                v-model={formModel.value.roleId}
                onChange={(value: any, info: any) => {
                  formModel.value.roleName = info.roleName;
                }}
                placeholder="请选择角色"
              />
            </a-form-item>
            <a-form-item
              label="状态"
              field="status"
              rules={[
                {
                  required: true,
                  message: '请选择状态',
                },
              ]}
            >
              <pro-select
                options={[
                  {
                    label: '正常',
                    value: '1',
                  },
                  {
                    label: '禁止',
                    value: '2',
                  },
                ]}
                v-model={formModel.value.status}
                valueKey="value"
                labelKey="label"
                placeholder="请选择状态"
              />
            </a-form-item>
            {!isAdd && <a-form-item>提示：重置密码时填写</a-form-item>}
            <a-form-item
              label="密码"
              field="password"
              rules={[{ required: true, message: '请填写密码' }]}
            >
              <a-input-password
                maxLength={32}
                v-model={formModel.value.password}
              />
            </a-form-item>
            <a-form-item
              label="重复密码"
              field="repassword"
              rules={[
                { required: true, message: '请填写重复密码' },
                {
                  validator: (value: any, cb: any) => {
                    return new Promise((resolve: any) => {
                      const { password } = formModel.value;
                      if (value && password !== value) {
                        cb('重复密码与密码不一致');
                      }
                      resolve();
                    });
                  },
                },
              ]}
            >
              <a-input-password
                maxLength={32}
                v-model={formModel.value.repassword}
              />
            </a-form-item>
            <a-form-item>
              <a-space
                align="end"
                style={{ 'justify-content': 'flex-end', 'flex': 1 }}
              >
                <a-button type="outline" onClick={data.onCancel}>
                  取消
                </a-button>
                <a-button type="primary" htmlType="submit">
                  提交
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-modal>
      );
    };
    const render = () => {
      return (
        <div>
          <Breadcrumb items={['menu.platform', 'menu.platform.admin']} />
          <a-card>
            <a-card title="默认新增/编辑表单" bordered={false}>
              <TableList
                rowKey="uid"
                url="/api/admin/list"
                columns={columns}
                modal
                buttons={buttons}
                defaultFormData={{ status: 1 }}
                rowSelection={{ type: 'radio' }}
              ></TableList>
            </a-card>
            <a-card
              title="自定义新增/编辑表单"
              style={{ marginTop: '20px' }}
              bordered={false}
            >
              <TableList
                rowKey="uid"
                url="/api/admin/list"
                columns={columns}
                modal
                buttons={buttons}
                rowSelection={{ type: 'checkbox', showCheckedAll: true }}
                v-slots={{
                  'modal-form': renderModalForm,
                }}
              ></TableList>
            </a-card>
          </a-card>
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
