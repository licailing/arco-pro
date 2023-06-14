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
  import { HttpResponse } from '@/api/interceptor';

  const handleGenerate = async () => {
    const hide = Message.loading('正在生成平台权限');
    try {
      const { success }: HttpResponse = await axios.get('/api/premit/generate');
      hide.close();
      if (!success) {
        return false;
      }
      Message.success('生成成功，即将刷新');
      return true;
    } catch (error) {
      hide.close();
      Message.error('生成失败，请重试');
      return false;
    }
  };
  const buttons = [
    {
      action: 1,
      name: '生成平台权限',
      handleClick: async ({ action }: any) => {
        const ok = await handleGenerate();
        if (ok) {
          action.reload();
        }
      },
    },
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
  const formSearch = ref<any>({});
  const formModel = ref<any>({});
  const collapsed = ref(true);
  const tableRef = ref();
</script>

<script lang="ts">
  export default {
    name: 'CustomPremit',
  };
</script>

<style lang="scss" scoped></style>
