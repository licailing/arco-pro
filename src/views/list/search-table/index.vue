<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-card title="高级查询">
      <TableList
        :cache="true"
        search-type="light"
        :light-search-config="lightSearchConfig"
        :columns="columns1"
        url="/api/list/policy"
        :buttons="buttons"
        :row-selection="rowSelection"
        :pagination="pagination"
        :option-width="260"
      >
        <template #contentType="{ record }">
          <a-space>
            <a-avatar
              v-if="record.contentType === 'img'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.contentType === 'horizontalVideo'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar v-else :size="16" shape="square">
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            {{ $t(`searchTable.form.contentType.${record.contentType}`) }}
          </a-space>
        </template>
      </TableList>
    </a-card>
    <a-card class="general-card" title="普通查询">
      <TableList
        :cache="true"
        :pagination="pagination"
        :columns="columns"
        :buttons="buttons"
        :row-selection="rowSelection"
        :option-width="260"
        url="/api/list/policy"
      >
        <template #contentType="{ record }">
          <a-space>
            <a-avatar
              v-if="record.contentType === 'img'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.contentType === 'horizontalVideo'"
              :size="16"
              shape="square"
            >
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77721e365eb2ab786c889682cbc721c1.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar v-else :size="16" shape="square">
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/ea8b09190046da0ea7e070d83c5d1731.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            {{ $t(`searchTable.form.contentType.${record.contentType}`) }}
          </a-space>
        </template>
      </TableList>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import TableList, { ButtonData } from '@/components/TableList';

  const { t } = useI18n();
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      valueType: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.number'),
      dataIndex: 'number',
    },
    {
      title: t('searchTable.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('searchTable.columns.contentType'),
      dataIndex: 'contentType',
      valueEnum: {
        img: {
          text: '图文',
        },
        horizontalVideo: {
          text: '横版短视频',
        },
        verticalVideo: {
          text: '竖版小视频',
        },
      },
      hideInSearch: false,
      slotName: 'contentType',
    },
    {
      title: t('searchTable.columns.filterType'),
      valueEnum: {
        artificial: {
          text: '人工筛选',
        },
        rules: {
          text: '规则筛选',
        },
      },
      dataIndex: 'filterType',
      hideInSearch: false,
    },
    {
      title: t('searchTable.columns.count'),
      dataIndex: 'count',
      hideInSearch: true,
    },
    {
      title: t('searchTable.columns.createdTime'),
      valueType: 'dateRange',
      dataIndex: 'createdTime',
      hideInSearch: false,
    },
    {
      title: t('searchTable.columns.status'),
      dataIndex: 'status',
      hideInSearch: false,
      valueEnum: {
        1: {
          text: '已上线',
          status: 'Success',
        },
        0: {
          text: '已下线',
          status: 'Default',
        },
      },
    },
  ]);
  const pagination = {
    defaultPageSize: 5,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20, 30, 40, 50],
  };
  const lightSearchConfig = {
    search: { placeholder: '请输入集合编号、集合名称' },
  };
  const columns1 = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      valueType: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.number'),
      dataIndex: 'number',
      hideInSearch: true,
    },
    {
      title: t('searchTable.columns.name'),
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: t('searchTable.columns.contentType'),
      dataIndex: 'contentType',
      valueEnum: {
        img: {
          text: '图文',
        },
        horizontalVideo: {
          text: '横版短视频',
        },
        verticalVideo: {
          text: '竖版小视频',
        },
      },
      hideInSearch: false,
      slotName: 'contentType',
    },
    {
      title: t('searchTable.columns.filterType'),
      valueEnum: {
        artificial: {
          text: '人工筛选',
        },
        rules: {
          text: '规则筛选',
        },
      },
      dataIndex: 'filterType',
      hideInSearch: false,
    },
    {
      title: t('searchTable.columns.count'),
      dataIndex: 'count',
      hideInSearch: true,
    },
    {
      title: t('searchTable.columns.createdTime'),
      valueType: 'dateRange',
      dataIndex: 'createdTime',
      hideInSearch: false,
    },
    {
      title: t('searchTable.columns.status'),
      dataIndex: 'status',
      hideInSearch: false,
      valueEnum: {
        1: {
          text: '已上线',
          status: 'Success',
        },
        0: {
          text: '已下线',
          status: 'Default',
        },
      },
    },
  ]);
  const buttons = [
    {
      action: 1,
      alias: 'add',
      path: '/list/search-table/add',
      name: '新增',
    },
    {
      action: 2,
      alias: 'edit',
      path: '/list/search-table/update',
      name: '编辑',
    },
    {
      action: 3,
      alias: 'delete',
      path: '/api/policy/delete',
      name: ({ type }: ButtonData) => {
        return type === 'column' ? '删除' : '批量删除';
      },
      show: ({ type, record }: ButtonData) => {
        if (type === 'column') {
          // 已下线
          return record.status === 0;
        }
        return true;
      },
    },
    {
      action: 2,
      name: '处理',
      handleClick: () => {},
    },
  ];
  const rowSelection = { type: 'checkbox', showCheckedAll: true };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
