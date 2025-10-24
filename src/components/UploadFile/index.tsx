import { FileItem, Upload } from '@arco-design/web-vue';
import { omit } from 'lodash';
import { computed, defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'UploadFile',
  inheritAttrs: false,
  props: {
    ...Upload.props,
    action: {
      type: String,
      default: '/api/file/uploadImg',
    },
    modelValue: {
      type: [String, Array] as PropType<string | (string | FileItem)[]>,
    },
  },
  emits: {
    'update:modelValue': (value: any) => true,
    'change': (value: any) => true,
  },
  setup(props, { slots, emit }) {
    const restProps = computed(() =>
      omit(props, ['fileList', 'defaultFileList'])
    );
    const fileList = computed<FileItem[]>(() => {
      const data = props.modelValue;
      // 单个链接字符串
      if (data && typeof data === 'string') {
        return [
          {
            uid: `${new Date().getTime()}`,
            url: data,
          },
        ];
      }
      return data || [];
    });
    const handleChange = (fileList, fileItem) => {
      if (fileItem.status === 'done') {
        for (const item of fileList) {
          if (item.response && item.response.success) {
            const { url } = item.response.data;
            item.url = url;
          }
        }
      }
      if (!props.multiple) {
        const url = fileList.length ? fileItem.url : '';
        // 删除
        emit('update:modelValue', url);
        emit('change', url);
      } else {
        emit('update:modelValue', fileList);
        emit('change', fileList);
      }
    };

    return () => {
      return (
        <Upload
          {...restProps.value}
          v-slots={slots}
          onChange={handleChange}
          fileList={fileList.value}
        />
      );
    };
  },
});
