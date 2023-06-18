<template>
  <div
    v-show="show"
    class="shape-container"
    :class="{
      [`shape-container--active`]: active,
      [`shape-container--${type}`]: type,
    }"
  >
    <a-form-item
      v-show="show"
      :field="options.model"
      :tooltip="options.help"
      :label="options.showTitle ? name : ''"
      :required="options.required"
    >
      <slot v-bind="$props">
        <!-- 文本 -->
        <a-input
          v-if="type == 'input'"
          :placeholder="options.placeholder"
          :model-value="options.defaultValue"
        ></a-input>
        <!-- 金额输入框 -->
        <div v-if="type == 'amountInput'" style="width: 100%">
          <a-input-number
            :placeholder="options.placeholder"
            :model-value="options.defaultValue"
          >
            <template #suffix>
              {{ options.unit }}
            </template>
          </a-input-number>
          <div class="amount-input-txt">大写金额</div>
        </div>
        <!-- 弹窗选择明细 -->
        <a-descriptions
          v-if="type == 'popUpDetail'"
          :column="1"
          :data="options.items"
          layout="inline-horizontal"
        />
      </slot>
    </a-form-item>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    index: {
      type: Number,
    },
    active: Boolean,
    options: {
      type: Object,
      default: () => {},
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: String,
    show: {
      type: Boolean,
      default: true,
    },
    name: String,
  });
</script>
<script lang="ts">
  export default {
    name: 'ShapeBase',
  };
</script>

<style lang="less" scoped>
  .shape-container {
    position: relative;
    padding: 12px;
    margin-bottom: 20px;
    font-size: 14px;
    background: #f4fcff;
    border-radius: 6px;

    &--active {
      border: 1px solid rgb(var(--primary-6));
    }

    &--multiAdd {
      &::after {
        display: none;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  .title {
    &::after {
      content: ':';
    }
  }

  .amount-input-txt {
    margin-top: 10px;
    text-align: right;
  }
</style>
