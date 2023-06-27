import { Ref } from 'vue';
import { ProTableProps, ToolBarData } from '../ProTable/interface';
import { UseFetchDataAction } from '../ProTable/components/useFetchData';

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
  rowIndex: number;
}
export interface ButtonItem {
  // action: 1 toolbar ,2 操作按钮, 3 即时操作按钮也是toolbar按钮如删除
  action: number;
  path: string | ((record: any) => string);
  // type: column 列表操作, toolbar: 工具栏
  name: string | ((data: ButtonData) => string);
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
  // 按钮是否显示
  show: (data: ButtonData) => boolean;
}

export interface ButtonData {
  type: 'column' | 'toolbar';
  data?: ToolBarData<any>;
  record?: any;
}

export interface TableFormProps extends ProTableProps {
  modelValue?: any[];
  defaultValue?: any[];
  model?: boolean;
  buttons?: ButtonItem[];
  url?: string;
  beforeUpdate?: (fields: any) => any;
  beforeSave?: (record: any) => any;
  cache?: boolean;
  showOption?: boolean;
  optionWidth?: number;
  simple?: boolean;
}
