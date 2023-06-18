// eslint-disable-next-line import/no-extraneous-dependencies
import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';
import { getObject } from '@/utils/storage';

const designerData = {
  list: [
    {
      type: 'input',
      name: '单行文本',
      options: {
        isRow: false,
        rowCol: 1,
        show: true,
        required: true,
        help: '',
        showTitle: true,
        placeholder: '请输入',
        defaultValue: '单行文本',
        disabled: false,
        effect: [],
      },
      key: '1686491105006',
      model: 'input_1686491105006',
    },
    {
      type: 'money',
      name: '金额输入框',
      options: {
        isRow: false,
        rowCol: 1,
        show: true,
        required: true,
        help: '',
        showTitle: true,
        placeholder: '请输入',
        disabled: false,
        effect: [],
        unit: '元',
      },
      key: '1686491106405',
      model: 'money_1686491106405',
    },
    {
      type: 'popUpTable',
      name: '弹窗选择',
      icon: 'el-icon-copy-document',
      options: {
        isRow: false,
        rowCol: 1,
        show: true,
        showTitle: true,
        required: false,
        help: '',
        placeholder: '请选择',
        disabled: false,
        max: 10,
        remote: false,
        customUrl: '/api/designer/user',
        rowKey: '',
        columns: [
          { dataIndex: 'name', title: '姓名', showInSearch: true },
          { dataIndex: 'age', title: '年龄', showInSearch: false },
        ],
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
        placeholder: '请选择',
        effect: [],
        associateModel: 'popUpTable_1686491107973',
        items: [
          { dataIndex: 'name', label: '姓名' },
          { dataIndex: 'age', label: '年龄' },
        ],
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
            required: true,
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
          type: 'money',
          name: '金额输入框',
          options: {
            isRow: false,
            rowCol: 1,
            show: true,
            required: true,
            help: '',
            showTitle: true,
            placeholder: '请输入',
            disabled: false,
            effect: [],
            unit: '万元',
          },
          key: '1686491158252',
          model: 'money_1686491158252',
        },
      ],
      options: {
        isRow: true,
        rowCol: 1,
        show: true,
        required: false,
        help: '',
        showTitle: true,
        disabled: false,
        effect: [],
        showAdd: true,
        addTitle: '+添加',
      },
      key: '1686491111568',
      model: 'multiAdd_1686491111568',
    },
  ],
  formSetting: {
    layout: 'vertical',
    rowCol: 3,
  },
};
const users = Mock.mock({
  'list|150': [
    {
      'id|+1': 1,
      'name|4-8': /[A-Z]/,
      'age|1-2': /[0-9]/,
    },
  ],
});
function getDesigner() {
  const data = getObject('designer-data') || designerData;
  return successResponseWrap(data);
}
function getUserLiser(options: GetParams) {
  const { url } = options;
  const params = qs.parseUrl(url).query as any;
  const p = (params.current as number) || 1;
  const ps = (params.pageSize as number) || 20;

  let dataSource: any[] = users.list;

  if (params.name) {
    dataSource = dataSource.filter((data) =>
      data.name.includes(params.name || '')
    );
  }

  if (params.age) {
    dataSource = dataSource.filter((data) =>
      data.age.includes(params.age || '')
    );
  }

  const result = {
    list: dataSource.slice((p - 1) * ps, p * ps),
    total: dataSource.length,
  };
  return successResponseWrap(result);
}
setupMock({
  setup() {
    Mock.mock(new RegExp('/api/designer/detail'), getDesigner);
    Mock.mock(new RegExp('/api/designer/user'), getUserLiser);
  },
});
