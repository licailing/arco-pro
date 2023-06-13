import {
  PropType,
  defineComponent,
  ref,
  watch,
  toRef,
  computed,
  Ref,
  toRefs,
} from 'vue';
import { useFormItem, Modal } from '@arco-design/web-vue';
import { isNull, isUndefined } from '@arco-design/web-vue/es/_utils/is';
import ProTable from '../ProTable';
import { ActionType, ToolBarData } from '../ProTable/interface';
import { UseFetchDataAction } from '../ProTable/components/useFetchData';
import { setFields } from '../ProTable/components/utils';
import './index.less';

export interface RenderData {
  record: any;
  column: any;
  rowIndex: number;
}
export interface ModalFormData {
  isAdd: boolean;
  rowData: any;
  visible: Ref;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  formRef: Ref;
}
export interface ButtonItem {
  // action: 1 toolbar ,2 操作按钮, 3 即时操作按钮也是toolbar按钮如删除
  action: number;
  path: string | ((record: any) => string);
  name: string | ((record: any) => string);
  alias: string;
  handleClick: ({
    record,
    action,
  }: {
    record: any;
    action: UseFetchDataAction;
  }) => any;
  getCustomConfirm: (record: any) => any;
  checkShow: (record: any) => boolean;
}

const renderColumnButton = ({
  button,
  action,
  record,
  rowKey,
  modal,
  handleItemUpdate,
  handleRemove,
  simple,
}: {
  button: ButtonItem;
  action: ActionType;
  record: any;
  rowKey: string;
  modal: boolean;
  handleItemUpdate: (data: { add: boolean; record: any; path: string }) => void;
  handleRemove: (key: (string | number)[], confirmInfo: any) => void;
  simple: boolean;
}) => {
  // 判断按钮是否显示
  if (typeof button.checkShow === 'function' && !button.checkShow(record)) {
    return null;
  }
  const name =
    typeof button.name === 'function' ? button.name(record) : button.name;
  // 自定义点击事件
  if (typeof button.handleClick === 'function') {
    const data: any = {
      record,
      action,
    };
    return (
      <a-button
        type="primary"
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
          shape="circle"
          status="danger"
          size="small"
          onClick={(e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemove([key], confirmInfo);
          }}
        >
          {simple ? <icon-delete /> : name || '删除'}
        </a-button>
      );
    case 'edit': // 编辑
      return modal ? (
        <a-button
          shape="circle"
          type="primary"
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
          {simple ? <icon-edit /> : name || '编辑'}
        </a-button>
      ) : (
        <router-link to={`${path}/${key}`} class="table-list-button">
          {name || '编辑'}
        </router-link>
      );
    default:
      // 链接
      return (
        <router-link to={`${path}/${key}`} class="table-list-button">
          {name}
        </router-link>
      );
  }
};
export default defineComponent({
  name: 'TableForm',
  inheritAttrs: false,
  props: {
    ...ProTable.props,
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    defaultValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    modal: {
      type: Boolean,
      default: true,
    },
    buttons: {
      type: Array as PropType<ButtonItem[]>,
    },
    beforeUpdate: {
      type: Function,
    },
    beforeSave: {
      type: Function,
    },
    showOption: {
      type: Boolean,
      default: true,
    },
    simple: {
      type: Boolean,
      default: true,
    },
    optionWidth: {
      type: Number,
      default: 140,
    },
  },
  emits: {
    'update:modelValue': (value: any) => true,
    /**
     * @zh 值改变时触发
     * @en Trigger when the value changes
     * @property { any } value
     */
    'change': (value: any, ev: Event) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const { modelValue, simple } = toRefs(props);
    const columns = toRef(props, 'columns');
    const tableRef = ref();
    const formRef = ref();
    const visible = ref(false);
    const rowData = ref<any>({});
    const isAdd = ref(false);
    const updatePath = ref('');
    const { eventHandlers } = useFormItem();
    const _value = ref(props.defaultValue);

    const computedValue = computed(() => props.modelValue ?? _value.value);
    const handleChange = (value: any, e: Event) => {
      _value.value = value;
      emit('update:modelValue', value);
      emit('change', value, e);
      eventHandlers.value?.onChange?.(e);
    };

    const handleRemove = (key: (string | number)[], confirmInfo: any) => {
      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        okText: '确定',
        titleAlign: 'start',
        messageType: 'warning',
        cancelText: '取消',
        async onOk() {
          const newValue = _value.value.filter(
            (item) => !key.includes(item[props.rowKey])
          );
          handleChange(newValue, undefined);
          return true;
        },
        onCancel() {},
        ...confirmInfo,
      });
    };
    const handleUpdate = async (fields = {}) => {
      const newValue = _value.value.concat(fields);
      handleChange(newValue, undefined);
      return true;
    };

    watch(computedValue, (cur) => {
      if (_value.value !== cur) {
        _value.value = cur;
      }
    });

    watch(modelValue, (val) => {
      if (isUndefined(val) || isNull(val)) {
        _value.value = '';
      }
    });

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

    const formRefFun = (formRefC: Ref) => {
      formRef.value = formRefC;
    };

    const handleSubmit = async (values: any) => {
      const rowKey = props.rowKey || 'id';
      const id = rowData.value ? rowData.value[rowKey] : undefined;
      let fields = { [rowKey]: id, ...values };
      if (props.beforeUpdate) {
        fields = props.beforeUpdate(fields);
      }
      const ok = await handleUpdate(fields);
      if (ok) {
        visible.value = false;
      }
    };
    const handleCancel = () => {
      visible.value = false;
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
      if (formRef.value) {
        // 清除校验状态
        formRef.value.clearValidate();
        // 重置或设置表单值
        // eslint-disable-next-line no-unused-expressions
        add ? formRef.value.resetFields() : setFields(newRecord, formRef.value);
      }
      updatePath.value = path;
      rowData.value = newRecord;
      visible.value = true;
    };

    const renderToolbarButton = (
      button: ButtonItem,
      data: ToolBarData<any>
    ) => {
      const name =
        typeof button.name === 'function' ? button.name(data) : button.name;
      // 自定义点击事件
      if (typeof button.handleClick === 'function') {
        return (
          <a-button
            type="primary"
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
            >
              {name || '新增'}
            </a-button>
          ) : (
            <router-link class="table-list-button" to={button.path}>
              <a-button type="primary">{name || '新增'}</a-button>
            </router-link>
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
                  handleRemove,
                  simple: simple.value,
                })
              );
            },
          },
        ];
      }
      return [...columns.value];
    });

    const renderModalForm = () => {
      if (slots['modal-form']) {
        const data: ModalFormData = {
          isAdd: isAdd.value,
          rowData: rowData.value,
          visible,
          onCancel: handleCancel,
          onSubmit: handleSubmit,
          formRef,
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
            formRef={formRefFun}
            onCancel={handleCancel}
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
                    default: () =>
                      columnButtons.value.map((button: ButtonItem) =>
                        renderColumnButton({
                          button,
                          action: tableRef.value.action,
                          record,
                          rowKey: props.rowKey,
                          modal: props.modal,
                          handleItemUpdate,
                          handleRemove,
                          simple: simple.value,
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
        <div class="table-form">
          <ProTable
            ref={tableRef}
            pagination={false}
            {...props}
            {...attrs}
            data={computedValue.value}
            columns={mergeColumns.value}
            search={false}
            headerTitle=""
            size="small"
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
            onChange={handleChange}
          />
          {props.modal && renderModalForm()}
        </div>
      );
    };
    return {
      render,
      renderOptionColumn,
    };
  },
  render() {
    return this.render();
  },
});
