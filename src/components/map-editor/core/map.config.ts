export const bgSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1622" height="744" viewBox="0 0 1622 744" fill="none"><rect x="0" y="0" width="0" height="0" fill="rgba(249, 249, 249, 1)" /><path id="矩形 1" fill-rule="evenodd" style="fill:#CCCCCC" transform="translate(0 0)  rotate(0 811 372)" opacity="0" d="M0,744L1622,744L1622,0L0,0L0,744Z " /></svg>`;

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
};

export const DEFAULT_OPTIONS = {
  geo: {
    map: "blank.svg",
    roam: true,
    layoutSize: "100%",
    aspectScale: 1,
    scaleLimit: {
      min: 0.5,
      max: 10,
    },
    top: 0,
    bottom: 0,
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
