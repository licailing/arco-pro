import { PropType, defineComponent, ref, computed } from 'vue';
import { omit } from '@arco-design/web-vue/es/_utils/omit';
import { formatterDecimal, toCapital } from './util';
import InputNumber from '../InputNumber';
import './index.less';

/**
 * 金额
 * 
 <InputDecimal
    placeholder="请输入申请金额"
    type="money"
    capitalUnit="万元"
  />
  <InputDecimal
    placeholder="请输入申请金额"
    type="money"
    capitalUnit="元"
  />
  百分比
  <InputDecimal
    placeholder="请输入保证金比例"
    type="percent"
  />
  可以输入小数点
  <InputDecimal
    placeholder="请输入保证金"
    type="decimal"
  />
  整数
  <InputDecimal
    placeholder="请输入文件份数"
    type="int"
    max={100}
  />
 *
 */
export type InputDecimalType =
  | 'decimal'
  | 'int'
  | 'digit'
  | 'money'
  | 'percent'
  | 'custom';
export type capitalUnitType = '元' | '万元';
const noPrecisionTypeArr = ['money', 'int'];
export default defineComponent({
  name: 'InputDecimal',
  props: {
    ...InputNumber.props,
    // 类型：decimal:带小数,int/digit:整数,money:金额, percent:%
    type: {
      type: String as PropType<InputDecimalType>,
      default: 'decimal',
    },
    intPartNumber: Number, // 整数部分位数
    capitalUnit: {
      type: String as PropType<capitalUnitType>,
      default: '元',
    },
    maxLength: Number,
  },
  setup(props, { slots, attrs }) {
    const capitalStr = ref('');
    const max = computed(() =>
      props.type === 'percent' ? 100 : props.max || undefined
    );
    const config = computed<{
      precision: number;
      intPartNumber: number;
      isCapital: boolean;
    }>(() => {
      let newPrecision;
      let newIntPartNumber;
      let isCapital = false;
      switch (props.type) {
        case 'decimal': // 带小数
          newPrecision = 2;
          newIntPartNumber = 13;
          break;
        case 'digit': // 整数
        case 'int': // 整数
          newPrecision = 0;
          newIntPartNumber = 13;
          break;
        case 'money': // 金额
          // 万元时：整数最大9位，小数最大6位
          // 元时：按999999999999999.9999; // 最大处理的数字:整数最大15位，小数最大4位、
          newPrecision = props.capitalUnit === '万元' ? 6 : 2;
          newIntPartNumber = props.capitalUnit === '万元' ? 9 : 15;
          isCapital = true;
          break;
        case 'percent': // 百分比
          newPrecision = 3;
          newIntPartNumber = 3;
          break;
        default:
          break;
      }
      // 自定义整数部分
      if (props.intPartNumber) {
        newIntPartNumber = props.intPartNumber;
      }
      // 自定义小数部分:金额和正整数不能自定义小数部分
      if (
        props.precision &&
        !isCapital &&
        !noPrecisionTypeArr.includes(props.type)
      ) {
        newPrecision = props.precision;
      }

      return {
        precision: newPrecision,
        intPartNumber: newIntPartNumber,
        isCapital,
      };
    });
    // 后缀
    const renderSuffix = () => {
      if (slots.suffix) {
        return slots.suffix;
      }
      if (config.value.isCapital) {
        return props.capitalUnit;
      }
      if (props.type === 'percent') {
        return '%';
      }
      return null;
    };
    const restProps = computed(() =>
      omit(props, ['precision', 'formatter', 'parser'])
    );
    return () => {
      return (
        <div class="input-decimal" style={{ width: '100%' }}>
          <InputNumber
            class="inputWidth"
            precision={config.value.precision}
            formatter={(value: string) => {
              const newValueObj = formatterDecimal(
                value,
                config.value.precision,
                config.value.isCapital,
                config.value.intPartNumber
              );
              if (config.value.isCapital) {
                capitalStr.value = toCapital(
                  newValueObj.value,
                  props.capitalUnit,
                  config.value.precision
                );
              }
              return newValueObj.text;
            }}
            parser={(value: any) => {
              return value.replace(/[^0-9.]/g, '');
            }}
            modelEvent="input"
            {...restProps.value}
            v-slots={{
              suffix: renderSuffix,
            }}
            min={props.min || 0}
            max={max.value}
            {...attrs}
            style={{ width: '100%' }}
          ></InputNumber>
          {config.value.isCapital && (
            <div class="capital">{capitalStr.value}</div>
          )}
        </div>
      );
    };
  },
});
