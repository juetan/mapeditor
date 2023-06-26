<template>
  <PageHeader title="地图编辑器" class="editor-header">
    <template #title>
      <span>地图编辑器</span>
      <span class="editor-tip">
        &nbsp;(统计：{{ stat.lineCount }}/{{ stat.lineTotal }} 线路, {{ stat.nodeCount }}/{{ stat.nodeTotal }} 节点)
      </span>
    </template>
    <template #extra>
      <div clss="editor-header-right">
        <Checkbox
          v-model="config.showNodeLabel"
          @change="(v) => emit('modify-show-label', v)"
          style="margin-right: 8px"
        >
          显示节点标签
        </Checkbox>
        <Link type="text" @click="emit('modify-rerender')"> <IconRefresh /> 重新渲染 </Link>
        <Link type="text" @click="emit('modify-edge')"> <IconLink /> 编辑边点 </Link>
        <Link type="text" @click="emit('modify-node')"> <IconCopy /> 编辑节点 </Link>
        <Link type="text" @click="emit('modify-none')"> <IconExport /> 取消编辑 </Link>
        <Link type="text" @click="onSelectConfig"> <IconSettings /> 设置</Link>
        <Link type="text"> <IconPlayArrow /> 预览</Link>
        <Link type="text"> <IconCheck /> 保存</Link>
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
import { ICurrent, SelectType } from "../main/interface";

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

const current = defineModel<ICurrent>("current", { required: true });
const emit = defineEmits(["modify-node", "modify-none", "modify-edge", "modify-show-label", "modify-rerender"]);

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
  display: inline-flex;
  gap: 8px;
}
</style>
