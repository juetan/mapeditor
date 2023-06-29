import { uniqueId } from "lodash-es";

/**
 * Node(Internal)
 */
export interface INode {
  id: string;
  mid: string;
  name: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  labelRotate: number;
  inited: boolean;
  color: string;
}

/**
 * Edge(Internal)
 */
export interface IEdge {
  mid: string;
  x: number;
  y: number;
}

/**
 * Line(Internal)
 */
export interface ILine {
  id: string;
  mid: string;
  name: string;
  color: string;
  edges: IEdge[];
  nodes: INode[];
}

/**
 * Config(Internal)
 */
export interface IConfig {}

/**
 * Data(Internal)
 */
export interface IData {
  config: IConfig;
  data: ILine[];
}

/**
 * generate random rgb color
 */
export const randomColor = (): string => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
};

const mockData = () => {
  const items = Array(12).fill(0);
  const data: ILine[] = items.map((_, index) => {
    const color = randomColor();
    const _children = Array(10).fill(0);
    const nodes: INode[] = _children.map((_, _index) => {
      return {
        id: `${index}-${_index}`,
        mid: uniqueId(),
        name: `子节点${index + 1}.${_index + 1}`,
        x: 200 + 50 * (_index + 1),
        y: 100 + 50 * (index + 1),
        labelX: 0,
        labelY: 0,
        labelRotate: 0,
        inited: false,
        color,
      };
    });
    const edges: IEdge[] = _children.map((_, _index) => {
      return {
        mid: uniqueId(),
        name: "ss",
        x: 200 + 50 * (_index + 1),
        y: 100 + 50 * (index + 1),
      };
    });
    return {
      id: `${index}`,
      mid: uniqueId(),
      name: `节点${index + 1}`,
      color,
      edges,
      nodes,
    };
  });
  const config = {};
  return { config, data };
};

/**
 * mock data
 */
export const loadData = async (): Promise<IData> => {
  const local = localStorage.getItem("__MAP_EDITOR_DATA__");
  if (local) {
    return JSON.parse(local);
  }
  return mockData();
};

export const saveData = async (data: IData) => {
  localStorage.setItem("__MAP_EDITOR_DATA__", JSON.stringify(data));
};

/**
 * Echarts Scatter Series Item
 */
export interface EcScatterItem {
  id: string;
  name: string;
  value: [number, number];
  label: {
    offset: [number, number];
  };
  itemStyle: {
    color: string;
  };
  mid: string;
  mdata: INode;
}

/**
 * Echarts Lines Series Item
 */
export interface EcLinesItem {
  id: string;
  mid: string;
  mdata: ILine;
  coords: number[][];
  lineStyle: {
    color: string;
  };
}

/**
 * Transform data to Echarts series data
 */
export const transform = (data: ILine[]): [EcScatterItem[], EcLinesItem[]] => {
  const nodes: EcScatterItem[] = [];
  const edges: EcLinesItem[] = [];
  for (const line of data) {
    const coords = line.edges.map((i) => [i.x, i.y, i.mid] as number[]);
    edges.push({
      id: line.id,
      mid: line.mid,
      mdata: line,
      coords,
      lineStyle: {
        color: line.color,
      },
    });
    for (const node of line.nodes) {
      nodes.push({
        id: node.id,
        mid: node.mid,
        name: node.name,
        value: [node.x, node.y],
        itemStyle: {
          color: node.color,
        },
        label: {
          offset: [node.labelX, node.labelY],
        },
        mdata: node,
      });
    }
  }
  return [nodes, edges];
};
