<template>
  <div class="container">
    <Breadcrumb :items="['menu.form', 'menu.form.group']" />
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-space direction="vertical" :size="16">
        <a-card class="general-card">
          <template #title>
            {{ $t('groupForm.title.video') }}
          </template>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                :label="
                  formData.unit === 'money' ? '申请金额(万元)' : '申请金额比例'
                "
                :rules="[{ required: true, message: '请输入申请金额' }]"
                field="money"
              >
                <InputDecimal
                  v-model="formData.money"
                  :type="formData.unit"
                  capital-unit="万元"
                  style="width: 70%"
                  placeholder="请输入"
                />
                <a-select v-model="formData.unit" style="width: 30%">
                  <a-option value="percent">百分比</a-option>
                  <a-option value="money">金额</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="申请金额(元)"
                field="money1"
                :rules="[{ required: true, message: '请输入申请金额' }]"
              >
                <InputDecimal
                  v-model="formData.money1"
                  placeholder="请输入申请金额"
                  type="money"
                  capital-unit="元"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="保证金比例"
                field="rate"
                :rules="[{ required: true, message: '请输入保证金比例' }]"
              >
                <InputDecimal
                  v-model="formData.rate"
                  placeholder="请输入保证金比例"
                  type="percent"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="保证金比例"
                field="rate1"
                :rules="[{ required: true, message: '请输入保证金比例' }]"
              >
                <InputDecimal
                  v-model="formData.rate1"
                  placeholder="请输入保证金"
                  type="decimal"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                label="文件份数"
                field="fileNumber"
                :rules="[{ required: true, message: '请输入文件份数' }]"
              >
                <InputDecimal
                  v-model="formData.fileNumber"
                  placeholder="请输入文件份数"
                  type="int"
                  :max="100"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.acquisition.resolution')"
                field="video.acquisition.resolution"
              >
                <a-select
                  :placeholder="
                    $t('groupForm.placeholder.video.acquisition.resolution')
                  "
                >
                  <a-option value="resolution1">分辨率1</a-option>
                  <a-option value="resolution2">分辨率2</a-option>
                  <a-option value="resolution3">分辨率3</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.acquisition.frameRate')"
                field="video.acquisition.frameRate"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.video.acquisition.frameRate')
                  "
                >
                  <template #append> fps </template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.encoding.resolution')"
                field="video.encoding.resolution"
              >
                <a-select
                  :placeholder="
                    $t('groupForm.placeholder.video.encoding.resolution')
                  "
                >
                  <a-option value="resolution1">分辨率1</a-option>
                  <a-option value="resolution2">分辨率2</a-option>
                  <a-option value="resolution3">分辨率3</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.encoding.rate.min')"
                field="video.encoding.rate.min"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.video.encoding.rate.min')
                  "
                  add-after="bps"
                >
                  <template #append> bps </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.encoding.rate.max')"
                field="video.encoding.rate.max"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.video.encoding.rate.max')
                  "
                >
                  <template #append> bps </template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.encoding.rate.default')"
                field="video.encoding.rate.default"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.video.encoding.rate.default')
                  "
                >
                  <template #append> bps </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.encoding.frameRate')"
                field="video.encoding.frameRate"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.video.encoding.frameRate')
                  "
                >
                  <template #append> fps </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.video.encoding.profile')"
                field="video.encoding.profile"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.video.encoding.profile')
                  "
                >
                  <template #append> bps </template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card">
          <template #title>
            {{ $t('groupForm.title.audio') }}
          </template>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.audio.mode')"
                field="audio.mode"
              >
                <a-select :placeholder="$t('groupForm.placeholder.audio.mode')">
                  <a-option value="custom">自定义</a-option>
                  <a-option value="mode1">模式1</a-option>
                  <a-option value="mode2">模式2</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.audio.acquisition.channels')"
                field="audio.acquisition.channels"
              >
                <a-select
                  :placeholder="
                    $t('groupForm.placeholder.audio.acquisition.channels')
                  "
                >
                  <a-option value="1">1</a-option>
                  <a-option value="2">2</a-option>
                  <a-option value="3">3</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.audio.encoding.channels')"
                field="audio.encoding.channels"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.audio.encoding.channels')
                  "
                >
                  <template #append> bps </template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="80">
            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.audio.encoding.rate')"
                field="audio.encoding.rate"
              >
                <a-input
                  :placeholder="$t('groupForm.placeholder.audio.encoding.rate')"
                >
                  <template #append> bps </template>
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-form-item
                :label="$t('groupForm.form.label.audio.encoding.profile')"
                field="audio.encoding.profile"
              >
                <a-input
                  :placeholder="
                    $t('groupForm.placeholder.audio.encoding.profile')
                  "
                >
                  <template #append> fps </template>
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card class="general-card" :bordered="false">
          <template #title>
            {{ $t('groupForm.title.description') }}
          </template>
          <a-form-item
            :label="$t('groupForm.form.label.parameterDescription')"
            field="audio.approvers"
          >
            <a-textarea
              :placeholder="$t('groupForm.placeholder.description')"
            />
          </a-form-item>
        </a-card>
      </a-space>
      <div class="actions">
        <a-space>
          <a-button>
            {{ $t('groupForm.reset') }}
          </a-button>
          <a-button type="primary" :loading="loading" @click="onSubmitClick">
            {{ $t('groupForm.submit') }}
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import InputDecimal from '@/components/InputDecimal';

  const formData = ref({
    money: undefined,
    money1: undefined,
    rate: undefined,
    rate1: undefined,
    unit: 'money',
    fileNumber: undefined,
  });
  const formRef = ref<FormInstance>();
  const { loading, setLoading } = useLoading();
  const onSubmitClick = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
    }
    console.log('formData', formData.value);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
</script>

<script lang="ts">
  export default {
    name: 'Group',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 40px 20px;
    overflow: hidden;
  }

  .actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    padding: 14px 20px 14px 0;
    background: var(--color-bg-2);
    text-align: right;
  }
</style>
