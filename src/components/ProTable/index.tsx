import {
  PropType,
  VNodeTypes,
  Fragment,
  Ref,
  computed,
  defineComponent,
  reactive,
  ref,
  toRaw,
  toRefs,
  watch,
} from 'vue';

import {
  PaginationProps,
  Table,
  TableChangeExtra,
  TableData,
} from '@arco-design/web-vue';
import { getPrefixCls } from '@arco-design/web-vue/es/_utils/global-config';
import { useFilterSorter } from './hooks/useFilterSorter';
import type {
  ActionType,
  ColumnEmptyText,
  LightSearchConfig,
  ProColumns,
  ProTableProps,
  ProTableTypes,
  ToolBarProps,
} from './interface';
import FormSearch, { SearchConfig } from './components/form-search';
import useFetchData, { RequestData } from './components/useFetchData';
import {
  genProColumnToColumn,
  mergePagination,
  useActionType,
} from './components/utils';
import { useRowSelection } from './hooks/useRowSelection';
import LightFormSearch from './components/light-form-search';
import './index.less';

Table.inheritAttrs = false;
export default defineComponent({
  name: 'ProTable',
  inheritAttrs: false,
  props: {
    ...Table.props,
    columns: {
      type: Array as PropType<ProColumns[]>,
      default: () => [],
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    params: Object,
    request: {
      type: Function as PropType<
        (
          params: {
            pageSize?: number;
            current?: number;
            [key: string]: any;
          },
          sort: {
            [key: string]: 'ascend' | 'descend';
          },
          filter: { [key: string]: any }
        ) => Promise<RequestData<any>>
      >,
    },
    postData: Function,
    defaultData: Object,
    formSearch: Object,
    /**
     * 格式化搜索表单提交数据
     */
    beforeSearchSubmit: {
      type: Function as PropType<(searchParams: any) => any>,
      default: (searchParams: any) => searchParams,
    },
    search: {
      type: [Boolean, Object] as PropType<SearchConfig | boolean>,
      default: true,
    },
    type: {
      type: String as PropType<ProTableTypes>,
      default: 'table',
    },
    toolBarRender: {
      type: [Boolean, Function] as PropType<
        false | ToolBarProps<any>['toolBarRender']
      >,
      default: undefined,
    },
    headerTitle: {
      type: String,
      default: '列表数据',
    },
    defaultFormData: {
      type: Object,
    },
    searchType: {
      type: String as PropType<ProTableProps['searchType']>,
      default: 'query',
    },
    lightSearchConfig: {
      type: Object as PropType<LightSearchConfig>,
    },
    formRef: {
      type: Function as PropType<(formRef: Ref) => void>,
    },
    columnEmptyText: {
      type: [String, Boolean] as PropType<ColumnEmptyText>,
      default: '-',
    },
  },
  emits: {
    change: (
      data: TableData[],
      extra: TableChangeExtra,
      currentData: TableData[]
    ) => true,
    submit: (formData: any) => true,
    reset: () => true,
    load: (data: any[], total: number, extra: any) => true,
    /**
     * @zh 表格分页发生改变时触发
     * @en Triggered when the table pagination changes
     * @param {number} page
     */
    pageChange: (page: number) => true,
    /**
     * @zh 表格每页数据数量发生改变时触发
     * @en Triggered when the number of data per page of the table changes
     * @param {number} pageSize
     */
    pageSizeChange: (pageSize: number) => true,
    // 取消按钮
    cancel: () => true,
    /**
     * @zh 点击行选择器时触发
     * @en Triggered when the row selector is clicked
     * @param {string | number[]} rowKeys
     * @param {string | number} rowKey
     * @param {TableData} record
     */
    select: (
      rowKeys: (string | number)[],
      rowKey: string | number,
      record: TableData
    ) => true,
  },
  setup(props, { attrs, emit, slots }) {
    const {
      rowSelection,
      selectedKeys,
      defaultSelectedKeys,
      formSearch: defaultFormSearch,
      pagination: propsPagination,
    } = toRefs(props);
    const prefixCls = getPrefixCls('pro-table');
    const tableRef = ref();
    const formRef = ref();
    const formRefFun = (formRefC: Ref) => {
      formRef.value = formRefC;
      if (typeof props.formRef === 'function') {
        props.formRef(formRefC);
      }
    };
    const selectedRows = ref<Array<any>>([]);
    const { selectedRowKeys } = useRowSelection({
      selectedKeys,
      defaultSelectedKeys,
      rowSelection,
    });
    /** 通用的来操作子节点的工具类 */
    const actionRef = ref<ActionType>();
    const formSearch = ref(props.formSearch);
    watch(
      defaultFormSearch,
      (defaultFormSearch) => {
        formSearch.value = { ...formSearch.value, ...defaultFormSearch };
      },
      { deep: true }
    );
    const renderIndex = (data: any) => {
      if (slots.index) {
        return slots.index({
          ...data,
          pagination: pagination.value,
        });
      }
      // 有分页
      if (
        pagination.value &&
        pagination.value.current &&
        pagination.value.pageSize
      ) {
        return (
          data.rowIndex +
          1 +
          (pagination.value.current - 1) * pagination.value.pageSize
        );
      }
      // 没有分页
      return data.rowIndex + 1;
    };
    /** 获取 table 的 dom ref */
    const rootRef = ref<HTMLDivElement>();

    const tableColumns = computed(() => {
      return genProColumnToColumn({
        columns: props.columns,
        type: props.type,
        columnEmptyText: props.columnEmptyText,
        action: actionRef,
        slots: {
          ...slots,
          index: renderIndex,
        },
      });
    });

    const { _filters, _sorter } = useFilterSorter({
      columns: tableColumns,
    });

    const fetchData = computed(() => {
      if (!props.request) return undefined;
      return async (pageParams?: Record<string, any>) => {
        const actionParams = {
          ...(pageParams || {}),
          ...formSearch.value,
          ...props.params,
        };
        delete (actionParams as any)._timestamp;
        const response = await props.request(
          actionParams,
          _sorter.value,
          _filters.value
        );
        return response;
      };
    });
    const fetchPagination = computed(() =>
      typeof propsPagination.value === 'object'
        ? (propsPagination.value as PaginationProps)
        : { defaultCurrent: 1, defaultPageSize: 20, pageSize: 20, current: 1 }
    );
    const options = reactive({
      pageInfo: fetchPagination.value,
      effects: [props.params, formSearch, _sorter, _filters],
    });
    const action = useFetchData(fetchData.value, props, emit, options);
    const data = computed(() =>
      props.request ? action.data.value : props.data || []
    );
    const noRowSelection = computed(() => !rowSelection.value);
    watch(
      [selectedRowKeys, data, noRowSelection, action.loading],
      ([selectedRowKeys, data, noRowSelection, loading]) => {
        if (loading || noRowSelection) {
          return;
        }
        const duplicateRemoveMap = new Map();
        if (data.length) {
          const rows: any[] = [...data, ...selectedRows.value].filter(
            (item, index) => {
              if (!props.rowKey) {
                return selectedRowKeys.includes(index);
              }
              const rowKey = item[props.rowKey];
              if (duplicateRemoveMap.has(rowKey)) {
                return false;
              }
              duplicateRemoveMap.set(rowKey, true);
              return selectedRowKeys.includes(rowKey);
            }
          );
          selectedRows.value = rows;
          return;
        }
        selectedRows.value = [];
      }
    );

    /** 清空所有的选中项 */
    const onCleanSelected = () => {
      if (props.rowSelection && props.rowSelection.onChange) {
        props.rowSelection.onChange([], []);
      }
    };

    useActionType(actionRef, action, {
      fullScreen: () => {
        if (!rootRef.value || !document.fullscreenEnabled) {
          return;
        }
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          rootRef.value.requestFullscreen();
        }
      },
      onCleanSelected: () => {
        // 清空选中行
        onCleanSelected();
      },
      resetAll: () => {
        // 清空选中行
        onCleanSelected();
        // 重置页码
        action.setPageInfo({
          current: 1,
        });
        // 清空筛选
        _filters.value = {};
        // 清空排序
        _sorter.value = undefined;
        // 重置表单
        formRef?.value?.resetFields();
        formSearch.value = {};
      },
    });
    const pagination = computed(() => {
      return (
        props.pagination !== false &&
        mergePagination<any[]>(
          props.pagination,
          action.pageInfo,
          action.setPageInfo,
          emit
        )
      );
    });
    const handleChange = (
      data: TableData[],
      extra: TableChangeExtra,
      currentData: TableData[]
    ) => {
      _sorter.value = extra.sorter;
      _filters.value = extra.filters;
      emit('change', data, extra, currentData);
    };
    const onSubmit = (formData: any) => {
      formSearch.value = props.beforeSearchSubmit({
        ...formData,
        _timestamp: Date.now(),
      });
      action.setPageInfo?.({
        current: 1,
      });
      emit('submit', formData);
    };
    const onReset = () => {
      props.beforeSearchSubmit({});
      formSearch.value = {};
      action.setPageInfo?.({
        current: 1,
      });
      emit('reset');
    };

    const onCancel = () => {
      emit('cancel');
    };

    // 行点击选中
    const handleRowClick = (record: TableData, ev: Event) => {
      ev.stopPropagation();
      ev.preventDefault();
      if (!props.rowSelection) {
        return;
      }
      const rowKey: any = record[props.rowKey];
      const checked = selectedRowKeys.value.includes(rowKey);
      tableRef.value.select(rowKey, !checked);
      emit('select', toRaw(selectedRowKeys.value), rowKey, record);
    };

    const handleSelect = (
      rowKeys: (string | number)[],
      rowKey: string | number,
      record: TableData
    ) => {
      emit('select', rowKeys, rowKey, record);
    };

    const ToolBar = () => {
      // 操作列表
      const data = {
        action,
        selectedRowKeys: selectedRowKeys.value,
        selectedRows: selectedRows.value,
      };
      const actions: VNodeTypes[] = props.toolBarRender
        ? props.toolBarRender(data)
        : [];
      return (
        <div class={`${prefixCls}-toolbarContainer`}>
          <div class={`${prefixCls}-title`}>{props.headerTitle}</div>
          <a-space>
            {slots['tool-bar']?.(data)}
            {actions
              .filter((item) => !!item)
              .map((node, index) => (
                <Fragment key={index}>{node}</Fragment>
              ))}
          </a-space>
        </div>
      );
    };

    const formData = {
      onSubmit: (values: any) => {
        onSubmit({ ...formSearch.value, ...values });
      },
      onReset,
    };
    const render = () => {
      return (
        <a-card bordered={false}>
          {slots['form-search']?.(formData)}
          {!slots['form-search'] &&
            props.search &&
            props.searchType === 'light' && (
              <LightFormSearch
                columns={props.columns}
                onSubmit={(values) => {
                  onSubmit({ ...formSearch.value, ...values });
                }}
                onReset={onReset}
                onSearch={(value) => {
                  formSearch.value = { ...formSearch.value, ...value };
                }}
                type={props.type}
                formSearch={formSearch.value}
                formRef={formRefFun}
                search={props.lightSearchConfig}
                defaultFormData={props.defaultFormData}
                v-slots={slots}
              />
            )}
          {!slots['form-search'] &&
            ((props.search && props.searchType === 'query') ||
              props.type === 'form') && (
              <FormSearch
                columns={props.columns}
                onSubmit={onSubmit}
                onReset={onReset}
                onCancel={onCancel}
                type={props.type}
                search={props.search}
                formRef={formRefFun}
                defaultFormData={props.defaultFormData}
                v-slots={slots}
              />
            )}
          {props.type !== 'form' && (
            <div>
              {props.toolBarRender !== false &&
                (props.headerTitle || props.toolBarRender) &&
                ToolBar()}
              <Table
                ref={tableRef}
                {...props}
                {...attrs}
                columns={tableColumns.value}
                loading={action.loading.value || props.loading}
                data={data.value}
                onChange={handleChange}
                v-slots={{
                  ...slots,
                  index: renderIndex,
                }}
                pagination={pagination.value}
                v-model:selectedKeys={selectedRowKeys.value}
                onRowClick={!props.rowSelection ? undefined : handleRowClick}
                onSelect={handleSelect}
              ></Table>
            </div>
          )}
        </a-card>
      );
    };
    return {
      render,
      selectedRowKeys,
      selectedRows,
      tableRef,
      action,
      onSubmit,
      onReset,
    };
  },
  render() {
    return this.render();
  },
});
