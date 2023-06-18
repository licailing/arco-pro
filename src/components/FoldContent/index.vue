<template>
  <div :class="['container', `container--${layout}`]">
    <div class="content">
      <slot :collapsed="collapsed" :content="_content">
        <span>{{ content }}</span>
      </slot>
    </div>
    <slot v-if="showCollapsed" name="button" :collapsed="collapsed">
      <div class="button" @click.stop.prevent="handleClick">
        <span v-if="collapsed">展开</span>
        <span v-else>收起</span>
        <icon-down
          v-if="layout === 'vertical'"
          class="button-icon"
          :style="{
            verticalAlign: 'middle',
            fontSize: '16px',
            marginRight: '8px',
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
          }"
        />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
  import { ref, PropType, computed } from 'vue';

  const props = defineProps({
    content: {
      type: [String, Array],
    },
    length: {
      type: Number,
      default: 30,
    },
    layout: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'horizontal',
    },
    defaultText: {
      type: String,
      default: '-',
    },
  });
  // 默认关闭
  const collapsed = ref(true);
  const showCollapsed = computed(() => {
    if (Array.isArray(props.content) || typeof props.content === 'string') {
      return props.content.length > props.length;
    }
    return false;
  });
  const _content = computed(() => {
    if (Array.isArray(props.content) && props.content.length > 0) {
      return collapsed.value
        ? props.content.slice(0, props.length)
        : props.content;
    }
    return props.content || props.defaultText;
  });
  const handleClick = () => {
    collapsed.value = !collapsed.value;
  };
</script>

<script lang="ts">
  export default {
    name: 'FoldContent',
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &--vertical {
      flex-direction: column;
      justify-content: stretch;
      .button {
        padding: 8px;
      }
    }
  }
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: rgb(var(--primary-6));
  }
  .button-icon {
  }
</style>
