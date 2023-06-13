import { VNodeChild } from 'vue';

/**
 * 快捷操作，用于快速的展示一个状态
 */
const Status: {
  Success: ({ text }: { text: any }) => VNodeChild;
  Error: ({ text }: { text: any }) => VNodeChild;
  Default: ({ text }: { text: any }) => VNodeChild;
  Warning: ({ text }: { text: any }) => VNodeChild;
} = {
  Success: ({ text }) => <a-badge status="success" text={text} />,
  Error: ({ text }) => <a-badge status="danger" text={text} />,
  Default: ({ text }) => <a-badge status="processing" text={text} />,
  Warning: ({ text }) => <a-badge status="warning" text={text} />,
};

export type StatusType = keyof typeof Status;

export default Status;
