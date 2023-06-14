import type { InjectionKey, Ref, Slots } from 'vue';

export interface DesignContext {
  currentField: any;
  setCurrentField: (field: any) => void;
  formSetting: Ref<FormSetting>;
  fieldFormModel: any;
}
export interface FormSetting {
  labelPosition: string;
  rowCol: number;
}
export const designInjectionKey: InjectionKey<DesignContext> = Symbol('Design');
