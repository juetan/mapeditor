import {
  ComposeOption,
  GeoComponentOption,
  LinesSeriesOption,
  ScatterSeriesOption,
  TooltipComponentOption,
} from "echarts";

export const bgSVG = `<svg width="1660" height="849" xmlns="http://www.w3.org/2000/svg">
<!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ -->
<g>
 <title>background</title>
 <rect fill="#33cc99" id="canvas_background" height="851" width="1662" y="-1" x="-1"/>
 <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
  <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
 </g>
</g>
<g>
 <title>Layer 1</title>
</g>
</svg>`;

/**
 * 标记Echarts中series的ID
 */
export const SERIES = {
  /**
   * 边ID
   */
  EDGE_ID: "SERIES_LINES",

  /**
   * 站点ID
   */
  NODE_ID: "SERIES_SCATTER",
};

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  /**
   * 线宽
   */
  edgeWidth: 6,

  /**
   * 站点符号大小
   */
  nodeSymbolSize: 8,

  /**
   * 站点标签大小
   */
  nodeLabelSize: 8,

  /**
   * 站点图标大小
   */
  nodeIconSize: 8,

  /**
   * 初始站点图标大小
   */
  nodeIconInit: 24,

  /**
   * 站点标签距离
   */
  nodeLabelOffset: 5,

  /**
   * 站点标签显示
   */
  nodeLabelShow: true,

  /**
   * echarts的底图名称
   */
  bgName: "blank.svg",

  /**
   * echarts的底图(SVG)
   */
  bgData: bgSVG,

  /**
   * 缩放比例(0 ~ 1)
   */
  zoom: 1,
};

export type EcOptions = ComposeOption<
  ScatterSeriesOption | LinesSeriesOption | TooltipComponentOption | GeoComponentOption
>;

export const DEFAULT_OPTIONS: EcOptions = {
  geo: {
    map: "blank.svg",
    roam: true,
    layoutSize: "100%",
    aspectScale: 1,
    scaleLimit: {
      min: 0.5,
      max: 10,
    },
    left: 0,
    right: 0,
  },
  tooltip: {},
  series: [
    {
      id: SERIES.EDGE_ID,
      type: "lines",
      lineStyle: {
        width: DEFAULT_CONFIG.edgeWidth,
        join: "round",
        cap: "round",
      },
      symbol: "circle",
      selectedMode: true,
      polyline: true,
      data: [],
      animation: false,
    },
    {
      id: SERIES.NODE_ID,
      type: "scatter",
      coordinateSystem: "geo",
      geoIndex: 0,
      symbolSize: DEFAULT_CONFIG.nodeLabelSize,
      itemStyle: {
        color: "#09f",
        opacity: 1,
      },
      emphasis: {
        scale: false,
      },
      tooltip: {
        show: false,
      },
      label: {
        show: true,
        color: "#666",
        fontSize: DEFAULT_CONFIG.nodeLabelSize,
        position: "top",
        formatter: "{b}",
        rich: {
          icon: {
            backgroundColor: {
              image: "iconTransfer",
            },
            width: DEFAULT_CONFIG.nodeIconInit,
            height: DEFAULT_CONFIG.nodeIconInit,
          },
          alarm: {
            backgroundColor: {
              image: "iconAlarmNormal",
            },
            height: DEFAULT_CONFIG.nodeIconSize,
            width: DEFAULT_CONFIG.nodeIconSize,
          },
        },
      },
      animation: false,
      data: [],
    },
  ],
};

export const graphic = {
  type: "circle",
  z: 100,
  position: [0, 0],
  invisible: false,
  draggable: true,
  textContent: {
    z: 1000,
    style: {
      text: "",
      font: "",
    },
  },
  textConfig: {
    position: "inside",
    distance: 0,
    insideFill: "red",
  },
  shape: {
    r: 4.5,
  },
  style: {
    fill: "#fff",
    stroke: "red",
    lineWidth: 1,
  },
};
