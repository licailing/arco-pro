import {
  PropType,
  defineComponent,
  ref,
  toRef,
  computed,
  Ref,
  onActivated,
} from 'vue';
import qs from 'query-string';
import axios from 'axios';
import { TableData } from '@arco-design/web-vue';
import { HttpResponse } from '@/api/interceptor';
import { ProTable } from '@arco-vue-pro-components/pro-components';
import { setFields } from '@arco-vue-pro-components/pro-components/es/pro-table/utils';
import type {
  UseFetchDataAction,
  ToolBarData,
} from '@arco-vue-pro-components/pro-components';
import { ButtonItem, ButtonData, ModalFormData } from './interface';
import { handleRemove, handleUpdate } from './util';
import './index.less';

const renderColumnButton = ({
  button,
  action,
  record,
  rowKey,
  modal,
  handleItemUpdate,
}: {
  button: ButtonItem;
  action: UseFetchDataAction<any>;
  record: any;
  rowKey: string;
  modal: boolean;
  handleItemUpdate: (data: { add: boolean; record: any; path: string }) => void;
}) => {
  const buttonData: ButtonData = { type: 'column', record };
  // 判断按钮是否显示
  if (typeof button.show === 'function' && !button.show(buttonData)) {
    return null;
  }
  const name =
    typeof button.name === 'function' ? button.name(buttonData) : button.name;
  // 自定义点击事件
  if (typeof button.handleClick === 'function') {
    const data: any = {
      record,
      action,
      type: 'column',
    };
    return (
      <a-button
        type="text"
        size="small"
        onClick={(e: Event) => {
          e.stopPropagation();
          e.preventDefault();
          button.handleClick(data);
        }}
      >
        {name}
      </a-button>
    );
  }
  let confirmInfo = {};
  if (typeof button.getCustomConfirm === 'function') {
    confirmInfo = button.getCustomConfirm(record);
  }
  const key = record[rowKey];
  const path =
    typeof button.path === 'function' ? button.path(record) : button.path;
  switch (button.alias) {
    case 'delete': // 其他特殊
      return (
        <a-button
          type="text"
          size="small"
          onClick={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemove(path, [key], action, confirmInfo);
          }}
        >
          {name || '删除'}
        </a-button>
      );
    case 'edit': // 编辑
      return modal ? (
        <a-button
          type="text"
          size="small"
          onClick={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            handleItemUpdate({
              add: false,
              record,
              path,
            });
          }}
        >
          {name || '编辑'}
        </a-button>
      ) : (
        <router-link
          onClick={(e: Event) => {
            e.stopPropagation();
          }}
          to={`${path}/${key}`}
          class="table-list-button"
        >
          {name || '编辑'}
        </router-link>
      );
    default:
      // 链接
      return (
        <router-link
          onClick={(e: Event) => {
            e.stopPropagation();
          }}
          to={`${path}/${key}`}
          class="table-list-button"
        >
          {name}
        </router-link>
      );
  }
};
export default defineComponent({
  name: 'TableList',
  inheritAttrs: false,
  props: {
    ...ProTable.props,
    data: {
      type: Array as PropType<TableData[]>,
      default: undefined,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    buttons: {
      type: Array as PropType<ButtonItem[]>,
    },
    url: String,
    beforeUpdate: {
      type: Function,
    },
    beforeSave: {
      type: Function,
    },
    cache: {
      type: Boolean,
      default: false,
    },
    showOption: {
      type: Boolean,
      default: true,
    },
    optionWidth: {
      type: Number,
      default: 200,
    },
  },
  setup(props, { attrs, slots }) {
    const columns = toRef(props, 'columns');
    const modalFormRef = ref();
    const actionRef = ref();
    const setModalFormRef = (ref: Ref) => {
      modalFormRef.value = ref;
    };
    const setActionRef = (ref: Ref) => {
      actionRef.value = ref;
      if (props.actionRef) {
        props.actionRef(ref);
      }
    };
    const visible = ref(false);
    const rowData = ref<any>({});
    const isAdd = ref(false);
    const updatePath = ref('');
    // 操作按钮
    const columnButtons = computed(() => {
      const buttons: ButtonItem[] = props.buttons || [];
      return buttons.filter(
        (button) => button.action === 2 || button.action === 3
      );
    });
    // toolbar按钮
    const toolbarButtons = computed(() => {
      const buttons: ButtonItem[] = props.buttons || [];
      return buttons.filter(
        (button) => button.action === 1 || button.action === 3
      );
    });

    onActivated(() => {
      if (props.cache) {
        actionRef.value.reload();
      }
    });

    const handleCancel = () => {
      visible.value = false;
    };

    const handleSubmit = async (values: any) => {
      const rowKey = props.rowKey || 'id';
      const id = rowData.value ? rowData.value[rowKey] : undefined;
      let fields = { [rowKey]: id, ...values };
      if (props.beforeUpdate) {
        fields = props.beforeUpdate(fields);
      }
      const ok = await handleUpdate(
        fields,
        isAdd.value,
        updatePath.value,
        actionRef.value
      );
      if (ok) {
        visible.value = false;
      }
    };
    const handleItemUpdate = ({
      add,
      record,
      path,
    }: {
      add: boolean;
      record: any;
      path: string;
    }) => {
      isAdd.value = add;
      let newRecord = { ...record };
      if (props.beforeSave) {
        newRecord = props.beforeSave(newRecord);
      }
      if (modalFormRef.value) {
        // 清除校验状态
        modalFormRef.value.clearValidate();
        // 重置或设置表单值
        add
          ? modalFormRef.value.resetFields()
          : setFields(newRecord, modalFormRef.value);
        // 新增下级情况
        if (add && Object.keys(newRecord).length) {
          setFields(newRecord, modalFormRef.value);
        }
      }
      updatePath.value = path;
      rowData.value = newRecord;
      visible.value = true;
    };

    const renderToolbarButton = (
      button: ButtonItem,
      data: ToolBarData<any>
    ) => {
      const buttonData: ButtonData = { type: 'toolbar', data };
      // 判断按钮是否显示
      if (typeof button.show === 'function' && !button.show(buttonData)) {
        return null;
      }
      const name =
        typeof button.name === 'function'
          ? button.name(buttonData)
          : button.name;
      // 自定义点击事件
      if (typeof button.handleClick === 'function') {
        return (
          <a-button
            type="primary"
            size="small"
            onClick={(e: Event) => {
              e.stopPropagation();
              e.preventDefault();
              button.handleClick({ ...data, type: 'toolbar' });
            }}
          >
            {name}
          </a-button>
        );
      }
      let confirmInfo = {};
      if (typeof button.getCustomConfirm === 'function') {
        confirmInfo = button.getCustomConfirm({});
      }
      const path =
        typeof button.path === 'function' ? button.path({}) : button.path;
      switch (button.alias) {
        case 'add':
        case 'create':
          return props.modal ? (
            <a-button
              onClick={(e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                handleItemUpdate({
                  add: true,
                  record: {},
                  path,
                });
              }}
              class="sword-button-add"
              type="primary"
              v-slots={{
                icon: () => <icon-plus />,
              }}
            >
              {name || '新增'}
            </a-button>
          ) : (
            <router-link
              onClick={(e: Event) => {
                e.stopPropagation();
              }}
              class="table-list-button"
              to={button.path}
            >
              <a-button
                type="primary"
                v-slots={{
                  icon: () => <icon-plus />,
                }}
              >
                {name || '新增'}
              </a-button>
            </router-link>
          );
        case 'delete':
        case 'remove':
          return (
            <a-button
              onClick={() => {
                handleRemove(
                  path,
                  data.selectedRowKeys,
                  data.action,
                  confirmInfo
                );
              }}
              class="sword-button-delete"
              type="outline"
            >
              {name || '删除'}
            </a-button>
          );
        default:
          return (
            <a-button class={`sword-button-${button.alias}`} type="outline">
              {name}
            </a-button>
          );
      }
    };

    const mergeColumns = computed(() => {
      if (columns.value && columnButtons.value.length) {
        return [
          ...columns.value,
          {
            title: '操作',
            hideInSearch: true,
            key: 'option',
            valueType: 'option',
            width: props.optionWidth,
            align: 'center',
            fixed: 'right',
            render: ({
              record,
              action,
            }: {
              text: any;
              record: any;
              rowIndex: number;
              action: any;
            }) => {
              return columnButtons.value.map((button: ButtonItem) =>
                renderColumnButton({
                  button,
                  action,
                  record,
                  rowKey: props.rowKey,
                  modal: props.modal,
                  handleItemUpdate,
                })
              );
            },
          },
        ];
      }
      return [...columns.value];
    });

    const fetchData = async (params: any) => {
      if (!props.url) {
        return false;
      }
      const { success, data }: HttpResponse<any> = await axios.get(props.url, {
        params,
        paramsSerializer: (obj) => {
          return qs.stringify(obj, {
            skipNull: true,
          });
        },
      });
      return { success, data: data.list, total: data.total };
    };

    const renderModalForm = () => {
      if (slots['modal-form']) {
        const data: ModalFormData = {
          isAdd: isAdd.value,
          rowData: rowData.value,
          visible,
          onCancel: handleCancel,
          onSubmit: handleSubmit,
          formRef: modalFormRef,
        };
        return slots['modal-form'](data);
      }
      return (
        <a-modal
          titleAlign="start"
          title={isAdd.value ? '新增' : '编辑'}
          v-model:visible={visible.value}
          draggable
          maskClosable={false}
          footer={false}
        >
          <ProTable
            formRef={setModalFormRef}
            onSubmit={handleSubmit}
            columns={props.columns}
            type="form"
            v-slots={slots}
          />
        </a-modal>
      );
    };

    const renderOptionColumn = () => {
      if (!columnButtons.value.length || !props.showOption) {
        return null;
      }
      return (
        <a-table-column
          v-slots={{
            cell: ({ record }: { record: any }) => {
              return (
                <a-space
                  class="pro-table-options"
                  v-slots={{
                    split: () => <a-divider direction="vertical" />,
                    default: () =>
                      columnButtons.value.map((button: ButtonItem) =>
                        renderColumnButton({
                          button,
                          action: actionRef.value,
                          record,
                          rowKey: props.rowKey,
                          modal: props.modal,
                          handleItemUpdate,
                        })
                      ),
                  }}
                ></a-space>
              );
            },
          }}
        ></a-table-column>
      );
    };

    const render = () => {
      return (
        <div class="table-list">
          <pro-table
            {...props}
            {...attrs}
            actionRef={setActionRef}
            request={props.data ? undefined : fetchData}
            columns={mergeColumns.value}
            toolBarRender={
              props.toolBarRender !== false || props.modal || slots['tool-bar']
                ? (data: ToolBarData<any>) => {
                    const defaultToolBarButtons =
                      typeof props.toolBarRender === 'function'
                        ? props.toolBarRender(data)
                        : [];
                    const toolBarButtons = toolbarButtons.value.map(
                      (button) => {
                        return renderToolbarButton(button, data);
                      }
                    );
                    return [...defaultToolBarButtons, ...toolBarButtons];
                  }
                : false
            }
            v-slots={{
              ...slots,
              columns: slots.columns
                ? () => {
                    const children = slots.columns?.() || [];
                    const option = renderOptionColumn();
                    if (option) {
                      children.push(option);
                    }
                    return children;
                  }
                : undefined,
            }}
          />
          {props.modal && renderModalForm()}
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
