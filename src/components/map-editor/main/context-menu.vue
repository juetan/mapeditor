<template>
  <div
    class="me-contextmenu"
    :style="{
      display: show ? 'grid' : 'none',
      left: x + 'px',
      top: y + 'px',
    }"
    @contextmenu="onContextMenu"
  >
    <div class="me-contextmenu-item" v-for="i in 8" :key="i">
      <span class="me-contextmenu-icon"> <IconCheck v-if="Math.random() > 0.5" /> </span>
      <span class="me-contextmenu-name">测试操作</span>
      <span class="me-contextmenu-tip">Ctrl + E</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconCheck } from "@arco-design/web-vue/es/icon";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
</script>

<style>
.me-contextmenu {
  display: grid;
  gap: 4px;
  position: absolute;
  top: 20px;
  left: 20px;
  min-width: 224px;
  background: #fff;
  padding: 6px;
  border-radius: 4px;
  user-select: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}
.me-contextmenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  height: 28px;
  padding: 0 16px 0 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}
.me-contextmenu-item:hover {
  background: var(--color-neutral-3);
}
.me-contextmenu-icon {
  width: 16px;
}
.me-contextmenu-name {
  flex: 1;
}
.me-contextmenu-tip {
  font-size: 12px;
  color: var(--color-neutral-5);
}
</style>
