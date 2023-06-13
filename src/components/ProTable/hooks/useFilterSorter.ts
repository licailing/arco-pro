import { Ref, ref, watch } from 'vue';

import type {
  Sorter,
  Filters,
  TableColumnData,
} from '@arco-design/web-vue/es/table/interface';
import { isEqual } from '@arco-design/web-vue/es/_utils/is-equal';

export const useFilterSorter = ({
  columns,
}: {
  columns: Ref<TableColumnData[]>;
}) => {
  const _filters = ref<Filters | undefined>(getDefaultFilters(columns.value));
  const _sorter = ref<Sorter | undefined>(getDefaultSorter(columns.value));

  watch(columns, (columns) => {
    const newFilters = getDefaultFilters(columns);
    if (!isEqual(newFilters, _filters.value)) {
      _filters.value = newFilters;
    }
    const newSorter = getDefaultSorter(columns);
    if (!isEqual(newSorter, _sorter.value)) {
      _sorter.value = newSorter;
    }
  });
  return {
    _filters,
    _sorter,
  };
};

export const getDefaultFilters = (columns: TableColumnData[]) => {
  const filters: Filters = {};
  for (const item of columns) {
    if (item.dataIndex && item.filterable?.defaultFilteredValue) {
      filters[item.dataIndex] = item.filterable.defaultFilteredValue;
    }
  }
  return filters;
};
export const getDefaultSorter = (
  columns: TableColumnData[]
): Sorter | undefined => {
  for (const item of columns) {
    // get first enabled sorter
    if (item.dataIndex && item.sortable?.defaultSortOrder) {
      return {
        field: item.dataIndex,
        direction: item.sortable.defaultSortOrder,
      };
    }
  }
  return undefined;
};
