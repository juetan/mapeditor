import { VNode } from "vue";
import { ILine, INode } from "../mock";

/**
 * 操作模式
 */
export enum Mode {
  /**
   * 无
   */
  NONE = "none",
  /**
   * 修改节点
   */
  MODIFY_NODE = "modify-node",
  /**
   * 修改边点
   */
  MODIFY_LINE = "modify-line",
  /**
   * 添加点
   */
  ADD_EDGE_POINT = "add-edge-point",
}

/**
 * 选中内容的类型
 */
export const enum SelectType {
  /**
   * 节点
   */
  NODE = "node",
  /**
   * 边
   */
  EDGE = "edge",
  /**
   * 配置
   */
  CONFIG = "config",
  /**
   * 线路
   */
  LINE = "line",
}

export type ContextmenuEventItem = {
  /**
   * 显示名称
   */
  name: string;
  /**
   * 提示语
   */
  tip?: string;
  /**
   * 子项
   */
  children?: any[];
  /**
   * 图标(支持JSX)
   */
  icon?: () => string | VNode;
  /**
   * 处理函数
   */
  onClick?: () => void;
};

export type ContextmenuItem = { type: "divider" } | ContextmenuEventItem;

export interface MeContext {
  mode: Mode;
  selected: any;
  selectedType?: SelectType;
  line?: ILine;
  site?: INode;
  dragger: {
    width: number;
    height: number;
    x: number;
    y: number;
    item?: INode;
    show: boolean;
  };
  contextmenu: {
    show: boolean;
    x: number;
    y: number;
    items: ContextmenuItem[];
  };
}
