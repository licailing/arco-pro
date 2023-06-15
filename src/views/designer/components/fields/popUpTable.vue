<template>
  <div>
    <a-form-item label="请求链接" field="options.customUrl">
      <a-input v-model="data.options.customUrl"></a-input>
    </a-form-item>
    <a-form-item label="最大限制" field="options.max">
      <InputDecimal
        v-model="data.options.max"
        type="digit"
        :max="100"
      ></InputDecimal>
    </a-form-item>
    <a-form-item
      field="options.columns"
      :wrapper-col-props="{ span: 24 }"
      label="弹窗字段"
    >
      <TableForm
        v-model="data.options.columns"
        :buttons="buttons"
        :draggable="{ type: 'handle', width: 40 }"
        :columns="columns"
        row-key="dataIndex"
      >
      </TableForm>
    </a-form-item>
  </div>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import { usePureProp } from '@arco-design/web-vue/es/_hooks/use-pure-prop';

  const props = defineProps({
    field: {
      type: Object,
      required: true,
      default: () => {},
    },
  });
  const emit = defineEmits({
    'update:field': (field) => true,
  });

  const data = usePureProp(props, 'field');

  watch(
    data,
    (val) => {
      emit('update:field', val);
    },
    {
      deep: true,
    }
  );

  const columns = [
    {
      dataIndex: 'dataIndex',
      title: '字段ID',
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入字段ID',
          },
        ],
      },
    },
    {
      dataIndex: 'title',
      title: '字段名称',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入字段名称',
          },
        ],
      },
    },
    {
      dataIndex: 'showInSearch',
      title: '是否支持检索',
      hideInTable: true,
      valueType: 'radioGroup',
      fieldProps: {
        defaultValue: false,
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
      },
    },
  ];
  const buttons = [
    {
      action: 1,
      alias: 'add',
      name: '新增弹窗字段',
    },
    {
      action: 2,
      alias: 'edit',
      name: '编辑',
    },
    {
      action: 2,
      alias: 'delete',
      name: '删除',
    },
  ];
</script>
<script lang="ts">
  export default {
    name: 'FieldPopUpTable',
  };
</script>
<style lang="less" scoped>
  .field {
    width: 400px;
    margin: 0 auto;

    &--base {
      border: 1px solid #bababa;
      height: 500px;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    &--table {
      padding: 12px;
      border: 1px dashed #bababa;
      min-height: 120px;
      overflow: scroll;
      background: #fff;
    }
  }

  .fieldContent {
    padding: 12px;
    height: 100%;
  }

  .widget-form-list {
    height: 100%;
  }

  .listHeader {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #ddd;

    li {
      flex: 1;
    }
  }

  .listItem {
    display: flex;
    align-items: center;
  }

  .drag-item {
    font-size: 16px;
    margin: 0 10px;
    cursor: move;
  }
</style>
