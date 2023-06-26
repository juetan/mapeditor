import * as echarts from "echarts";
import { Mode } from "../main/interface";
import { ChartEdge, ChartNode } from "../mock";
import { DEFAULT_CONFIG, DEFAULT_OPTIONS, SERIES } from "./map.config";

export class MapChart {
  /**
   * ECharts实例
   */
  public instance!: echarts.ECharts;

  /**
   * 运行时数据
   */
  current: {
    mode: Mode;
  } = {
    mode: Mode.NONE,
  };

  /**
   * 配置
   */
  public config: {
    /**
     * 底图svg
     */
    bgData: string;
    /**
     * 底图名称
     */
    bgName: string;
    /**
     * 线宽
     */
    edgeWidth: number;
    /**
     * 站点符号大小
     */
    nodeSymbolSize: number;
    /**
     * 站点标签大小
     */
    nodeLabelSize: number;
    /**
     * 站点图标大小
     */
    nodeIconSize: number;
    /**
     * 初始站点图标大小
     */
    nodeIconInit: number;
  } = DEFAULT_CONFIG;

  /**
   * 节点坐标映射
   */
  nodePointMap: Record<string, any> = {};

  /**
   * 节点坐标变化回调
   */
  onNodePointChange?: (data: { x: number; y: number }) => void;

  /**
   * 边点坐标映射
   */
  edgePointMap: Record<string, any> = {};

  /**
   * 边点坐标变化回调
   */
  onEdgePointChange?: (data: { x: number; y: number }) => void;

  /**
   * 初始化
   */
  init(el: HTMLElement, mode = "light", opts: any = { renderer: "svg" }) {
    if (this.instance) {
      this.dispose();
    }
    echarts.registerMap(this.config.bgName, { svg: this.config.bgData });
    this.instance = echarts.init(el, mode, opts) as any;
    this.instance.setOption(DEFAULT_OPTIONS);
    this.instance.on("georoam", this.resize.bind(this));
  }

  /**
   * 设置节点拖拽点
   */
  setNodePoints(points?: any[]) {
    if (this.current.mode !== Mode.MODIFY_NODE) {
      return;
    }
    if (points) {
      const options = { graphic: { elements: points } };
      this.instance.setOption(options, { replaceMerge: "graphic" });
      console.log(this.instance.getOption());
      return;
    }
    const opt = this.instance.getOption() as any;
    const zoom = opt.geo[0].zoom;
    const map = this;
    const nodes = this.getNodes();
    const elements = nodes.map((item, i) => {
      const [x, y] = item.value;
      const { color = "red" } = (item.$data as any) || {};
      const coord = this.nodePointMap[i] || [Number(x), Number(y)];
      const position = this.instance.convertToPixel("geo", coord);
      return {
        type: "circle",
        textContent: {
          z: 1000,
          style: {
            text: `${i + 1}`,
            font: `${6 * zoom}px bold Microsoft YaHei`,
          },
        },
        textConfig: {
          position: "inside",
          distance: 0,
          insideFill: color,
        },
        shape: {
          r: 4.5 * zoom,
        },
        style: {
          fill: "#fff",
          stroke: color,
          lineWidth: 1 * zoom,
        },
        position,
        invisible: false,
        draggable: true,
        z: 100,
        ondrag(this: { x: number; y: number }) {
          const position = map.instance.convertFromPixel("geo", [this.x, this.y]) as [number, number];
          map.nodePointMap[i] = position;
          const data = map.getNodes();
          data[i].value = position;
          map.setNodes(data);
          map.onNodePointChange?.({ x: position[0], y: position[1] });
        },
      };
    });
    const option = { graphic: { elements } };
    this.instance.setOption(option);
  }

