<template>
  <ShapeBase v-bind="item">
    <div class="add-container">
      <div v-if="!data.columns.length" class="add-title">
        请将组件拖入到下方白色块中
      </div>
      <Shape v-model:list="data.columns" type="multiAdd"></Shape>
      <div v-if="data.options.showAdd" class="add-txt">{{
        data.options.addTitle || '+添加'
      }}</div>
    </div>
  </ShapeBase>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import ShapeBase from './base.vue';
  import Shape from './shape.vue';

  const props = defineProps({
    item: {
      type: Object,
      default: () => {},
    },
    index: Number,
  });
  const emit = defineEmits({
    change: (val, index) => true,
  });
  const data = ref(props.item);
  watch(
    data,
    (val) => {
      emit('change', val, props.index);
    },
    {
      deep: true,
    }
  );
</script>
<script lang="ts">
  export default {
    name: 'ShapeMultiAdd',
  };
</script>

<style lang="less" scoped>
  .add-container {
    width: 100%;
  }

  .add-title {
    background: #bcaeae;
    text-align: center;
    line-height: 32px;
  }

  .add-txt {
    text-align: center;
    margin-top: 10px;
  }
</style>
