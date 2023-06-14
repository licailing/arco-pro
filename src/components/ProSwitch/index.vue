<!-- Arco Design Switch -->
<template>
  <a-switch v-bind="{ ...$props, ...$attrs }" />
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent } from 'vue';
  import { Switch } from '@arco-design/web-vue';

  export default defineComponent({
    name: 'ProSwitch',
    props: {
      ...Switch.props,
      /**
       * @zh 绑定值
       * @en Value
       */
      modelValue: {
        type: [String, Number, Boolean],
        default: 0,
      },
      /**
       * @zh 选中时的值
       * @en Value when checked
       * @version 2.12.0
       */
      checkedValue: {
        type: [String, Number, Boolean],
        default: 1,
      },
      /**
       * @zh 未选中时的值
       * @en Value when unchecked
       * @version 2.12.0
       */
      uncheckedValue: {
        type: [String, Number, Boolean],
        default: 0,
      },
      /**
       * @zh switch 状态改变前的钩子， 返回 false 或者返回 Promise 且被 reject 则停止切换。
       * @en before-change hook before the switch state changes. If false is returned or a Promise is returned and then is rejected, will stop switching
       * @version 2.37.0
       */
      beforeChange: {
        type: Function as PropType<
          (
            newValue: string | number | boolean | undefined
          ) => Promise<boolean | void> | boolean | void
        >,
      },
    },
    setup(props, { emit }) {},
  });
</script>