  /**
   * 设置边拖拽点
   */
  setEdgePoints(points?: any[]) {
    if (this.current.mode !== Mode.MODIFY_LINE) {
      return;
    }
    if (points) {
      const option = { graphic: { elements: points } };
      this.instance.setOption(option, { replaceMerge: "graphic" });
      return;
    }
    const opt = this.instance.getOption() as any;
    const zoom = opt.geo[0].zoom;
    const map = this;
    const edges = this.getEdges();
    const elements = edges.reduce((acc, item) => {
      const items = item.coords.map((coord, index) => {
        const [x, y] = coord;
        const coords = this.edgePointMap[`${item.id}.${index}`] || [x, y];
        const position = this.instance.convertToPixel("geo", coords);
        const ondrag = function (this: { x: number; y: number }) {
          const data = map.getEdges();
          const currentItem = data.find((i) => i.id === item.id);
          if (!currentItem) {
            return;
          }
          const position = map.instance.convertFromPixel("geo", [this.x, this.y]) as [number, number];
          map.edgePointMap[`${item.id}.${index}`] = position;
          currentItem.coords[index] = position;
          // map?.onLinePointChange?.({ index, parentIndex, x: position[0], y: position[1] });
          map.setEdges(data);
        };
        const graphic = {
          type: "circle",
          textContent: {
            z: 1000,
            style: {
              text: `${index + 1}`,
              font: `${6 * zoom}px bold Microsoft YaHei`,
            },
          },
          textConfig: {
            position: "inside",
            distance: 0,
            insideFill: item.$data?.color ?? "red",
          },
          info: {
            index,
            parentId: item.id,
          },
          shape: {
            r: 5 * zoom,
          },
          style: {
            fill: "#fff",
            stroke: item.$data?.color ?? "red",
            lineWidth: 1.5 * zoom,
          },
          position,
          invisible: false,
          draggable: true,
          z: 100,
          ondrag,
        };
        return graphic;
      });
      return [...acc, ...items];
    }, [] as any[]);
    const option = { graphic: { elements } };
    this.instance.setOption(option);
  }

  /**
   * 重新设置大小
   */
  resize() {
    this.resizeNodesAndEdges();
    this.setNodePoints();
    this.setEdgePoints();
  }

  /**
   * 重置节点和边的大小
   */
  resizeNodesAndEdges() {
    const opts = this.instance.getOption() as any;
    const zoom = opts.geo[0].zoom;
    const nodes = this.getNodes();
    for (const node of nodes) {
      const x = node.$data.labelX * zoom;
      const y = node.$data.labelY * zoom;
      node.label.offset = [x, y];
    }
    const { edgeWidth, nodeSymbolSize, nodeLabelSize, nodeIconSize } = this.config;
    const options = {
      series: [
        {
          id: SERIES.EDGE_ID,
          lineStyle: {
            width: edgeWidth * zoom,
          },
        },
        {
          id: SERIES.NODE_ID,
          symbolSize: nodeSymbolSize * zoom,
          label: {
            fontSize: nodeLabelSize * zoom,
            rich: {
              icon: {
                height: nodeIconSize * zoom,
                width: nodeIconSize * zoom,
              },
              alarm: {
                height: nodeIconSize * zoom,
                width: nodeIconSize * zoom,
              },
            },
          },
          data: nodes,
        },
      ],
    };
    this.instance.setOption(options);
  }

  /**
   * 获取边的数据
   */
  getEdges(): ChartEdge[] {
    const opts = this.instance.getOption() as any;
    const edge = opts.series.find((i: any) => i.id === SERIES.EDGE_ID);
    return edge?.data ?? [];
  }

  /**
   * 设置边的数据
   */
  setEdges(data: ChartEdge[]) {
    this.instance.setOption({ series: [{ id: SERIES.EDGE_ID, data }] });
  }

  /**
   * 获取节点数据
   */
  getNodes(): ChartNode[] {
    const opts = this.instance.getOption() as any;
    const node = opts.series.find((i: any) => i.id === SERIES.NODE_ID);
    return node?.data ?? [];
  }

  /**
   * 设置节点数据
   */
  setNodes(data: any[]) {
    this.instance.setOption({ series: [{ id: SERIES.NODE_ID, data }] });
  }

  /**
   * 销毁
   */
  dispose() {
    if (this.instance) {
      this.instance.dispose();
    }
    this.nodePointMap = {};
    this.edgePointMap = {};
    this.onNodePointChange = undefined;
    this.onEdgePointChange = undefined;
    this.config = { ...DEFAULT_CONFIG };
  }
}
