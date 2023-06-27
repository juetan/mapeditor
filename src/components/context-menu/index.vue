<template>
  <div
    ref="contextmenuRef"
    class="me-contextmenu"
    :style="{
      display: state.show ? 'grid' : 'none',
      left: state.x + 'px',
      top: state.y + 'px',
    }"
    @contextmenu="onContextMenu"
  >
    <MeMenu v-bind="state" @done="() => (state.show = false)" />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import { nextTick } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";
import MeMenu from "./menu.vue";

defineOptions({
  name: "MeContextmenu",
});

const state = defineModel<{
  show: boolean;
  x: number;
  y: number;
  items: any[];
}>("state", { required: true });

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const treeEach = (tree: any[], fn: (item: any) => void) => {
  tree.forEach((item) => {
    fn(item);
    if (item.children) {
      treeEach(item.children, fn);
    }
  });
};

treeEach(state.value.items, (item) => {
  item.showChildren = false;
});

const contextmenuRef = ref<HTMLDivElement>();

const onClick = (e: Event) => {
  if (contextmenuRef.value?.contains(e.target as Node)) {
    return;
  }
  state.value.show = false;
};

onMounted(async () => {
  await nextTick();
  document.addEventListener("click", onClick);
});

onUnmounted(() => {
  document.removeEventListener("click", onClick);
});
</script>

<style>
.me-contextmenu {
  display: grid;
  gap: 4px;
  position: absolute;
  top: 20px;
  left: 20px;
  min-width: 256px;
  background: #fff;
  padding: 6px 0;
  border-radius: 4px;
  user-select: none;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}
</style>
