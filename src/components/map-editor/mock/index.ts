import { uniqueId } from "lodash-es";

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

export interface IEdge {
  x: number;
  y: number;
}

export interface ILine {
  id: string;
  mid: string;
  name: string;
  color: string;
  edges: IEdge[];
  nodes: INode[];
}

export const randomColor = (): string => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
};

export const loadData = (): ILine[] => {
  const items = Array(12).fill(0);
  return items.map((_, index) => {
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
};

export interface ChartNode {
  id: string;
  mid: string;
  name: string;
  value: [number, number];
  label: {
    offset: [number, number];
  };
  itemStyle: {
    color: string;
  };
  $data: INode;
}

export interface ChartEdge {
  id: string;
  mid: string;
  coords: [number, number][];
  lineStyle: {
    color: string;
  };
  $data: ILine;
}

export const transform = (data: ILine[]): [ChartNode[], ChartEdge[]] => {
  const nodes: ChartNode[] = [];
  const edges: ChartEdge[] = [];
  for (const line of data) {
    const coords = line.edges.map((i) => [i.x, i.y] as [number, number]);
    edges.push({
      id: line.id,
      mid: line.mid,
      coords,
      lineStyle: {
        color: line.color,
      },
      $data: line,
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
        $data: node,
      });
    }
  }
  return [nodes, edges];
};
