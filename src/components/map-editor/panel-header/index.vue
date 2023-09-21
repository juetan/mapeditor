<template>
  <PageHeader title="地图编辑器" class="editor-header" @back="emit('back')" arco-theme="dark">
    <template #title>
      <div style="display: flex; align-items: center">
        <span style="font-weight: 700; font-size: 18px;">地图编辑器</span>
        <span class="editor-tip">
          &nbsp;(线路：{{ stat.lineCount }}/{{ stat.lineTotal }} , 节点: {{ stat.nodeCount }}/{{ stat.nodeTotal }} ;
          缩放比例：{{ (config.zoom * 100).toFixed(2) }}%)
        </span>
      </div>
    </template>
    <template #extra>
      <div class="editor-header-right">
        <!-- <Checkbox
          v-model="config.showNodeLabel"
          @change="(v) => emit('modify-show-label', v)"
          style="margin-right: 8px"
        >
          节点标签
        </Checkbox>
        <Link type="text" @click="emit('modify-rerender')">
          <template #icon><IconRefresh /></template>
          渲染
        </Link>
        <Link type="text" @click="emit('modify-edge')">
          <template #icon><IconLink /></template>
          边点
        </Link>
        <Link type="text" @click="emit('modify-node')">
          <template #icon><IconCopy /></template>
          节点
        </Link>
        <Link type="text" @click="emit('modify-none')">
          <template #icon><IconExport /></template>
          取消
        </Link>
        <Link type="text" @click="onSelectConfig">
          <template #icon><IconSettings /></template>
          设置
        </Link>
        <Link type="text">
          <template #icon><IconPlayArrow /></template>
          预览
        </Link>
        <Link type="text" @click="emit('save')">
          <template #icon><IconCheck /></template>
          保存
        </Link>
          显示节点标签
        </Checkbox> -->
        <Tooltip v-for="btn in buttons" :key="btn.text">
          <template #content>
            {{ btn.text }}
          </template>
          <Button :type="btn.type" @click="btn.onClick">
            <template #icon>
              <component :is="btn.icon"></component>
            </template>
          </Button>
        </Tooltip>
      </div>
    </template>
  </PageHeader>
</template>

<script setup lang="tsx">
import { Button, PageHeader, Tooltip } from "@arco-design/web-vue";
import {
IconCheckCircle,
IconCopy,
IconExport,
IconLink,
IconPlayArrow,
IconRefresh,
IconSettings,
} from "@arco-design/web-vue/es/icon";
import { MeContext, SelectType } from "../main/interface";

const props = defineProps({
  stat: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
});

const current = defineModel<MeContext>("current", { required: true });
const emit = defineEmits([
  "modify-node",
  "modify-none",
  "modify-edge",
  "modify-show-label",
  "modify-rerender",
  "back",
  "save",
]);

const onSelectConfig = () => {
  current.value.selectedType = SelectType.CONFIG;
  current.value.selected = props.config;
};

const buttons = [
  {
    icon: IconRefresh,
    text: "重新渲染",
    onClick: () => emit("modify-rerender"),
  },
  {
    icon: IconLink,
    text: "编辑边点",
    onClick: () => emit("modify-edge"),
  },
  {
    icon: IconCopy,
    text: "编辑节点",
    onClick: () => emit("modify-node"),
  },
  {
    icon: IconExport,
    text: "取消编辑",
    onClick: () => emit("modify-none"),
  },
  {
    icon: IconSettings,
    text: "全局设置",
    onClick: () => onSelectConfig(),
  },
  {
    icon: IconPlayArrow,
    text: "预览效果",
    onClick: () => emit("modify-rerender"),
  },
  {
    icon: IconCheckCircle,
    type: "primary" as any,
    text: "立即保存",
    onClick: () => emit("save"),
  },
];
</script>

<style>
.editor-header {
  flex: 1;
  user-select: none;
}
.editor-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
