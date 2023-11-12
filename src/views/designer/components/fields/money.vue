<template>
  <div>
    <a-form-item label="金额单位" field="options.unit">
      <pro-select v-model="data.options.unit" :options="options"> </pro-select>
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

  const options = [
    {
      label: '元',
      value: '元',
    },
    {
      label: '万元',
      value: '万元',
    },
  ];
</script>
<script lang="ts">
  export default {
    name: 'FieldAmountInput',
  };
</script>
<style lang="less" scoped></style>
