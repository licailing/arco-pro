import {
  defineComponent,
  toRefs,
  ref,
  cloneVNode,
  computed,
  PropType,
} from 'vue';
import { useI18n } from 'vue-i18n';
import ChooseTableModal from '@/components/ChooseTableModal';
import './index.less';

const inputDecimalTypes = ['digit', 'decimal', 'money', 'percent'];

export default defineComponent({
  name: 'DesignerForm',
  props: {
    defaultValue: {
      type: Object,
    },
    list: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    formSetting: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
    },
    parentField: {
      type: String,
      default: '',
    },
  },
  emits: {
    change: (value: any) => true,
  },
  setup(props, { emit }) {
    const { list, formSetting } = toRefs(props);
    const formRef = ref();
    const { t } = useI18n();

    // 初始化默认值
    const initFormModel = (defaultValue: any) => {
      const model: any = {};
      if (!Array.isArray(props.list) || !props.list.length) {
        return model;
      }
      for (const item of props.list) {
        if (item.type === 'multiAdd') {
          model[item.model] = [{}];
        }
        if (item.options.defaultValue) {
          model[item.model] = item.options.defaultValue;
        }
        if (defaultValue && defaultValue[item.model]) {
          model[item.model] = defaultValue[item.model];
        }
      }
      return model;
    };
    const formModel = ref<any>(initFormModel(props.defaultValue));
    // 一行显示rowCol(最大3个)个 每列占多少
    const colSpan = computed(() => 24 / (formSetting.value.rowCol || 3));
    const renderFormItem = (item: any) => {
      const { type, options } = item || {};
      const { placeholder } = options || {};
      //   文本
      if (type === 'input') {
        return (
          <a-input
            placeholder={placeholder || t('tableForm.inputPlaceholder')}
            allowClear
          />
        );
      }
      //   金额、百分比、纯数字输入框
      if (inputDecimalTypes.includes(type)) {
        return (
          <pro-input-number
            type={type}
            capitalUnit={options.unit}
            placeholder={placeholder || t('tableForm.inputPlaceholder')}
          />
        );
      }
      //   弹窗选择明细
      if (type === 'popUpTable') {
        return (
          <ChooseTableModal
            rowKey={options.rowKey || 'id'}
            url={options.customUrl}
            columns={options.columns || []}
            buttons={options.buttons}
            max={options.max}
            title={`选择${item.name}`}
            placeholder={placeholder || t('tableForm.selectPlaceholder')}
          />
        );
      }
      //   弹窗选择明细
      if (
        type === 'popUpDetail' &&
        options.associateModel &&
        formModel.value[options.associateModel]
      ) {
        let detail = formModel.value[options.associateModel];
        const multiple = Array.isArray(detail);
        if (!multiple) {
          detail = [detail];
        }
        return (
          <fold-content
            length={2}
            content={detail}
            layout="vertical"
            v-slots={{
              default: ({ content }: { content: any[] }) => {
                return (
                  <a-space
                    direction="vertical"
                    size="large"
                    fill
                    style={{ width: '100%' }}
                  >
                    {content.map((detailItem: any, i: number) => {
                      const data =
                        options.items?.map((detailColumn: any) => {
                          return {
                            label: detailColumn.label,
                            value: detailItem[detailColumn.dataIndex] || '-',
                            span: detailColumn.isRow
                              ? options.column
                              : detailColumn.span || 1,
                          };
                        }) ?? [];
                      return (
                        <div key={i} class="designer-form__popUpDetail">
                          <a-descriptions
                            column={options.column}
                            data={data}
                            tableLayout="fixed"
                            title={multiple ? `第${i + 1}个` : undefined}
                            layout="inline-horizontal"
                          />
                        </div>
                      );
                    })}
                  </a-space>
                );
              },
            }}
          ></fold-content>
        );
      }

      // 动态表单
      if (type === 'multiAdd') {
        return (
          <div style={{ width: '100%' }}>
            {formModel.value[item.model].map((addItem: any, i: number) => {
              return (
                <a-card
                  key={i}
                  class="designer-form__multiAddItem"
                  title={`${item.name}${i + 1}`}
                >
                  {{
                    default: () => (
                      <designer-form
                        parentField={`${item.model}[${i}]`}
                        list={item.columns || []}
                        type="multiAdd"
                        defaultValue={addItem}
                        onChange={(value: any) => {
                          formModel.value[item.model][i] = value;
                        }}
                      />
                    ),
                    extra: () => (
                      <a-button
                        type="text"
                        onClick={(e: Event) => {
                          e.stopPropagation();
                          e.preventDefault();
                          formModel.value[item.model]?.splice(i, 1);
                        }}
                      >
                        删除
                      </a-button>
                    ),
                  }}
                </a-card>
              );
            })}
            {options.showAdd === false ? null : (
              <a-form-item>
                <a-button
                  onClick={(e: Event) => {
                    e.stopPropagation();
                    e.preventDefault();
                    formModel.value[item.model]?.push({});
                  }}
                >
                  {options.addTitle || '+添加'}
                </a-button>
              </a-form-item>
            )}
          </div>
        );
      }
      return null;
    };

    const renderForm = () => {
      return (
        <a-row
          gutter={{ xs: 4, sm: 16, md: 32, xl: 48 }}
          justify="start"
          align="center"
        >
          {list.value.map((item: any) => {
            const dom = renderFormItem(item);
            if (!dom) {
              return null;
            }
            const span = item?.options?.isRow
              ? 24
              : (item?.options?.rowCol || 1) * colSpan.value;
            const rules: any[] = [];
            if (item.options.required) {
              rules.push({
                required: true,
                message: item.options.placeholder
                  ? item.options.placeholder
                  : '不能为空',
              });
            }
            const title = item?.options?.showTitle ? item.name : '';
            const field = props.parentField
              ? `${props.parentField}[${item.model}]`
              : item.model;
            return (
              <a-col span={span} key={item.key}>
                {item.type === 'multiAdd' ? (
                  <a-form-item
                    field={field}
                    key={item.key}
                    rules={rules}
                    tooltip={item.options.help}
                  >
                    {dom}
                  </a-form-item>
                ) : (
                  <a-form-item
                    label={title}
                    field={field}
                    key={item.key}
                    rules={rules}
                    tooltip={item.options.help}
                  >
                    {cloneVNode(dom, {
                      'modelValue': formModel.value[item.model],
                      'onUpdate:modelValue': (value: any) => {
                        // 更新表单数据
                        formModel.value[item.model] = value;
                        emit('change', formModel.value);
                      },
                    })}
                  </a-form-item>
                )}
              </a-col>
            );
          })}
        </a-row>
      );
    };

    const render = () => {
      return props.type === 'multiAdd' ? (
        renderForm()
      ) : (
        <a-form
          ref={formRef}
          model={formModel}
          layout={formSetting.value.layout}
          style={{ overflowX: 'hidden' }}
        >
          {renderForm()}
        </a-form>
      );
    };

    const validate = (callback: (errors: any) => void) => {
      return formRef.value.validate(callback);
    };
    return {
      render,
      validate,
      formModel,
    };
  },
  render() {
    return this.render();
  },
});
