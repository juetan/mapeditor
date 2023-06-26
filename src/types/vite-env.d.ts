/// <reference types="vite/client" />
import "echarts";

declare module "echarts" {
  interface OptionDataItem {
    $data: any;
  }
}
