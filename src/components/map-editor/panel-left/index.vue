<template>
  <div>
    <Scrollbar style="height: 100%; overflow: auto" :type="'embed'">
      <div style="padding: 16px">
        <div style="margin-bottom: 8px">#线路列表</div>
        <Collapse :bordered="false" :expand-icon-position="'right'">
          <CollapseItem v-for="line in data" :key="line.id" :header="line.name">
            <div>基本属性</div>
            <ul class="editor-node-list">
              <li
                class="editor-node-item"
                :class="{ 'editor-node-active': current.selected === line }"
                @click="onSelectLine(line)"
              >
                基本属性
              </li>
            </ul>
            <div>
              边点列表
              <span class="editor-tip">({{ line.edges.length }})</span>
            </div>
            <ul class="editor-node-list">
              <li class="editor-node-item" @click="onStartPick(line)">开始画线</li>
              <li class="editor-node-item" v-for="(edge, i) in line.edges" :key="i">
                {{ `边点${edge && i}` }}
              </li>
            </ul>
            <div>
              节点列表
              <span class="editor-tip">({{ line.nodes.length }})</span>
            </div>
            <ul class="editor-node-list">
              <li
                class="editor-node-item"
                v-for="(node, index) in line.nodes"
                :key="node.id"
                :class="{ 'editor-node-active': current.selected === node }"
                :style="{ cursor: node.inited ? 'pointer' : 'grab' }"
                @click="onItemClick(node)"
                @mousedown="onMouseDown(node, $event)"
              >
                <span>{{ `${String(index + 1).padStart(2)}. ${node.name}` }}</span>
                <span :title="!node.inited ? '该节点尚未初始化，请拖拽到画布中进行初始化' : ''">
                  <IconCheck v-if="node.inited" style="color: #3c9"></IconCheck>
                  <IconInfo v-else></IconInfo>
                </span>
              </li>
            </ul>
          </CollapseItem>
        </Collapse>
        <div
          v-show="current.dragger.show"
          class="editor-dragger"
          :style="{
            width: `${current.dragger.width}px`,
            height: `${current.dragger.height}px`,
            top: `${current.dragger.y}px`,
            left: `${current.dragger.x}px`,
            background: '#09f',
            opacity: 0.4,
          }"
        ></div>
      </div>
    </Scrollbar>
  </div>
</template>

<script setup lang="ts">
import { Collapse, CollapseItem, Modal, Scrollbar } from "@arco-design/web-vue";
import { IconCheck, IconInfo } from "@arco-design/web-vue/es/icon";
import { PropType } from "vue";
import { ICurrent, SelectType } from "../main/interface";
import { ILine, INode } from "../mock";

defineProps({
  data: {
    type: Object as PropType<ILine[]>,
    required: true,
  },
});
const current = defineModel<ICurrent>("current", { required: true });
const emit = defineEmits(["drag-end", "start-pick"]);

const onItemClick = (item: INode) => {
  if (!item.inited) {
    return;
  }
  current.value.selected = item;
  current.value.selectedType = SelectType.NODE;
};

const onStartPick = async (line: ILine) => {
  if (line.edges.length) {
    await Modal.confirm({ title: "提示", content: "当前已存在边，是否清除再继续?" });
  }
  console.log("ok");
};

const onSelectLine = (line: ILine) => {
  current.value.selected = line;
  current.value.selectedType = SelectType.LINE;
};

const onMouseDown = (item: INode, e: MouseEvent) => {
  e.preventDefault();
  if (item.inited) {
    return;
  }
  const { width, height } = current.value.dragger;
  current.value.dragger.item = item;
  current.value.dragger.x = e.clientX - width / 2;
  current.value.dragger.y = e.clientY - height / 2;
  current.value.dragger.show = true;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
  e.preventDefault();
  if (!current.value.dragger.item) {
    return;
  }
  const { width, height } = current.value.dragger;
  current.value.dragger.x = e.clientX - width / 2;
  current.value.dragger.y = e.clientY - height / 2;
};

const onMouseUp = (e: MouseEvent) => {
  e.preventDefault();
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  const { width, height } = current.value.dragger;
  current.value.dragger.show = false;
  current.value.dragger.x += width / 2;
  current.value.dragger.y += height / 2;
  emit("drag-end", current.value.dragger);
};
</script>

<style>
ul {
  display: grid;
  gap: 8px;
  list-style: none;
  padding: 0;
}
.editor-node-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 0 8px;
  height: 32px;
  border: 1px solid var(--color-neutral-4);
  color: #606266;
  border-radius: 4px;
  cursor: pointer;
}
.editor-node-active {
  border-color: #09f;
  color: #09f;
}
div.arco-collapse-item-content {
  padding: 0 !important;
}
.editor-dragger {
  position: fixed;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 4px 8px #09f;
  z-index: 10000;
  cursor: grabbing;
}
.editor-tip {
  font-size: 12px;
  color: var(--color-neutral-6);
}
div.arco-collapse-item-header {
  padding-left: 2px;
  padding-right: 0;
}
.arco-collapse-item span.arco-collapse-item-icon-right {
  right: 0;
}
div.arco-collapse-item-content {
  background-color: transparent;
}
</style>
