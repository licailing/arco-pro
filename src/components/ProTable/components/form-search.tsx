import {
  PropType,
  VNodeChild,
  computed,
  defineComponent,
  Ref,
  ref,
  cloneVNode,
  onMounted,
  VNodeTypes,
  watch,
  toRef,
  watchEffect,
} from 'vue';
import { GridProps, ValidatedError } from '@arco-design/web-vue';
import { useI18n } from 'vue-i18n';
import AutoListView from '@/components/AutoListView/index.vue';
import InputDecimal from '@/components/InputDecimal';
import ProSwitch from '@/components/ProSwitch/index.vue';
import type { ProColumns, ProTableTypes } from '../interface';
import {
  ObjToMap,
  genColumnKey,
  parsingValueEnumToArray,
  setFields,
} from './utils';

const inputDecimalTypes = ['digit', 'decimal', 'money', 'percent'];
export const renderFormInput = (
  item: ProColumns,
  type: ProTableTypes,
  formModel: Ref,
  formRef: Ref,
  slots: any,
  t: any
) => {
  const data = {
    item,
    formModel,
    formRef,
  };
  if (item.renderFormItem) {
    return item.renderFormItem(data);
  }
  if (item.formSlotName && slots?.[item.formSlotName]) {
    return slots[item.formSlotName]?.(data);
  }
  const valueType =
    typeof item.valueType === 'function' ? item.valueType({}) : item.valueType;
  if (!valueType || valueType === 'text') {
    const { valueEnum } = item;
    if (valueEnum) {
      return (
        <AutoListView
          style={{
            width: '100%',
          }}
          options={parsingValueEnumToArray(ObjToMap(valueEnum))}
          labelColumn="text"
          valueColumn="value"
          placeholder={t('tableForm.selectPlaceholder')}
          {...item.fieldProps}
        />
      );
    }
    return (
      <a-input
        placeholder={t('tableForm.inputPlaceholder')}
        allowClear
        {...item.fieldProps}
      />
    );
  }
  if (valueType === 'select') {
    return (
      <AutoListView
        style={{
          width: '100%',
        }}
        placeholder={t('tableForm.selectPlaceholder')}
        {...item.fieldProps}
      />
    );
  }
  if (valueType === 'date') {
    return (
      <a-date-picker
        format="YYYY-MM-DD"
        style={{
          width: '100%',
        }}
        {...item.fieldProps}
      />
    );
  }

  if (valueType === 'dateTime') {
    return (
      <a-date-picker
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        style={{
          width: '100%',
        }}
        {...item.fieldProps}
      />
    );
  }

  if (valueType === 'dateRange') {
    return (
      <a-range-picker
        style={{
          width: '100%',
        }}
        {...item.fieldProps}
      />
    );
  }
  if (valueType === 'dateTimeRange') {
    return (
      <a-range-picker
        showTime
        style={{
          width: '100%',
        }}
        {...item.fieldProps}
      />
    );
  }

  if (valueType === 'time') {
    return (
      <a-time-picker
        style={{
          width: '100%',
        }}
        {...item.fieldProps}
      />
    );
  }
  if (valueType === 'textarea' && type === 'form') {
    return (
      <a-textarea
        placeholder={t('tableForm.inputPlaceholder')}
        {...item.fieldProps}
      />
    );
  }
  if (valueType === 'hidden') {
    return <a-input type="hidden" {...item.fieldProps} />;
  }
  if (valueType === 'checkbox') {
    return <a-checkbox {...item.fieldProps} />;
  }
  if (valueType === 'radioGroup') {
    return <a-radio-group {...item.fieldProps} />;
  }
  if (valueType === 'switch') {
    return <ProSwitch {...item.fieldProps} />;
  }
  if (valueType === 'uploadFile') {
    return <a-upload action="/" {...item.fieldProps} multiple={false} />;
  }
  if (typeof valueType === 'string' && inputDecimalTypes.includes(valueType)) {
    return <InputDecimal type={valueType} {...item.fieldProps} />;
  }
  return (
    <a-input
      placeholder={t('tableForm.inputPlaceholder')}
      allowClear
      {...item.fieldProps}
    />
  );
};
/**
 * 默认的查询表单配置
 */
const defaultColConfig = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 };
const defaultFormColConfig = 1;
export interface FormOptionProps {
  searchConfig: SearchConfig;
  type?: ProTableTypes;
  form?: Ref;
  submit: () => void;
  collapse: boolean;
  setCollapse: (collapse: boolean) => void;
  showCollapseButton: boolean;
  onReset?: () => void;
}
/**
 * 用于配置操作栏
 */
