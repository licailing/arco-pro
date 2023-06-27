import {
  PropType,
  computed,
  defineComponent,
  ref,
  cloneVNode,
  toRaw,
  Ref,
  watch,
  onMounted,
  toRef,
  watchEffect,
} from 'vue';
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config';
import { useI18n } from 'vue-i18n';
import { isEmptyObject } from '@/utils/is';
import { formatFormFields, genColumnKey } from './utils';
import { renderFormInput } from './form-search';
import { LightSearchConfig, ProColumns, ProTableTypes } from '../interface';
import './light-form-search.less';

const hiddenValueType = ['hidden', 'index'];
const rangeType = ['dateRange', 'dateTimeRange'];
function getFormFields(info: any) {
  const values = toRaw(info);
  const hasValue = Object.keys(values).filter((key) => {
    const item = values[key];
    if (Array.isArray(item) && item.length === 0) {
      return false;
    }
    if (isEmptyObject(item)) {
      return false;
    }
    return !!item;
  });
  return hasValue.length;
}
export default defineComponent({
  name: 'ProLightSearch',
  props: {
    columns: {
      type: Array as PropType<ProColumns[]>,
      default: () => [],
    },
    search: {
      type: Object as PropType<LightSearchConfig>,
      default: () => ({ rowNumber: 2, name: 'keyword', search: true }),
    },
    type: {
      type: String as PropType<ProTableTypes>,
      default: 'table',
    },
    defaultFormData: {
      type: Object,
      default: () => ({}),
    },
    formSearch: {
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
    search: (value: object) => true,
  },
  setup(props, { slots, emit }) {
    const { t } = useI18n();
    const columns = toRef(props, 'columns');
    const lightFormRef = ref();
    const defaultFormData = toRef(props, 'defaultFormData');
    const prefixCls = getPrefixCls('pro-table-light');
    const searchConfig = computed(() => {
      return {
        rowNumber: 2,
        name: 'keyword',
        search: true,
        ...props.search,
      };
    });
    const searchText = ref<string | undefined>(undefined);
    const visible = ref(false);
    const formModel = ref<{ [propName: string]: any }>({});
    const setFields = (defaultFormData: any) => {
      const fieldsData = formatFormFields(defaultFormData);
      lightFormRef.value.setFields(fieldsData);
    };

    const handleReset = () => {
      emit('reset');
    };
    const onSubmitClick = async () => {
      const res = await lightFormRef.value?.validate();
      if (!res) {
        emit('submit', formModel.value);
        visible.value = false;
      }
    };
    const onReset = () => {
      lightFormRef.value?.resetFields();
      searchText.value = undefined;
      handleReset();
    };

    // 设置表单初始值：能过滤掉不在form-item的数据
    onMounted(() => {
      setFields(defaultFormData.value);
    });

    watchEffect(() => {
      if (typeof props.formRef === 'function' && lightFormRef.value) {
        lightFormRef.value.submit = onSubmitClick;
        lightFormRef.value.reset = onReset;
        props.formRef(lightFormRef.value);
      }
    });

    watch(
      defaultFormData,
      (defaultFormData) => {
        setFields(defaultFormData);
      },
      { deep: true }
    );
    const filterNum = ref(0);
    watch(
      formModel,
      (formModel) => {
        filterNum.value = getFormFields(formModel);
      },
      {
        deep: true,
      }
    );

    const getFormItemInfo = (item: ProColumns) => {
      const key = genColumnKey(item.key, item.dataIndex, item.index);
      // 支持 function 的 title
      const getTitle = () => {
        if (item.title && typeof item.title === 'function') {
          return item.title(item, 'form');
        }
        return item.title;
      };
      const title = getTitle();
      return { title, key };
    };
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

    const renderPowerContent = () => {
      return (
        <div class={`${prefixCls}-power-popover`}>
          <div class={`${prefixCls}-power-content`}>
            {columnsList.value
              .slice(searchConfig.value.rowNumber)
              .map((item: any) => {
                const { key, title } = getFormItemInfo(item);
                return (
                  <a-form-item field={item.dataIndex} key={key} label={title}>
                    {cloneVNode(
                      renderFormInput(
                        item,
                        props.type,
                        formModel,
                        lightFormRef,
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
                );
              })}
            <div class={`${prefixCls}-power-buttons`}>
              <a-button
                type="text"
                disabled={!filterNum.value}
                onClick={(e: Event) => {
                  e.stopPropagation();
                  e.preventDefault();
                  lightFormRef.value.resetFields();
                }}
              >
                清空搜索条件
              </a-button>
              <a-space>
                <a-button
                  onClick={() => {
                    visible.value = false;
                  }}
                  type="outline"
                >
                  取消
                </a-button>
                <a-button
                  onClick={() => {
                    onSubmitClick();
                  }}
                  type="primary"
                >
                  确定
                </a-button>
              </a-space>
            </div>
          </div>
        </div>
      );
    };
    const render = () => (
      <a-form model={formModel.value} ref={lightFormRef} layout="vertical">
        <div class={`${prefixCls}-container`}>
          {searchConfig.value.search ? (
            <a-input-search
              placeholder={t('lightFormSearch:inputPlaceholder')}
              buttonText={t('lightFormSearch:enterButton')}
              style={{ 'width': '420px', 'margin-right': '8px' }}
              v-model={searchText.value}
              defauleValue={props.formSearch[searchConfig.value.name]}
              onSearch={(keyword: string) => {
                emit('search', { [searchConfig.value.name]: keyword });
              }}
              {...(typeof searchConfig.value.search === 'object'
                ? searchConfig.value.search || {}
                : {})}
              searchButton
              allowClear
            />
          ) : null}
          <div class={`${prefixCls}-right`}>
            <a-space>
              {columnsList.value.length > 0 &&
                columnsList.value
                  .slice(0, searchConfig.value.rowNumber)

                  .map((powerItem: any) => {
                    const { key, title } = getFormItemInfo(powerItem);
                    return (
                      <div key={key}>
                        {cloneVNode(
                          renderFormInput(
                            powerItem,
                            props.type,
                            formModel,
                            lightFormRef,
                            slots,
                            t
                          ),
                          {
                            'placeholder': rangeType.includes(
                              powerItem.valueType
                            )
                              ? undefined
                              : title,
                            'style': { width: 160 },
                            'modelValue': props.formSearch[powerItem.dataIndex],
                            'onUpdate:modelValue': (value: any) => {
                              // 更新formSearch数据
                              emit('search', {
                                [powerItem.dataIndex]: value,
                                [searchConfig.value.name]: searchText.value,
                              });
                            },
                          }
                        )}
                      </div>
                    );
                  })}
              {columnsList.value.length <=
              searchConfig.value.rowNumber ? null : (
                <a-popover
                  popupVisible={visible.value}
                  trigger="click"
                  unmountOnClose={false}
                  v-slots={{
                    default: () => {
                      return (
                        <a-button
                          type={filterNum.value ? 'outline' : 'secondary'}
                          class={{
                            [`${prefixCls}-power-btn`]: !filterNum.value,
                          }}
                          onClick={() => {
                            visible.value = true;
                          }}
                        >
                          <icon-align-center
                            style={{ 'margin-right': '12px' }}
                          />
                          高级筛选
                          {filterNum.value ? (
                            <span style={{ 'margin-left': '8px' }}>
                              {filterNum.value}
                            </span>
                          ) : null}
                        </a-button>
                      );
                    },
                    content: () => {
                      return renderPowerContent();
                    },
                  }}
                ></a-popover>
              )}
            </a-space>
          </div>
        </div>
      </a-form>
    );
    return {
      render,
      selfSubmit: onSubmitClick,
      selfReset: handleReset,
      lightFormRef,
    };
  },
  render() {
    return this.render();
  },
});
