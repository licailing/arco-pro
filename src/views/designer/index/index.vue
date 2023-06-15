<template>
  <a-card :bordered="false">
    <a-space>
      <a-button type="primary" @click="handleSave">保存</a-button>
      <a-button type="primary" @click="handleReview">预览</a-button>
    </a-space>
    <a-layout class="container" style="height: 680px">
      <a-layout-sider class="aside" :width="300">
        <div v-for="settingItem in settings" :key="settingItem.name">
          <div class="settingTitle">{{ settingItem.name }}</div>
          <VueDraggableNext
            tag="div"
            class="asideListItem"
            :list="settingItem.list"
            :group="{ name: 'widget', put: false, pull: 'clone' }"
            :sort="false"
            ghost-class="ghost"
          >
            <div
              v-for="item in settingItem.list"
              :key="item.type"
              class="designItemWrap"
            >
              <div class="designItem">{{ item.name }}</div>
            </div>
          </VueDraggableNext>
        </div>
      </a-layout-sider>
      <a-layout-content class="main">
        <a-form
          ref="shapeFormRef"
          layout="vertical"
          :model="shapeFormModel"
          class="mainForm"
        >
          <!-- 外形显示 -->
          <Shape v-model:list="list" type="base"></Shape>
        </a-form>
      </a-layout-content>
      <a-layout-sider class="right-aside" :width="400">
        <a-tabs v-model="fieldSettingCurrent">
          <a-tab-pane key="field" title="字段属性">
            <!-- 属性设置 -->
            <a-form ref="fieldFormRef" :model="fieldFormModel" class="mainForm">
              <Field
                v-if="currentField"
                v-model:field="currentField"
                :list="list"
              ></Field>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="form" title="表单属性">
            <a-form
              label-position="left"
              :model="formSetting"
              label-width="80px"
            >
              <a-form-item field="labelPosition" label="标签对齐">
                <a-radio-group
                  v-model="formSetting.labelPosition"
                  type="button"
                >
                  <a-radio value="left">左</a-radio>
                  <a-radio value="right">右</a-radio>
                  <a-radio value="top">顶部</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item field="rowCol" label="布局">
                <a-radio-group v-model="formSetting.rowCol" type="button">
                  <a-radio :value="1">单列</a-radio>
                  <a-radio :value="2">两列</a-radio>
                  <a-radio :value="3">三列</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </a-card>
</template>

<script setup lang="ts">
  import { ref, reactive, provide, onMounted, Ref } from 'vue';
  import { VueDraggableNext } from 'vue-draggable-next';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import { setObject } from '@/utils/storage';
  import { HttpResponse } from '@/api/interceptor';
  import Shape from '../components/shapes/shape.vue';
  import Field from '../components/fields/field.vue';
  import { settings } from './designerSettings';
  import { FormSetting, designInjectionKey } from './context';

  const review = ref(false);
  const fieldFormModel = ref({});
  const fieldFormRef = ref();
  const shapeFormModel = ref({});
  const shapeFormRef = ref();
  const list = ref<any[]>([]);
  const fieldSettingCurrent = ref('field');
  const currentField = ref<any>(undefined);
  const formSetting = ref<FormSetting>({
    labelPosition: 'top',
    rowCol: 3,
  }) as Ref;
  const initData = async () => {
    try {
      const res: HttpResponse<any[]> = await axios.get('/api/designer/detail');
      let data = [];
      if (res.success) {
        data = res.data || [];
        // 设置初始选中
        if (data.length) {
          setCurrentField(data[0]);
        }
      }
      list.value = data;
    } catch (error) {}
  };
  onMounted(() => {
    initData();
  });
  const handleSave = () => {
    setObject('designer-data', list.value);
    Message.success('保存成功');
  };
  const handleReview = () => {
    review.value = true;
  };
  const setCurrentField = (field: any) => {
    currentField.value = field;
  };
  provide(
    designInjectionKey,
    reactive({
      currentField,
      setCurrentField,
      formSetting,
      fieldFormModel,
    })
  );
</script>

<script lang="ts">
  export default {
    name: 'Design',
  };
</script>

<style lang="less" scoped>
  .container {
    border: 1px solid #bababa;
    font-size: 22px;
    min-height: 600px;
  }

  .settingTitle {
    font-size: 18px;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .aside {
    border-right: 1px solid #bababa;
    background: #fff;
    padding: 12px;
  }

  .asideListItem {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -8px;
  }

  .designItemWrap {
    padding: 4px 8px;
    flex: 0 0 50%;
    cursor: pointer;

    :hover {
      border: 1px dashed rgb(var(--primary-6));
      color: rgb(var(--primary-6));
    }
  }

  .designItem {
    font-size: 14px;
    padding: 4px 8px;
    border: 1px solid #bababa;
  }

  .main {
    background: #fff;
  }

  .mainForm {
    width: 100%;
    height: 100%;
  }

  .dist {
    border: 1px solid #bababa;
    width: 500px;
    height: 600px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .right-aside {
    border-left: 1px solid #bababa;
    padding: 12px;
    background: #ffffff;
  }

  .ghost {
    opacity: 0;
  }
</style>
