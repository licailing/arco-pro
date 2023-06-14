<template>
  <ShapeBase v-bind="$attrs">
    <template #default="data">
      <a-input-search
        :placeholder="data.options?.placeholder"
        button-text="选择"
        search-button
      />
    </template>
  </ShapeBase>
</template>

<script setup lang="ts">
  import ShapeBase from './base.vue';
</script>
<script lang="ts">
  export default {
    name: 'ShapeChooseInput',
  };
</script>
