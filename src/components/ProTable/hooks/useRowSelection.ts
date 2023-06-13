import type { Ref } from 'vue';
import { computed, ref } from 'vue';
import { TableRowSelection } from '@arco-design/web-vue';
import type { BaseType } from '../../_utils/types';

export const useRowSelection = ({
  selectedKeys,
  defaultSelectedKeys,
  rowSelection,
}: {
  selectedKeys: Ref<BaseType[] | undefined>;
  defaultSelectedKeys: Ref<BaseType[] | undefined>;
  rowSelection: Ref<TableRowSelection | undefined>;
}) => {
  const isRadio = computed(() => rowSelection.value?.type === 'radio');
  const selectedRowKeys = ref(
    selectedKeys.value ??
      rowSelection.value?.selectedRowKeys ??
      defaultSelectedKeys.value ??
      rowSelection.value?.defaultSelectedRowKeys ??
      []
  );

  return {
    isRadio,
    selectedRowKeys,
  };
};
