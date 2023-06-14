import { Ref, VNode, VNodeChild, VNodeTypes } from 'vue';
import type {
  GridItemProps,
  InputSearchInstance,
  TableColumnData,
} from '@arco-design/web-vue';
import { TableProps } from '@arco-design/web-vue/es/table/interface';
import {
  UseFetchDataAction,
  RequestData,
  PageInfo,
} from './components/useFetchData';
import { SearchConfig } from './components/form-search';
import { StatusType } from './components/status';

export type ProTableTypes = 'form' | 'table';
export interface RenderData {
  record: any;
  column: any;
  rowIndex: number;
}
/**
 * 数字框
 * digit 数字，不能输入小数
 * decimal 可输入小数
 * percent 百分比如89.918,最大100
 * money 金额
 * option 操作按钮 数组
 * date 日期 YYYY-MM-DD
 * dateRange 日期范围 YYYY-MM-DD[]
 * dateTime 日期和时间 YYYY-MM-DD HH:mm:ss
 * dateTimeRange 范围日期和时间 YYYY-MM-DD HH:mm:ss[]
 * time: 时间 HH:mm:ss
 * index：序列
 */
export type ProColumnsValueType =
  | 'digit'
  | 'decimal'
  | 'percent'
  | 'money'
  | 'textarea'
  | 'select'
  | 'option'
  | 'date'
  | 'dateRange'
  | 'dateTimeRange'
  | 'dateTime'
  | 'time'
  | 'text'
  | 'index'
  | 'checkbox'
  | 'radioGroup'
  | 'switch'
  | 'hidden'
  | 'progress'
  | 'code'
  | 'avatar'
  | 'uploadFile';

/**
 * value type by function
 */
export type ProColumnsValueTypeFunction<T> = (
  item: T
) => ProColumnsValueType | ProColumnsValueObjectType;

export interface RenderFormItemData {
  item: ProColumns;
  formModel: Ref;
  formRef: Ref;
}
// function return type
export type ProColumnsValueObjectType = {
  type: 'progress' | 'money' | 'percent';
  status?: 'normal' | 'active' | 'success' | 'exception' | undefined;
  locale?: string;
  /** percent */
  showSymbol?: boolean;
  precision?: number;
};
export interface LightSearchConfig {
  rowNumber?: number;
  name?: string;
  search?: InputSearchInstance | boolean;
}

export type ValueEnumObj = {
  [key: string]:
    | {
        text: VNodeTypes;
        status: StatusType;
      }
    | VNodeTypes;
};

export type ValueEnumMap = Map<
  any,
  | {
      text: VNodeChild;
      status: StatusType;
    }
  | VNodeChild
>;
export interface ProColumns
  extends Omit<TableColumnData, 'dataIndex' | 'title' | 'render' | 'children'> {
  dataIndex: string;
  order?: number;
  key?: string;
  children?: ProColumns[];
  title?: string | ((item: ProColumns, type: ProTableTypes) => VNodeChild);
  /**
   * a-form-item 搜索表单的 props
   */
  formItemProps?: { [prop: string]: any };
  /**
   *  搜索表单项 props
   */
  fieldProps?: { [prop: string]: any };
  /**
   *  搜索表单gird项 props
   */
  girdItemProps?: GridItemProps;
  /**
   * 搜索表单的默认值
   */
  defaultValue?: any;
  /**
   * 值的类型
   */
  valueType?: ProColumnsValueType | ProColumnsValueTypeFunction<any>;
  renderFormItem?: (data: RenderFormItemData) => VNodeTypes | 'hidden';
  hideInSearch?: boolean;
  hideInTable?: boolean;
  hideInForm?: boolean;
  // 搜索自定义
  formSlotName?: string;
  /**
   * 值的枚举，如果存在枚举，Search 中会生成 select
   */
  valueEnum?: ValueEnumObj;
  /**
   * 自定义 render
   */
  render?: (data: {
    text: VNodeChild;
    record: any;
    rowIndex: number;
    action: UseFetchDataAction<RequestData<any>>;
  }) => VNodeChild;
  /**
   * 自定义 render，但是需要返回 string
   */
  renderText?: (
    text: any,
    data: {
      record: any;
      rowIndex: number;
      action: UseFetchDataAction<RequestData<any>>;
    }
  ) => any;
  copyable?: boolean;
}

export type ColumnEmptyText = string | false;

export interface ProTableProps extends Omit<TableProps, 'columns'> {
  columns: ProColumns[];
  type?: ProTableTypes;
  params?: { [key: string]: any };
  /**
   * 一个获得 dataSource 的方法
   */
  request?: (
    params: {
      pageSize?: number;
      current?: number;
      [key: string]: any;
    },
    sort: {
      [key: string]: 'ascend' | 'descend';
    },
    filter: { [key: string]: string }
  ) => Promise<RequestData<any>>;
  /**
   * 渲染操作栏
   */
  toolBarRender?: ToolBarProps<any>['toolBarRender'] | false;
  /**
   * 左上角的 title
   */
  headerTitle?: VNodeTypes;
  /**
   * 是否显示搜索表单
   */
  search?: boolean | SearchConfig;
  /**
   * 格式化搜索表单提交数据
   */
  beforeSearchSubmit?: (params: Partial<any>) => Partial<any>;
  /**
   * 搜索表单默认搜索
   */
  formSeach?: object;
  /**
   * 搜索表单默认搜索值
   */
  defaultFormData?: object;
  // 搜索类型
  searchType?: 'query' | 'light';
  lightSearchConfig?: LightSearchConfig;
  /**
   * 空值时显示
   */
  columnEmptyText?: ColumnEmptyText;
}

export type UseFetchProps = {
  data?: any;
  loading: UseFetchDataAction['loading'];
  postData: any;
  pageInfo:
    | {
        current?: number;
        pageSize?: number;
        defaultCurrent?: number;
        defaultPageSize?: number;
      }
    | false;
  effects?: any[];
};
export type DensitySize = 'small' | 'default' | 'middle' | undefined;
export interface ProTableContext {
  action: UseFetchDataAction<RequestData<any>>;
  // setAction: (ref: Ref<UseFetchDataAction<RequestData<any>>>) => void;
  columns: Ref<ProColumns[]>;
  // setColumns: (columns: ProColumns[]) => void;
}

/** 操作类型 */
export type ProCoreActionType<T = {}> = {
  /** @name 刷新 */
  reload: (resetPageIndex?: boolean) => Promise<void>;
  /** @name 刷新并清空，只清空页面，不包括表单 */
  reloadAndRest?: () => Promise<void>;
  /** @name 重置任何输入项，包括表单 */
  reset?: () => void;
  /** @name 清空选择 */
  clearSelected?: () => void;
  /** @name p页面的信息都在里面 */
  pageInfo?: Ref<PageInfo>;
} & T;

export type ActionType = ProCoreActionType & {
  fullScreen?: () => void;
  setPageInfo?: (page: Partial<PageInfo>) => void;
};

export interface ToolBarData<T> {
  action: UseFetchDataAction<RequestData<T>>;
  selectedRowKeys: (string | number)[];
  selectedRows: T[];
}

export interface ToolBarProps<T = unknown> {
  headerTitle?: VNodeTypes;
  formLabel?: VNodeTypes;
  toolBarRender?: (data: ToolBarData<T>) => VNodeTypes[];
  action: UseFetchDataAction<RequestData<T>>;
  selectedRowKeys?: Ref<(string | number)[]>;
  selectedRows?: Ref<any[]>;
  onSearch?: (keyWords: string) => void;
}
