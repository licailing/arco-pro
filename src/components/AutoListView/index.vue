<template>
  <div style="width: 100%">
    <a-select
      v-bind="props"
      v-model="value"
      :options="undefined"
      :loading="loading"
      :allow-search="isSearch || allowSearch"
      :value-key="valueColumn"
      :allow-create="false"
      allow-clear
      @search="handleSearch"
    >
      <slot>
        <a-option
          v-for="item of options"
          :key="item[valueColumn]"
          :value="item"
          :label="item[labelColumn]"
        />
      </slot>
    </a-select>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, toRef, PropType } from 'vue';
  import { useDebounceFn } from '@vueuse/core';
  import { Select } from '@arco-design/web-vue';
  import axios from 'axios';
  import { isUndefined, isNull } from '@arco-design/web-vue/es/_utils/is';
  import { usePureProp } from '@arco-design/web-vue/es/_hooks/use-pure-prop';

  const fetchData = async ({
    url,
    searchKeyName,
    callback,
    beforeSaveData,
    searchValue,
  }: {
    url: string;
    searchValue: string;
    callback: (data: any[]) => void;
    beforeSaveData: ((result: any) => any[]) | undefined;
    searchKeyName: string | undefined;
  }) => {
    const searchUrl = url.includes('?')
      ? url
      : `${url}?${searchKeyName}=${searchValue}`;
    const result = await axios.get(searchUrl);
    if (callback) {
      if (beforeSaveData && result) {
        const data = beforeSaveData(result);
        callback(data || []);
        return;
      }
      callback(result?.data || []);
    }
  };

  const props = defineProps({
    ...Select.props,
    url: {
      type: String,
    },
    searchKeyName: {
      type: String,
      default: 'search',
    },
    dictCode: String,
    type: {
      type: String as PropType<'select' | 'search'>,
      default: 'select',
    },
    labelColumn: {
      type: String,
      default: 'dictKey',
    },
    valueColumn: {
      type: String,
      default: 'dictValue',
    },
    allowSearch: {
      type: Boolean,
      default: true,
    },
    // system: 系统字典，biz:业务字典
    dictType: {
      type: String as PropType<'system' | 'biz'>,
      default: 'biz',
    },
    beforeSaveData: {
      type: Function as PropType<(data: any) => any>,
    },
  });
  const emit = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'change', value: any, option: object): void;
  }>();

  const modelValue = toRef(props, 'modelValue');
  const options = usePureProp(props, 'options');
  const debounceFetchData = useDebounceFn(fetchData, 300);
  const url = computed(() => {
    if (props.dictCode && !props.url) {
      const dictName = props.dictType === 'system' ? 'dict' : 'dict-biz';
      return `/api/${dictName}/dictionarys?codes=${props.dictCode}`;
    }
    return props.url;
  });
  const getSelectedOption = (modelValue: any) => {
    return options.value?.filter(
      (item: any) => item[props.valueColumn] === modelValue
    )?.[0];
  };
  // 选中对象
  const _value = ref(getSelectedOption(props.defaultValue));

  watch(
    modelValue,
    (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = undefined;
      } else {
        _value.value = getSelectedOption(value);
      }
    },
    {
      immediate: true,
    }
  );

  const value = computed({
    get: () => {
      return _value.value;
    },
    set: (val) => {
      if (isSearch.value && val === undefined) {
        searchValue.value = '';
      }
      _value.value = val;
      emit('update:modelValue', val[props.valueColumn]);
      // 能拿到option对象数据
      emit('change', val[props.valueColumn], val);
    },
  });

  const loading = ref(false);
  const searchValue = ref('');
  const isSearch = ref(props.type === 'search');
  watch(
    options,
    () => {
      _value.value = getSelectedOption(modelValue.value);
    },
    {
      immediate: true,
    }
  );
  watch(
    [url, searchValue],
    () => {
      if (url.value) {
        loading.value = true;
        debounceFetchData({
          url: url.value,
          searchValue: searchValue.value,
          callback: (info: any[]) => {
            options.value = info;
            loading.value = false;
          },
          beforeSaveData: props.beforeSaveData,
          searchKeyName: props.searchKeyName,
        });
      }
    },
    {
      immediate: true,
    }
  );
  function handleSearch(value: string) {
    if (isSearch.value) {
      searchValue.value = value;
    }
  }
</script>

<script lang="ts">
  export default {
    name: 'AutoListView',
  };
</script>
