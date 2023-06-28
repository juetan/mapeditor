<template>
  <Modal
    v-model:visible="modal.visible"
    title="地图编辑器"
    :closable="false"
    :footer="false"
    :title-align="'start'"
    :fullscreen="true"
  >
    <template #title>
      <PanelHeader
        :stat="stat"
        :config="config"
        v-model:current="current"
        @modify-node="onModifyNode"
        @modify-edge="onModifyEdge"
        @modify-none="onModifyNone"
        @modify-show-label="onModifyShowLabel"
        @modify-rerender="onModifyRerender"
      ></PanelHeader>
    </template>
    <div class="editor-layout">
      <PanelLeft
        :data="data"
        v-model:current="current"
        @drag-end="onDragEnd"
        @start-pick="onStartPick"
        class="editor-panel editor-left"
      />
      <PanelMain class="editor-panel editor-main">
        <ContextMenu v-bind="current.contextmenu" @done="() => (current.contextmenu.show = false)"></ContextMenu>
      </PanelMain>
      <PanelRight v-model:current="current" class="editor-panel editor-right" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Modal } from "@arco-design/web-vue";
import { computed, nextTick, onMounted, provide, reactive, ref } from "vue";
import ContextMenu from "../../context-menu/index.vue";
import { MapChart } from "../core/map-chart";
import { SERIES } from "../core/map.config";
import { EcLinesItem, EcScatterItem, ILine, INode, IEdge, loadData, transform } from "../mock";
import PanelHeader from "../panel-header/index.vue";
import PanelLeft from "../panel-left/index.vue";
import PanelMain from "../panel-main/index.vue";
import PanelRight from "../panel-right/index.vue";
import { MeContext, Mode, SelectType, ContextmenuItem } from "./interface";
import { h } from "vue";
import { IconDelete, IconExport, IconImport } from "@arco-design/web-vue/es/icon";
import { uniqueId } from "lodash-es";

const map = new MapChart();
const data = ref<ILine[]>([]);
const config = ref({
  ...map.config,
  showNodeLabel: true,
  shwoEdge: true,
  showNode: true,
});

const current = reactive<MeContext>({
  mode: Mode.NONE,
  line: undefined,
  site: undefined,
  selected: undefined,
  selectedType: undefined,
  dragger: {
    width: 32,
    height: 32,
    x: 0,
    y: 0,
    item: undefined,
    show: false,
  },
  contextmenu: {
    show: false,
    x: 0,
    y: 0,
    items: [],
  },
});

const treeEach = (tree: any[], fn: (item: any) => void) => {
  tree.forEach((item) => {
    fn(item);
    if (item.children) {
      treeEach(item.children, fn);
    }
  });
};

const openContextmenu = (x: number, y: number, items: ContextmenuItem[]) => {
  treeEach(items, (item) => {
    item.uid = uniqueId();
    item.showChildren = false;
  });
  current.contextmenu.items = items;
  current.contextmenu.x = x;
  current.contextmenu.y = y;
  current.contextmenu.show = true;
};

