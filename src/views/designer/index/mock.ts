// eslint-disable-next-line import/no-extraneous-dependencies
import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { getObject } from '@/utils/storage';

const fields = [
  {
    type: 'input',
    name: '单行文本',
    options: {
      isRow: false,
      rowCol: 1,
      show: true,
      required: false,
      help: '',
      showTitle: true,
      placeholder: '请输入',
      defaultValue: '',
      disabled: false,
      effect: [],
    },
    key: '1686491105006',
    model: 'input_1686491105006',
  },
  {
    type: 'amountInput',
    name: '金额输入框',
    options: {
      isRow: false,
      rowCol: 1,
      show: true,
      required: false,
      help: '',
      showTitle: true,
      placeholder: '请输入',
      defaultValue: '',
      disabled: false,
      effect: [],
      unit: '元',
    },
    key: '1686491106405',
    model: 'amountInput_1686491106405',
  },
  {
    type: 'popUpTable',
    name: '弹窗选择',
    icon: 'el-icon-copy-document',
    options: {
      isRow: false,
      rowCol: 2,
      show: true,
      showTitle: true,
      required: false,
      help: '',
      defaultValue: '',
      placeholder: '请选择',
      disabled: false,
      max: 1,
      remote: false,
      customUrl: '',
      rowKey: '',
      columns: [],
      buttons: [],
      popUpMethod: 'GET',
      trigger: [],
      effect: [],
    },
    key: '1686491107973',
    model: 'popUpTable_1686491107973',
  },
  {
    type: 'popUpDetail',
    name: '弹窗选择明细',
    options: {
      isRow: true,
      rowCol: 1,
      show: true,
      showTitle: true,
      required: false,
      help: '',
      defaultValue: '',
      placeholder: '请选择',
      effect: [],
      associateModel: '',
      items: [],
      column: 3,
    },
    key: '1686491109701',
    model: 'popUpDetail_1686491109701',
  },
  {
    type: 'multiAdd',
    name: '动态表单',
    columns: [
      {
        type: 'input',
        name: '单行文本',
        options: {
          isRow: false,
          rowCol: 1,
          show: true,
          required: false,
          help: '',
          showTitle: true,
          placeholder: '请输入',
          defaultValue: '',
          disabled: false,
          effect: [],
        },
        key: '1686491155277',
        model: 'input_1686491155277',
      },
      {
        type: 'amountInput',
        name: '金额输入框',
        options: {
          isRow: false,
          rowCol: 1,
          show: true,
          required: false,
          help: '',
          showTitle: true,
          placeholder: '请输入',
          defaultValue: '',
          disabled: false,
          effect: [],
          unit: '万元',
        },
        key: '1686491158252',
        model: 'amountInput_1686491158252',
      },
    ],
    options: {
      isRow: true,
      rowCol: 1,
      show: true,
      required: false,
      help: '',
      showTitle: true,
      defaultValue: [],
      disabled: false,
      effect: [],
    },
    key: '1686491111568',
    model: 'multiAdd_1686491111568',
  },
];

function getDesigner() {
  const data = getObject('designer-data') || fields;
  return successResponseWrap(data);
}

setupMock({
  setup() {
    Mock.mock(new RegExp('/api/designer/detail'), getDesigner);
  },
});
