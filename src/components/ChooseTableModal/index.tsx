import { defineComponent, toRefs, ref, PropType, computed, watch } from 'vue';
import { Message, useFormItem } from '@arco-design/web-vue';
import { isNull, isUndefined } from '@arco-design/web-vue/es/_utils/is';
import TableList from '@/components/TableList';

export default defineComponent({
  name: 'ChooseTableModal',
  props: {
    ...TableList.props,
    modelValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    defaultValue: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    buttonText: {
      type: String,
      default: '选择',
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 960,
    },
    max: {
      type: Number,
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    labelKey: {
      type: String,
      default: 'name',
    },
    valueKey: {
      type: String,
      default: 'name',
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
  setup(props, { slots, emit }) {
    const { modelValue } = toRefs(props);
    const { eventHandlers } = useFormItem();
    const tableRef = ref();
    const visible = ref(false);
    const _value = ref<any[] | undefined>(props.defaultValue || undefined);
    const multiple = computed(() => props.max > 1);

    const computedValue = computed(() => props.modelValue ?? _value.value);
    watch(computedValue, (cur) => {
      if (_value.value !== cur) {
        _value.value = cur;
      }
    });

    watch(modelValue, (val) => {
      if (isUndefined(val) || isNull(val)) {
        _value.value = undefined;
      }
    });

    const selectedInfo = computed(() => {
      let text;
      const selectedRowKeys = [];
      const selected = [];
      if (computedValue.value) {
        if (multiple.value) {
          const labelArr = computedValue.value.map((item) => {
            selectedRowKeys.push(item[props.rowKey || 'id']);
            selected.push(item);
            return item[props.labelKey];
          });
          text = `${labelArr.slice(0, 3).join('、')}${
            labelArr.length > 3 ? '等' : ''
          }`;
        } else {
          text = computedValue.value[props.labelKey];
          selectedRowKeys.push(computedValue.value[props.rowKey || 'id']);
          selected.push(computedValue.value);
        }
      }
      return {
        text,
        selected,
        selectedRowKeys,
      };
    });

    const handleChange = (value: any, e: Event | undefined) => {
      if (
        multiple.value &&
        props.max &&
        Array.isArray(value) &&
        value.length > props.max
      ) {
        Message.error(`最多选择${props.max}个`);
        return;
      }
      _value.value = value;
      emit('update:modelValue', value);
      emit('change', value, (e || {}) as Event);
      eventHandlers.value?.onChange?.(e);
      visible.value = false;
    };

    const handleOk = () => {
      // 获取选中的
      const data = tableRef.value.getSelected();
      handleChange(
        multiple.value ? data.selectedRows : data.selectedRows?.[0],
        undefined
      );
    };
    const onSearch = () => {
      visible.value = true;
    };
    const handleCancel = () => {
      visible.value = false;
    };
    const onClear = () => {
      handleChange(undefined, undefined);
    };
    const render = () => {
      return (
        <div style={{ width: '100%' }}>
          {slots.default ? (
            slots.default({
              value: computedValue.value,
              text: selectedInfo.value.text,
            })
          ) : (
            <a-input-search
              disabled={props.disabled}
              readonly
              placeholder={props.placeholder}
              buttonText={props.buttonText}
              modelValue={selectedInfo.value.text}
              searchButton
              allowClear
              onSearch={onSearch}
              onClear={onClear}
            />
          )}
          <a-modal
            visible={visible.value}
            onOk={handleOk}
            onCancel={handleCancel}
            title={props.title}
            width={props.width}
            draggable
            unmountOnClose
          >
            <table-list
              ref={tableRef}
              {...props}
              pagination={{
                pageSize: 5,
                pageSizeOptions: [5, 10, 20],
              }}
              rowSelection={{
                type: multiple.value ? 'checkbox' : 'radio',
                showCheckedAll: true,
              }}
              selected={selectedInfo.value.selected}
              selectedKeys={selectedInfo.value.selectedRowKeys}
              size="small"
            />
          </a-modal>
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
