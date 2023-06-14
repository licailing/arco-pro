<template>
  <div>
    <a-form-item label="关联字段" field="options.associateModel">
      <auto-list-view
        v-model="data.options.associateModel"
        :options="options"
        label-column="name"
        value-column="model"
      />
    </a-form-item>
    <a-form-item label="每行个数" field="options.column">
      <input-decimal v-model="data.options.column" type="digit" :max="4" />
    </a-form-item>
    <a-form-item
      field="options.items"
      :wrapper-col-props="{ span: 24 }"
      label="弹窗字段"
    >
      <table-form
        v-model="data.options.items"
        :buttons="buttons"
        row-key="dataIndex"
        :draggable="{ type: 'handle', width: 40 }"
        :columns="columns"
      >
      </table-form>
    </a-form-item>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { usePureProp } from '@arco-design/web-vue/es/_hooks/use-pure-prop';

  const props = defineProps({
    field: {
      type: Object,
      required: true,
      default: () => {},
    },
    list: {
      type: Array,
      default: () => [],
      required: true,
    },
  });

  const emit = defineEmits({
    'update:field': (field) => true,
  });

  const data = ref(props.field);
  watch(
    data,
    (val) => {
      emit('update:field', val);
    },
    {
      deep: true,
    }
  );

  const options = computed(() => {
    return props.list.filter((item) => item.key !== props.field?.key);
  });
  const columns = ref([
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
      dataIndex: 'isRow',
      title: '是否占一行',
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
    {
      dataIndex: 'span',
      title: '所占列数',
      hideInTable: true,
      formSlotName: 'spanField',
      valueType: 'digit',
      fieldProps: {
        max: 3,
      },
    },
  ]);
  const buttons = [
    {
      action: 1,
      alias: 'add',
      name: '新增明细字段',
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
    name: 'FieldPopUpDetail',
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
