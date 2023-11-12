import { Ref } from 'vue';
import type {
  ProTableProps,
  ToolBarData,
  UseFetchDataAction,
} from '@arco-vue-pro-components/pro-components';

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

export interface ButtonData {
  type: 'column' | 'toolbar';
  data?: ToolBarData<any>;
  record?: any;
}

export interface ButtonItem {
  // action: 1 toolbar ,2 操作按钮, 3 即时操作按钮也是toolbar按钮如删除
  action: number;
  path: string | ((record: any) => string);
  // type: column 列表操作, toolbar: 工具栏
  name: string | ((data: ButtonData) => string);
  // 按钮是否显示
  show: (data: ButtonData) => boolean;
  alias: string;
  handleClick: ({
    record,
    action,
    data,
    type,
  }: {
    record?: any;
    action?: UseFetchDataAction;
    data?: ToolBarData<any>;
    type: 'column' | 'toolbar';
  }) => any;
  getCustomConfirm: (record: any) => any;
}
export interface TableListProps extends ProTableProps {
  model?: boolean;
  buttons?: ButtonItem[];
  url?: string;
  beforeUpdate?: (fields: any) => any;
  beforeSave?: (record: any) => any;
  cache?: boolean;
  showOption?: boolean;
  optionWidth?: number;
}