export interface SearchConfig {
  /**
   * 查询按钮的文本
   */
  searchText?: string;
  /**
   * 重置按钮的文本
   */
  resetText?: string;
  cancelText?: string;
  span?: number | typeof defaultColConfig;
  /**
   * 收起按钮的 render
   */
  collapseRender?: (
    collapsed: boolean,
    /**
     * 是否应该展示，有两种情况
     * 列只有三列，不需要收起
     * form 模式 不需要收起
     */
    showCollapseButton?: boolean
  ) => VNodeChild;
  /**
   * 是否收起
   */
  collapsed?: boolean;
  /**
   * 收起按钮的事件
   */
  onCollapse?: (collapsed: boolean) => void;
  /**
   * 提交按钮的文本
   */
  submitText?: string;
  gridProps?: GridProps;
  optionRender?: ((props: FormOptionProps) => VNodeTypes) | false;
}

/**
 * 默认的设置
 */
const defaultSearch: SearchConfig = {
  searchText: '查询',
  resetText: '重置',
  cancelText: '取消',
  submitText: '提交',
  span: defaultColConfig,
  collapseRender: (collapsed: boolean) => (collapsed ? '展开' : '收起'),
};
const getDefaultSearch = (
  search: boolean | SearchConfig | undefined,
  t: (s: string) => any,
  isForm: boolean
): SearchConfig => {
  const config = {
    collapseRender: (collapsed: boolean) => {
      if (collapsed) {
        return (
          <>
            {t('tableForm.collapsed')}
            <icon-down
              style={{
                verticalAlign: 'middle',
                fontSize: '16px',
                marginRight: '8px',
                transition: '0.3s all',
                transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
              }}
            />
          </>
        );
      }
      return (
        <>
          {t('tableForm.expand')}
          <icon-down
            style={{
              verticalAlign: 'baseline',
              fontSize: '16px',
              marginRight: '8px',
              transition: '0.3s all',
              transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
            }}
          />
        </>
      );
    },
    cancelText: defaultSearch.cancelText || t('tableForm.cancel'),
    searchText: defaultSearch.searchText || t('tableForm.search'),
    resetText: defaultSearch.resetText || t('tableForm.reset'),
    submitText: defaultSearch.submitText || t('tableForm.submit'),
    span: isForm ? defaultFormColConfig : defaultColConfig,
  };

  if (search === undefined || search === true) {
    return config;
  }

  return { ...config, ...search } as Required<SearchConfig>;
};

