<template>
  <PageHeader title="地图编辑器" class="editor-header" @back="emit('back')">
    <template #title>
      <span>地图编辑器</span>
      <span class="editor-tip">
        &nbsp;(线路：{{ stat.lineCount }}/{{ stat.lineTotal }} , 节点: {{ stat.nodeCount }}/{{ stat.nodeTotal }} ;
        缩放比例：{{ (config.zoom * 100).toFixed(2) }}%)
      </span>
    </template>
    <template #extra>
      <div class="editor-header-right">
        <Checkbox
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
      </div>
    </template>
  </PageHeader>
</template>

<script setup lang="ts">
import { Checkbox, Link, PageHeader } from "@arco-design/web-vue";
import {
IconCheck,
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
</script>

<style>
.editor-header {
  flex: 1;
  user-select: none;
}
.editor-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
