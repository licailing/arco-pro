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
          :layout="formSetting.layout"
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
            <a-form
              v-if="currentField"
              ref="fieldFormRef"
              :model="currentField"
              class="mainForm"
            >
              <Field
                :key="currentField.key"
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
              <a-form-item field="layout" label="标签对齐">
                <a-radio-group v-model="formSetting.layout" type="button">
                  <a-radio value="horizontal">水平排列</a-radio>
                  <a-radio value="vertical">垂直排列</a-radio>
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
    <a-modal
      :visible="preview"
      title="预览"
      fullscreen
      :unmount-on-close="true"
      ok-text="保存"
      @ok="handlePreviewSave"
      @cancel="preview = false"
    >
      <DesignerForm
        ref="previewFormRef"
        :list="list"
        :default-value="previewFormModel"
        :form-setting="formSetting"
      />
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
  import { ref, reactive, provide, onMounted, Ref, toRaw } from 'vue';
  import { VueDraggableNext } from 'vue-draggable-next';
  import axios from 'axios';
  import { Message } from '@arco-design/web-vue';
  import { getObject, setObject } from '@/utils/storage';
  import { HttpResponse } from '@/api/interceptor';
  import DesignerForm from '@/components/DesignerForm';
  import Shape from '../components/shapes/shape.vue';
  import Field from '../components/fields/field.vue';
  import { settings } from './designerSettings';
  import { FormSetting, designInjectionKey } from './context';

  const preview = ref(false);
  const fieldFormRef = ref();
  const shapeFormModel = ref({});
  const shapeFormRef = ref();
  const previewFormRef = ref();
  const previewFormModel = ref(getObject('preview-form-data'));
  const list = ref<any[]>([]);
  const fieldSettingCurrent = ref('field');
  const currentField = ref<any>(undefined);
  const formSetting = ref<FormSetting>({
    layout: 'vertical',
    rowCol: 3,
  }) as Ref;
  const initData = async () => {
    const designerData = getObject('designer-data');
    let data = [];
    if (designerData) {
      data = designerData.list || [];
      // 设置初始选中
      if (data.length) {
        setCurrentField(data[0], false);
      }
      formSetting.value = designerData.formSetting;
      list.value = data;
      return;
    }
    try {
      const res: HttpResponse<any> = await axios.get('/api/designer/detail');
      if (res.success) {
        data = res.data.list || [];
        // 设置初始选中
        if (data.length) {
          setCurrentField(data[0], false);
        }
        formSetting.value = res.data.formSetting;
      }
      list.value = data;
    } catch (error) {}
  };
  onMounted(() => {
    initData();
  });
  const handleSave = () => {
    // 保存需要校验必填
    fieldFormRef.value.validate((errors: any) => {
      if (!errors) {
        setObject('designer-data', {
          list: list.value,
          formSetting: toRaw(formSetting.value),
        });
        Message.success('保存成功');
      } else {
        Message.error('请填写必填项');
      }
    });
  };
  const handleReview = () => {
    preview.value = true;
  };
  const setCurrentField = (field: any, validate = true) => {
    if (!validate) {
      currentField.value = field;
      return;
    }
    // 切换的需要校验必填
    fieldFormRef.value.validate((errors: any) => {
      if (!errors) {
        currentField.value = field;
      } else {
        Message.error('请填写必填项');
      }
    });
  };

  const handlePreviewSave = () => {
    previewFormRef.value.validate((errors: any) => {
      if (!errors) {
        setObject('preview-form-data', previewFormRef.value.formModel);
        preview.value = false;
        Message.success('保存成功');
      }
    });
  };
  provide(
    designInjectionKey,
    reactive({
      currentField,
      setCurrentField,
      formSetting,
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