export default defineComponent({
  name: 'ProFormSearch',
  props: {
    columns: {
      type: Array as PropType<ProColumns[]>,
      default: () => [],
    },
    search: {
      type: [Object, Boolean] as PropType<SearchConfig | boolean>,
      default: true,
    },
    type: {
      type: String as PropType<ProTableTypes>,
      default: 'table',
    },
    defaultFormData: {
      type: Object,
      default: () => ({}),
    },
    formRef: {
      type: Function as PropType<(formRef: Ref) => void>,
    },
  },
  emits: {
    submit: (formData: object) => true,
    reset: () => true,
    cancel: () => true,
  },
  setup(props, { slots, attrs, emit }) {
    const columns = toRef(props, 'columns');
    const defaultFormData = toRef(props, 'defaultFormData');
    const formSearchRef = ref();
    const { t } = useI18n();
    const searchConfig = computed(() =>
      getDefaultSearch(props.search, t, props.type === 'form')
    );
    const isForm = computed(() => props.type === 'form');
    const onReset = () => {
      formSearchRef.value.resetFields();
      handleReset();
    };
    // 设置表单初始值：能过滤掉不在form-item的数据
    onMounted(() => {
      setFields(defaultFormData.value, formSearchRef.value);
    });

    watchEffect(() => {
      if (typeof props.formRef === 'function' && formSearchRef.value) {
        formSearchRef.value.submit = handleSubmit;
        formSearchRef.value.reset = onReset;
        props.formRef(formSearchRef.value);
      }
    });

    watch(
      defaultFormData,
      (defaultFormData) => {
        setFields(defaultFormData, formSearchRef.value);
      },
      { deep: true }
    );
    const formModel = ref<{ [propName: string]: any }>({});
    const collapsed = ref(searchConfig.value.collapsed ?? true);

    const columnsList = ref<any[]>([]);
    watch(
      columns,
      (columns) => {
        columnsList.value =
          columns
            .filter((item) => {
              if (item.hideInSearch && props.type !== 'form') {
                return false;
              }
              if (props.type === 'form' && item.hideInForm) {
                return false;
              }
              if (item.valueType !== 'index' && (item.key || item.dataIndex)) {
                return true;
              }
              return false;
            })
            .sort((a, b) => {
              if (a && b) {
                return (b.order || 0) - (a.order || 0);
              }
              if (a && a.order) {
                return -1;
              }
              if (b && b.order) {
                return 1;
              }
              return 0;
            }) || [];
      },
      { deep: true, immediate: true }
    );

    const handleReset = () => {
      emit('reset');
    };
    const handleSubmit = ({
      values,
      errors,
    }: {
      values: Record<string, any>;
      errors: Record<string, ValidatedError> | undefined;
    }) => {
      if (!errors) {
        emit('submit', values);
      }
    };

    const renderGridFormItems = () => {
      return (
        <a-grid
          {...gridProps.value}
          {...(props.search && props.search !== true
            ? props.search.gridProps
            : undefined)}
          key={columnsList.value}
          collapsedRows={1}
        >
          {columnsList.value.map((item) => {
            const key = genColumnKey(item.key, item.dataIndex, item.index);
            // 支持 function 的 title
            const getTitle = () => {
              if (item.title && typeof item.title === 'function') {
                return item.title(item, 'form');
              }
              return item.title;
            };
            const title = getTitle();
            const valueType =
              typeof item.valueType === 'function'
                ? item.valueType({})
                : item.valueType;
            const hidden = valueType === 'hidden';
            return (
              <a-grid-item key={key} hidden={hidden} {...item.girdItemProps}>
                <a-form-item
                  field={item.dataIndex}
                  label={hidden ? undefined : title}
                  {...(isForm.value ? item.formItemProps : {})}
                >
                  {cloneVNode(
                    renderFormInput(
                      item,
                      props.type,
                      formModel,
                      formSearchRef,
                      slots,
                      t
                    ),
                    {
                      'modelValue': formModel.value[item.dataIndex],
                      'onUpdate:modelValue': (value: any) => {
                        // 更新表单数据
                        formModel.value[item.dataIndex] = value;
                      },
                    }
                  )}
                </a-form-item>
              </a-grid-item>
            );
          })}
          <a-grid-item
            span={1}
            suffix
            style={[
              { 'text-align': 'right' },
              !isForm.value ? { 'margin-bottom': '20px' } : {},
            ]}
            v-slots={{
              default: ({ overflow }: { overflow: boolean }) => {
                return renderFormOption(collapsed.value ? overflow : true);
              },
            }}
          ></a-grid-item>
        </a-grid>
      );
    };

    const renderFormOption = (showCollapseButton: boolean) => {
      if (searchConfig.value.optionRender === false) {
        return null;
      }
      if (searchConfig.value.optionRender || slots?.optionRender) {
        const optionProps = {
          searchConfig: searchConfig.value,
          collapse: collapsed.value,
          setCollapse: (value: boolean) => {
            collapsed.value = value;
          },
          type: props.type,
          submit: async () => {
            const res = await formSearchRef.value?.validate();
            if (!res) {
              emit('submit', formModel.value);
            }
          },
          reset: () => {
            emit('reset');
          },
          form: formSearchRef,
          showCollapseButton,
        };
        if (slots?.optionRender) {
          return slots?.optionRender(optionProps);
        }
        if (searchConfig.value.optionRender) {
          return searchConfig.value.optionRender(optionProps);
        }
      }
      return (
        <a-space>
          {isForm.value ? (
            <a-button
              onClick={() => {
                emit('cancel');
              }}
              type="outline"
            >
              {searchConfig.value.cancelText}
            </a-button>
          ) : (
            <a-button onClick={onReset} type="primary">
              {searchConfig.value.resetText}
            </a-button>
          )}
          <a-button type="primary" htmlType="submit">
            {isForm.value
              ? searchConfig.value.submitText
              : searchConfig.value.searchText}
          </a-button>
          {!isForm.value && showCollapseButton && (
            <a-button
              type="text"
              onClick={() => {
                collapsed.value = !collapsed.value;
              }}
            >
              {searchConfig.value.collapseRender &&
                searchConfig.value.collapseRender(collapsed.value)}
            </a-button>
          )}
        </a-space>
      );
    };

    const gridProps = computed(() =>
      props.type === 'form'
        ? {
            cols: 1,
            collapsed: false,
          }
        : {
            cols: { xs: 1, sm: 2, md: 3 },
            collapsed: collapsed.value,
          }
    );

    const render = () => (
      <a-form
        model={formModel.value}
        ref={formSearchRef}
        layout={isForm.value ? 'vertical' : 'horizontal'}
        onSubmit={handleSubmit}
      >
        {renderGridFormItems()}
      </a-form>
    );
    return {
      render,
      selfSubmit: handleSubmit,
      selfReset: handleReset,
      formSearchRef,
    };
  },
  methods: {
    submit(data: any) {
      return this.selfSubmit(data);
    },
    reset() {
      return this.selfReset();
    },
  },
  render() {
    return this.render();
  },
});
