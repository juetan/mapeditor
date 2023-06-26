<template>
  <div class="panel-right">
    <div>属性设置</div>
    <TypeNode :current="current" v-if="current.selectedType === SelectType.NODE" />
    <TypeLine :current="current" v-else-if="current.selectedType === SelectType.LINE" />
    <TypeEdge :current="current" v-else-if="current.selectedType === SelectType.EDGE" />
    <TypeConfig :current="current" v-else-if="current.selectedType === SelectType.CONFIG" />
    <Empty v-else> 请选择组件 </Empty>
  </div>
</template>

<script setup lang="ts">
import { Empty } from "@arco-design/web-vue";
import { ICurrent, SelectType } from "../main/interface";
import TypeConfig from "./type-config.vue";
import TypeEdge from "./type-edge.vue";
import TypeLine from "./type-line.vue";
import TypeNode from "./type-node.vue";

defineModel<ICurrent>("current", { required: true });
</script>

<style>
.panel-right {
  padding: 12px;
}
</style>
