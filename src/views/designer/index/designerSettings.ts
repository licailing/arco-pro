export const settings = [
  {
    name: '基础字段',
    list: [
      {
        type: 'input',
        name: '单行文本',
        options: {
          isRow: false, // 是否独占一行
          rowCol: 1, // 占一列
          show: true,
          required: false,
          help: '', // 提示语
          showTitle: true,
          placeholder: '请输入',
          defaultValue: '',
          disabled: false,
          effect: [],
        },
      },
      {
        type: 'amountInput',
        name: '金额输入框',
        options: {
          isRow: false, // 是否独占一行
          rowCol: 1, // 占一列
          show: true,
          required: false,
          help: '', // 提示语
          showTitle: true,
          placeholder: '请输入',
          defaultValue: '',
          disabled: false,
          effect: [],
          unit: '元',
        },
      },
    ],
  },
  {
    name: '高级组件',
    list: [
      {
        type: 'popUpTable',
        name: '弹窗选择',
        icon: 'el-icon-copy-document',
        options: {
          isRow: false, // 是否独占一行
          rowCol: 1, // 占一列
          show: true, // 是否显示
          showTitle: true, // 标题是否显示
          required: false,
          help: '', // 提示语
          defaultValue: '', // 表单字段名称
          placeholder: '请选择', // 填写说明
          disabled: false, // 是否可输入
          max: 1, // 可选中多少个
          remote: false,
          customUrl: '', // 自定义请求链接地址
          rowKey: '', // 行主键
          columns: [], // table字段设置
          buttons: [], // 操作按钮list
          popUpMethod: 'GET', // 接口请求类型
          trigger: [], // 字段联动触发器
          effect: [],
        },
      },
      {
        type: 'popUpDetail',
        name: '弹窗选择明细',
        options: {
          isRow: true, // 是否独占一行
          rowCol: 1, // 占一列
          show: true, // 是否显示
          showTitle: true, // 标题是否显示
          required: false,
          help: '', // 提示语
          defaultValue: '', // 表单字段名称
          placeholder: '请选择', // 填写说明
          effect: [],
          associateModel: '', // 关联字段
          items: [], // 配置的描述列表字段
          column: 3, // 每行放置的数据个数
        },
      },

      {
        type: 'multiAdd',
        name: '动态表单',
        columns: [],
        options: {
          isRow: true, // 是否独占一行
          rowCol: 1, // 占一列
          show: true,
          required: false,
          help: '', // 提示语
          showTitle: true,
          defaultValue: [],
          disabled: false,
          effect: [],
        },
      },
    ],
  },
];
