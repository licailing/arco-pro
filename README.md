# 基于arco-design组件库vue3 ProTable、TableList组件
## 组件都是用 TypeScript 编写的、通过eslint、mock数据模拟真实操作
git链接: [https://github.com/licailing/arco-pro](https://github.com/licailing/arco-pro)
# 运行

```bash
npm install
npm run dev
```
### TableList是基于ProTable高度封装的组件
#### 高级筛选-收起
![高级筛选-收起](https://img-blog.csdnimg.cn/3b4693410ca94ebc841b80da9326a962.png#pic_center)
#### 高级筛选-展开
![高级筛选-展开](https://img-blog.csdnimg.cn/93d384fdc3604eaa89850978bb56bc46.png#pic_center)
#### 普通筛选-展开
![普通筛选-展开](https://img-blog.csdnimg.cn/6a089489b4f64ba696ce91d0da49e87c.png#pic_center)
#### 普通筛选-收起
![普通筛选-收起](https://img-blog.csdnimg.cn/9cbf81d601ec434da40faad4a829b0c6.png#pic_center)
#### 自定义表单部分
![自定义表单](https://img-blog.csdnimg.cn/b9dd0724faa14eb2adbf5e93fdc0e58a.png#pic_center)
#### 搜素表单-表格-编辑弹框全部自定义
![搜素表单-表格-编辑弹框全部自定义](https://img-blog.csdnimg.cn/7825ae5f1c0e4ed99bb84712e04676d5.png#pic_center)
#### 搜素表单-表格-编辑弹框全部自定义
![搜素表单-表格-编辑弹框全部自定义](https://img-blog.csdnimg.cn/6f83e57865954ed08378badbca5d2a20.png#pic_center)
#### ProTable默认表单
![ProTable默认表单](https://img-blog.csdnimg.cn/36977cc017fa45dc92a1be04f29fdbb4.png#pic_center)
#### 高级筛选及普通筛选代码实现
```vue
<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-card title="高级查询">
      <TableList
        :cache="true"
        search-type="light"
        :light-search-config="lightSearchConfig"
        :columns="columns"
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
  // 操作按钮配置
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

```
#### 自定义搜索表单、列表、编辑表单代码实现
```vue
<template>
  <div>
    <Breadcrumb :items="['menu.platform', 'menu.platform.premit']" />
    <TableList
      ref="tableRef"
      row-key="premitId"
      url="/api/premit/list"
      modal
      :buttons="buttons"
    >
      <!-- 自定义搜索 -->
      <template #form-search="formData">
        <a-form
          ref="formSearchRef"
          layout="horizontal"
          :model="formSearch"
          @submit="
            ({ values, errors }) => {
              if (!errors) {
                formData.onSubmit(values);
              }
            }
          "
        >
          <a-grid
            :cols="{ xs: 1, sm: 2, md: 3 }"
            :collapsed="collapsed"
            :collapsed-rows="1"
          >
            <a-grid-item>
              <a-form-item label=" 模块" field="premitModule">
                <a-input
                  v-model="formSearch.premitModule"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="模块描述" field="premitModuleDesc">
                <a-input
                  v-model="formSearch.premitModuleDesc"
                  placeholder="请填写模块描述"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="方法" field="premitAction">
                <a-input
                  v-model="formSearch.premitAction"
                  placeholder="请填写方法"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item>
              <a-form-item label="方法描述" field="premitActionDesc">
                <a-input
                  v-model="formSearch.premitActionDesc"
                  placeholder="请填写方法描述"
                />
              </a-form-item>
            </a-grid-item>
            <a-grid-item
              :style="[{ 'text-align': 'right' }]"
              :span="1"
              :suffix="true"
            >
              <a-form-item>
                <a-space
                  align="end"
                  :style="{ 'justify-content': 'flex-end', 'flex': 1 }"
                >
                  <a-button
                    type="outline"
                    @click="
                      () => {
                        formSearchRef.resetFields();
                        formData.onReset();
                      }
                    "
                  >
                    重置
                  </a-button>
                  <a-button type="primary" html-type="submit"> 提交 </a-button>
                  <a-button type="text" @click="collapsed = !collapsed">
                    收起
                    <icon-down
                      :style="{
                        verticalAlign: 'middle',
                        fontSize: '16px',
                        marginRight: '8px',
                        transition: '0.3s all',
                        transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
                      }"
                    />
                  </a-button>
                </a-space>
              </a-form-item>
            </a-grid-item>
          </a-grid>
        </a-form>
      </template>
      <!-- 自定义table -->
      <template #columns>
        <a-table-column title=" ID" data-index="premitId"></a-table-column>
        <a-table-column title="模块" data-index="premitModule"></a-table-column>
        <a-table-column
          title="模块描述"
          data-index="premitModuleDesc"
        ></a-table-column>
        <a-table-column title="方法" data-index="premitAction">
        </a-table-column>
        <a-table-column title="方法描述">
          <template #cell="{ record }">
            {{ record.premitActionDesc }}
          </template>
        </a-table-column>
      </template>
      <!-- 自定义新增/编辑  -->
      <template #modal-form="{ formRef, isAdd, visible, onCancel, onSubmit }">
        <a-modal
          v-model:visible="visible.value"
          title-align="start"
          :title="isAdd ? '新增' : '编辑'"
          draggable
          :mask-closable="false"
          :footer="false"
        >
          <a-form
            :ref="formRef"
            :model="formModel"
            @submit="
              ({ values, errors }) => {
                if (!errors) {
                  onSubmit(values);
                }
              }
            "
          >
            <a-form-item
              label="模块"
              field="premitModule"
              :rules="[
                {
                  required: true,
                  message: '模块不能为空',
                },
              ]"
            >
              <a-input v-model="formModel.premitModule" placeholder="请输入" />
            </a-form-item>
            <a-form-item
              label="模块描述"
              field="premitModuleDesc"
              :rules="[
                {
                  required: true,
                  message: '模块描述不能为空',
                },
              ]"
            >
              <a-input
                v-model="formModel.premitModuleDesc"
                placeholder="请填写模块描述"
              />
            </a-form-item>
            <a-form-item
              label="方法"
              field="premitAction"
              :rules="[
                {
                  required: true,
                  message: '方法不能为空',
                },
              ]"
            >
              <a-input
                v-model="formModel.premitAction"
                placeholder="请填写方法"
              />
            </a-form-item>
            <a-form-item
              label="方法描述"
              field="premitActionDesc"
              :rules="[
                {
                  required: true,
                  message: '方法描述不能为空',
                },
              ]"
            >
              <a-input
                v-model="formModel.premitActionDesc"
                placeholder="请填写方法描述"
              />
            </a-form-item>
            <a-form-item>
              <a-space
                align="end"
                :style="{ 'justify-content': 'flex-end', 'flex': 1 }"
              >
                <a-button type="outline" @click="onCancel"> 取消 </a-button>
                <a-button type="primary" html-type="submit"> 提交 </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-modal>
      </template>
    </TableList>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import TableList from '@/components/TableList';
  
  // 操作按钮配置
  const buttons = [
    {
      action: 2,
      alias: 'edit',
      path: '/api/premit/update',
      name: '编辑',
    },
    {
      action: 2,
      alias: 'delete',
      path: '/api/premit/delete',
      name: '删除',
    },
  ];
  const formSearchRef = ref();
  const formSearch = ref({});
  const formModel = ref({});
  const collapsed = ref(true);
  const tableRef = ref();
</script>

```
# 相关链接

* [arco-design](https://arco.design/)
* [Arco Pro](https://arco.design/pro/)
