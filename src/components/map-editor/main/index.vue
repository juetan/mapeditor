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
      <PanelMain class="editor-panel editor-main" @contextmenu="onContextMenu" @click="onMainClick">
        <ContextMenu v-bind="current.contextmenu"></ContextMenu>
      </PanelMain>
      <PanelRight v-model:current="current" class="editor-panel editor-right" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Modal } from "@arco-design/web-vue";
import { computed, nextTick, onMounted, provide, reactive, ref } from "vue";
import { MapChart } from "../core/map-chart";
import { SERIES } from "../core/map.config";
import { ChartNode, ILine, INode, loadData, transform } from "../mock";
import PanelHeader from "../panel-header/index.vue";
import PanelLeft from "../panel-left/index.vue";
import PanelMain from "../panel-main/index.vue";
import PanelRight from "../panel-right/index.vue";
import ContextMenu from "./context-menu.vue";
import { ICurrent, Mode, SelectType } from "./interface";

const map = new MapChart();
const data = ref<ILine[]>([]);
const config = ref({
  ...map.config,
  showNodeLabel: true,
});
const current = reactive<ICurrent>({
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
    items: [
      {
        name: "编辑边点",
      },
    ],
  },
});
map.current = current;
const nodeMap = computed(() => {
  const map = new Map<string, INode>();
  for (const line of data.value) {
    for (const node of line.nodes) {
      map.set(node.id, node);
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
  initNodeSelector();
  initContextMenu();
  initEdgePointsPicker();
};

onMounted(() => {
  data.value = loadData();
  init();
});

const onContextMenu = (e: MouseEvent) => {
  console.log(e);
  e.preventDefault();
  current.contextmenu.show = true;
  current.contextmenu.x = e.offsetX;
  current.contextmenu.y = e.offsetY;
};

const onMainClick = () => {
  current.contextmenu.show = false;
};

const onModifyShowLabel = (value: boolean) => {
  console.log("value", value);
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
  map.instance.on("click", (params) => {
    console.log(params);
    if (current.mode !== Mode.NONE) {
      return;
    }
    const data: ChartNode = (params.data as any)?.$data;
    if (!data) {
      return;
    }
    const node = nodeMap.value.get(data.id);
    if (node) {
      current.selected = node;
      current.selectedType = SelectType.NODE;
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
    current.line?.edges.push({ x, y });
  });
  map.instance.getZr().on("click", (e) => {
    if (current.mode !== Mode.ADD_EDGE_POINT) {
      return;
    }
    if (e.target) {
      return;
    }
    const pixels = [e.offsetX, e.offsetY];
    console.log(pixels);
    if (!map.instance.containPixel("geo", pixels)) {
      return;
    }
    const [x, y] = map.instance.convertFromPixel("geo", pixels);
    current.line?.edges.push({ x, y });
    console.log(pixels);
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
  const { left, top } = dom.getBoundingClientRect();
  const x1 = current.dragger.x - left;
  const y1 = current.dragger.y - top;
  if (x1 < 0 || y1 < 0) {
    return;
  }
  if (!map.instance.containPixel("geo", [x1, y1])) {
    console.log("out of map");
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