const contextItems: ContextmenuItem[] = [
  {
    name: "打开文件...",
    tip: "Ctrl + O",
    onClick: () => {
      Modal.info({
        title: "打开文件",
        content: () => h("div", { style: "margin: 20px" }, "暂未实现"),
        simple: false,
        titleAlign: "start",
        closable: false,
        alignCenter: true,
        modalStyle: {
          top: "50%",
          transform: "translateY(-50%)",
        },
      });
    },
  },
  {
    type: "divider",
  },
  {
    name: "显示边线",
    icon: () => (config.value.shwoEdge ? "check" : ""),
    onClick: () => {
      if (config.value.shwoEdge) {
        map.setEdges([]);
        config.value.shwoEdge = false;
      } else {
        const [_, edges] = transform(data.value);
        map.setEdges(edges);
        config.value.shwoEdge = true;
      }
    },
  },
  {
    name: "显示节点",
    icon: () => (config.value.showNode ? "check" : ""),
    onClick: () => {
      if (config.value.showNode) {
        map.setNodes([]);
        config.value.showNode = false;
      } else {
        const [nodes] = transform(data.value);
        map.setNodes(nodes);
        config.value.showNode = true;
      }
    },
  },
  {
    name: "显示节点标签",
    icon: () => (config.value.showNodeLabel ? "check" : ""),
    onClick: () => {
      onModifyShowLabel(!config.value.showNodeLabel);
    },
  },
  {
    type: "divider",
  },
  {
    icon: () => (current.mode === Mode.MODIFY_LINE ? "check" : ""),
    name: "编辑边点",
    onClick: () => {
      if (current.mode === Mode.MODIFY_LINE) {
        return onModifyNone();
      }
      onModifyEdge();
    },
  },
  {
    icon: () => (current.mode === Mode.MODIFY_NODE ? "check" : ""),
    name: "编辑节点",
    onClick: () => {
      if (current.mode === Mode.MODIFY_NODE) {
        return onModifyNone();
      }
      onModifyNode();
    },
  },
  {
    name: "取消编辑",
    tip: "Esc",
    onClick: () => {
      onModifyNone();
    },
  },
  {
    name: "重新渲染",
    onClick: () => {
      onModifyRerender();
    },
  },
  {
    type: "divider",
  },
  {
    name: "保存为...",
    tip: "Ctrl + S",
    children: [
      {
        name: "保存为 .svg 文件",
        onClick: () => {
          const image = map.instance.getDataURL({ type: "svg" });
          const a = document.createElement("a");
          a.href = image;
          a.download = "mapeditor.svg";
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
      },
      {
        name: "保存为 .JSON 文件",
        onClick: () => {},
      },
    ],
  },
];

const pointItems: ContextmenuItem[] = [
  {
    name: "向前添加",
    icon: () => h(IconImport),
    onClick: () => null,
  },
  {
    name: "向后添加",
    icon: () => h(IconExport),
  },
  {
    name: "删除该点",
    icon: () => h(IconDelete),
  },
];

map.current = current;
const nodeMap = computed(() => {
  console.log('cpt');
  const map = new Map<string, INode>();
  for (const line of data.value) {
    for (const node of line.nodes) {
      map.set(node.mid, node);
    }
  }
  return map;
});
const edgeMap = computed(() => {
  const map = new Map<string, IEdge>();
  for (const line of data.value) {
    for (const node of line.edges) {
      map.set(node.mid, node);
    }
  }
  return map;
});

const stat = computed(() => {
  let lineCount = 0;
  let lineTotal = 0;
  let nodeCount = 0;
  let nodeTotal = 0;
  data.value.forEach((line) => {
    lineTotal += 1;
    lineCount += line.nodes.some((i) => !i.inited) ? 0 : 1;
    nodeTotal += line.nodes.length;
    nodeCount += line.nodes.filter((i) => i.inited).length;
  });
  return { lineCount, lineTotal, nodeCount, nodeTotal };
});

provide("CTX", { current });

const init = async () => {
  await nextTick();
  const el = document.querySelector("#map1") as HTMLElement;
  map.init(el);
  const [nodes, edges] = transform(data.value);
  map.setNodes(nodes);
  map.setEdges(edges);
  initPointHandler();
  initNodeSelector();
  initContextMenu();
  initEdgePointsPicker();
};

const initPointHandler = () => {
  map.onNodePointChange = (node) => {
    const { mid, x, y } = node;
    const n = nodeMap.value.get(mid);
    if (n) {
      n.x = x;
      n.y = y;
    }
  };
  map.onEdgePointChange = (node) => {
    const { mid, x, y } = node;
    const n = edgeMap.value.get(mid);
    if (n) {
      n.x = x;
      n.y = y;
    }
  };
};

onMounted(() => {
  data.value = loadData();
  init();
});

const onModifyShowLabel = (value: boolean) => {
  config.value.showNodeLabel = value;
  map.instance.setOption({
    series: [
      {
        id: SERIES.NODE_ID,
        label: { show: value },
      },
    ],
  });
};

const onModifyNode = () => {
  current.mode = Mode.MODIFY_NODE;
  if (nodeMap.value.size < 1) {
    console.log("no nodes");
    return;
  }
  map.current.mode = Mode.MODIFY_NODE;
  map.setNodePoints();
};

const onModifyEdge = () => {
  current.mode = Mode.MODIFY_LINE;
  map.setEdgePoints();
};

const onModifyNone = () => {
  map.setNodePoints([]);
  map.setEdgePoints([]);
  current.mode = Mode.NONE;
  map.current.mode = Mode.NONE;
};

const onModifyRerender = () => {
  map.dispose();
  init();
};

/**
 * 初始化点击事件
 */
const initNodeSelector = () => {
  map.instance.on("georoam", () => {
    const opts = map.instance.getOption() as any;
    config.value.zoom = opts.geo[0].zoom;
  });

  map.instance.on("click", (params) => {
    if (current.mode !== Mode.NONE) {
      return;
    }
    if (params.componentSubType === "lines") {
      const mdata = (params.data as EcLinesItem).mdata;
      const node = data.value.find((i) => i.mid === mdata.mid);
      if (node) {
        current.selected = node;
        current.selectedType = SelectType.LINE;
      }
    }
    if (params.componentSubType === "scatter") {
      const mdata = (params.data as EcScatterItem).mdata;
      const node = nodeMap.value.get(mdata.mid);
      if (node) {
        current.selected = node;
        current.selectedType = SelectType.NODE;
      }
    }
  });
};

const initContextMenu = () => {};

const initEdgePointsPicker = () => {
  map.instance.on("click", (params) => {
    if (current.mode !== Mode.ADD_EDGE_POINT) {
      return;
    }
    if (params.componentSubType !== "scatter") {
      return;
    }
    const [x, y] = params.value as [number, number];
    current.line?.edges.push({ x, y, mid: uniqueId() });
  });

  map.instance.on("contextmenu", (params) => {
    console.log(params);
    params.event?.event.preventDefault();
    if (params.componentSubType === "scatter") {
      console.log("contextmenu scatter");
    }
    if (params.componentType === "graphic") {
      const x = params.event?.offsetX ?? 0;
      const y = params.event?.offsetY ?? 0;
      openContextmenu(x, y, pointItems);
      console.log("contextmenu graphic");
    }
  });

  map.instance.getZr().on("mousedown", () => {
    current.contextmenu.show = false;
  });

  map.instance.getZr().on("contextmenu", (params) => {
    if (params.target) {
      return;
    }
    params.event.preventDefault();
    const { offsetX, offsetY } = params.event as MouseEvent;
    openContextmenu(offsetX, offsetY, contextItems);
  });

  map.instance.getZr().on("click", (e) => {
    if (current.mode !== Mode.ADD_EDGE_POINT) {
      return;
    }
    if (e.target) {
      return;
    }
    const pixels = [e.offsetX, e.offsetY];
    if (!map.instance.containPixel("geo", pixels)) {
      return;
    }
    const [x, y] = map.instance.convertFromPixel("geo", pixels);
    current.line?.edges.push({ x, y, mid: uniqueId() });
  });
};

const onStartPick = (line: ILine) => {
  current.mode = Mode.ADD_EDGE_POINT;
  current.line = line;
};

/**
 * 拖拽结束后更新坐标
 */
const onDragEnd = () => {
  if (!current.dragger.item) {
    return;
  }
  const dom = map.instance.getDom() as HTMLElement;
  const { left, top, width, height } = dom.getBoundingClientRect();
  const x1 = current.dragger.x - left;
  const y1 = current.dragger.y - top;
  if (x1 < 0 || y1 < 0 || x1 > left + width || y1 > top + height) {
    return;
  }
  if (!map.instance.containPixel("geo", [x1, y1])) {
    return;
  }
  const [x, y] = map.instance.convertFromPixel("geo", [x1, y1]);
  current.dragger.item.x = x;
  current.dragger.item.y = y;
  current.dragger.item.inited = true;
  current.dragger.item = undefined;
  current.dragger.show = false;
  const [nodes, edges] = transform(data.value);
  map.setNodes(nodes);
  map.setEdges(edges);
};

const modal = reactive({
  visible: true,
  fullscreen: false,
});

const open = () => {
  modal.visible = true;
};

const close = () => {
  modal.visible = false;
};

defineExpose({
  open,
  close,
});
</script>

<style>
div.arco-page-header-wrapper {
  padding-left: 0;
  padding-right: 0;
}
span.arco-page-header-title {
  font-size: 16px;
  font-weight: 400;
}
div.arco-modal {
  display: grid;
  grid-template-rows: auto 1fr;
}
div.arco-modal-body {
  padding: 0;
}
.editor-layout {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 224px 1fr 200px;
  overflow: hidden;
  background: #f1f1f1;
}
.editor-layout .arco-scrollbar {
  height: 100%;
  overflow: hidden;
}
.editor-left {
  height: 100%;
  overflow: auto;
  border-right: 1px solid var(--color-neutral-3);
  background: #fefefe;
}
.editor-right {
  height: 100%;
  overflow: auto;
  border-left: 1px solid var(--color-neutral-3);
  background: #fefefe;
}
</style>
