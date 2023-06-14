<template>
  <div :class="{ shape: true, [`shape--${type}`]: type }">
    <VueDraggableNext
      class="shapeContent"
      v-bind="{ group: 'widget', ghostClass: 'ghost', animation: 200 }"
      :model-value="data"
      @update:model-value="update"
      @add="handleAdd"
    >
      <transition-group name="fade">
        <div
          v-for="(item, index) in data"
          :key="item.key"
          class="shapeItem"
          @click.stop="handleClick(index)"
        >
          <!-- 可重复使用或复杂的 -->
          <component
            :is="getComponent(item.type)"
            :active="activeKey === item.key"
            v-bind="item"
            :item="item"
            :index="index"
            @change="handleChange"
          >
          </component>
          <a-button
            v-if="activeKey === item.key"
            status="danger"
            class="remove"
            shape="circle"
            @click.stop="handleRemove(index)"
          >
            <icon-delete />
          </a-button>
        </div>
      </transition-group>
    </VueDraggableNext>
    <slot v-if="type === 'base'"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, inject, watch, computed } from 'vue';
  import { VueDraggableNext } from 'vue-draggable-next';
  import { usePureProp } from '@arco-design/web-vue/es/_hooks/use-pure-prop';
  import ShapeBase from './base.vue';
  import ShapeChooseInput from './chooseInput.vue';
  import ShapeMultiAdd from './multiAdd.vue';
  import { DesignContext, designInjectionKey } from '../../index/context';

  const props = defineProps({
    type: String,
    list: Array,
    formSetting: Object,
  });

  const getComponent = (type: any) => {
    // 外形有长一样的
    const shapeSettings = {
      popUpTable: ShapeChooseInput,
      multiAdd: ShapeMultiAdd,
    };
    return shapeSettings[type] || ShapeBase;
  };
  const designCtx = inject<Partial<DesignContext>>(designInjectionKey, {});
  const data = usePureProp(props, 'list');
  const emit = defineEmits({
    'update:list': (val) => true,
  });
  const update = (val) => {
    if (!val || !val.length) {
      data.value = val;
      return true;
    }
    const newValue = val.map((item) => {
      if (!item.key) {
        const key = `${new Date().getTime()}`;
        return {
          ...item,
          key,
          model: `${item.type}_${key}`,
        };
      }
      return item;
    });
    data.value = newValue;
    return true;
  };
  watch(
    data,
    (val) => {
      console.log('update:list', val);
      emit('update:list', val);
    },
    {
      deep: true,
    }
  );
  const activeKey = computed(() => designCtx?.currentField?.key);
  const handleClick = (index: number) => {
    designCtx?.setCurrentField?.(data.value[index]);
  };
  const handleRemove = (index: number) => {
    if (!Array.isArray(data.value) || !data.value.length) {
      return;
    }
    data.value.splice(index, 1);
    // 删除
    nextTick(() => {
      if (data.value.length === 0) {
        designCtx?.setCurrentField?.(null);
        return;
      }
      let current = index;
      if (index >= data.value.length) {
        current = data.value.length - 1;
      }
      designCtx?.setCurrentField?.(data.value[current]);
    });
  };
  const handleAdd = (e) => {
    const { newIndex } = e;
    nextTick(() => {
      designCtx?.setCurrentField?.(data.value[newIndex]);
    });
  };
  const handleChange = (item, index) => {
    console.log('handleChange', data, index);
    data.value.splice(index, 1, item);
  };
</script>

<script lang="ts">
  export default {
    name: 'Shape',
  };
</script>

<style lang="less" scoped>
  .sContainer {
    display: flex;
  }

  .shapeItem {
    position: relative;
  }

  .shape {
    flex: 1;

    &--base {
      border: 1px solid #bababa;
      padding-bottom: 120px;
    }

    &--multiAdd {
      padding: 12px;
      border: 1px dashed #bababa;
      background: #fff;

      .shapeContent {
        min-height: 120px;
      }
    }
  }

  .shapeContent {
    padding: 12px;
    height: 100%;
  }

  .widget-form-list {
    height: 100%;
  }

  .remove {
    position: absolute;
    font-size: 16px;
    right: 10px;
    bottom: -10px;
    z-index: 99;
  }
</style>
