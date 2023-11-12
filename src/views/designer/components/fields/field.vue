<template>
  <div>
    <!-- 公共设置 -->
    <a-form-item field="options.isRow" label="占一行">
      <a-checkbox v-model="data.options.isRow"></a-checkbox>
    </a-form-item>
    <a-form-item
      v-if="formRowCol >= 1"
      v-show="!data.options.isRow"
      field="options.rowCol"
      label="布局"
    >
      <a-radio-group v-model="data.options.rowCol" type="button">
        <a-radio v-for="item in formRowCol" :key="item" :value="item"
          >{{ item }}列</a-radio
        >
      </a-radio-group>
    </a-form-item>
    <a-form-item
      field="model"
      label="字段名"
      :rules="[{ required: true, message: '不能为空' }]"
    >
      <a-input v-model="data.model"></a-input>
    </a-form-item>
    <a-form-item field="options.showTitle" label="显示标题">
      <a-checkbox v-model="data.options.showTitle"></a-checkbox>
    </a-form-item>
    <a-form-item label="必填" field="options.required">
      <a-switch v-model="data.options.required"></a-switch>
    </a-form-item>
    <a-form-item field="name" label="标题">
      <a-input v-model="data.name"></a-input>
    </a-form-item>
    <a-form-item
      v-if="'defaultValue' in data.options"
      field="options.defaultValue"
      label="默认值"
    >
      <a-input v-model="data.options.defaultValue"></a-input>
    </a-form-item>
    <a-form-item field="options.help" label="提示语">
      <a-textarea v-model="data.options.help" allow-clear></a-textarea>
    </a-form-item>
    <!-- 动态表单 -->
    <template v-if="data.type === 'multiAdd'">
      <a-form-item label="是否添加" field="options.showAdd">
        <a-checkbox v-model="data.options.showAdd"></a-checkbox>
      </a-form-item>
      <a-form-item label="添加标题" field="options.addTitle">
        <a-input v-model="data.options.addTitle"></a-input>
      </a-form-item>
    </template>
    <!-- 动态表单 -->
    <!-- 特有属性设置 -->
    <component
      :is="fieldComponent"
      v-if="fieldComponent"
      v-bind="$props"
      :field="data"
      @update:field="handleChange"
    ></component>
  </div>
</template>

<script setup lang="ts">
  import { inject, computed, watch } from 'vue';
  import { usePureProp } from '@arco-design/web-vue/es/_hooks/use-pure-prop';
  import { DesignContext, designInjectionKey } from '../../index/context';
  import FieldPopUpTable from './popUpTable.vue';
  import FieldPopUpDetail from './popUpDetail.vue';
  import Money from './money.vue';

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
  const designCtx = inject<Partial<DesignContext>>(designInjectionKey, {});
  const formRowCol = computed(
    () => (designCtx?.formSetting?.value?.rowCol || 3) - 1
  );
  const fieldSettings: any = {
    popUpTable: FieldPopUpTable,
    money: Money,
    popUpDetail: FieldPopUpDetail,
  };
  const fieldComponent = computed(() =>
    props.field?.type ? fieldSettings[props.field.type] : undefined
  );

  const handleChange = (field: object) => {
    emit('update:field', field);
  };
</script>
<script lang="ts">
  export default {
    name: 'Field',
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
</style>
