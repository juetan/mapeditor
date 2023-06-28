/// <reference types="vite/client" />
import "echarts";

declare module "echarts" {
  interface OptionDataItem {
    mid: string;
    mdata: any;
  }
}
