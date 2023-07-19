<template>
  <div class="panel-right">
    <div style="margin-bottom: 12px;">属性设置</div>
    <TypeNode :current="current" v-if="current.selectedType === SelectType.NODE" />
    <TypeLine :current="current" v-else-if="current.selectedType === SelectType.LINE" />
    <TypeEdge :current="current" v-else-if="current.selectedType === SelectType.EDGE" />
    <TypeConfig :current="current" v-else="current.selectedType === SelectType.CONFIG" />
  </div>
</template>

<script setup lang="ts">
import { MeContext, SelectType } from "../main/interface";
import TypeConfig from "./type-config.vue";
import TypeEdge from "./type-edge.vue";
import TypeLine from "./type-line.vue";
import TypeNode from "./type-node.vue";

defineModel<MeContext>("current", { required: true });
</script>

<style>
.panel-right {
  padding: 12px;
}
</style>
