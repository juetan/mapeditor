<template>
  <div
    ref="contextmenuRef"
    class="me-contextmenu"
    :style="{
      display: show ? 'grid' : 'none',
      left: left + 'px',
      top: top + 'px',
    }"
  >
    <template v-for="item in items" :key="item.name">
      <div v-if="item.type === 'divider'" class="me-contextmenu-divider"></div>

      <div
        v-else
        class="me-contextmenu-item"
        @mouseover="() => (item.showChildren = true)"
        @mouseleave="() => (item.showChildren = false)"
      >
        <div @click="onItemClick(item.onClick)" class="me-contextmenu-inner">
          <div class="me-contextmenu-icon">
            <IconCheck v-if="item.icon?.() === 'check'" />
            <component v-else :is="item.icon"></component>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px">
            <span class="me-contextmenu-name"> {{ item.name }} </span>
            <span class="me-contextmenu-tip"> {{ item.tip }} </span>
          </div>
          <div class="me-contextmenu-expand" v-if="item.children">
            <IconRight />
          </div>
        </div>
        <MeContextmenuMenu
          v-if="item.children"
          v-bind="{
            show: item.showChildren,
            items: item.children,
          }"
          :style="{
            position: 'absolute',
            top: 0,
            left: '100%',
          }"
          @done="emit('done')"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconRight } from "@arco-design/web-vue/es/icon";
import { PropType } from "vue";

defineOptions({
  name: "MeContextmenuMenu",
});

defineProps({
  left: {
    type: Number,
    default: 0,
  },
  top: {
    type: Number,
    default: 0,
  },
  right: {
    type: Number,
    default: 0,
  },
  bottom: {
    type: Number,
    default: 0,
  },
  show: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<any[]>,
  },
});

const emit = defineEmits(["done"]);

const onItemClick = async (click: Function) => {
  await click?.();
  emit("done");
};
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
.me-contextmenu-item {
  position: relative;
  margin: 0 6px;
  font-size: 14px;
}
.me-contextmenu-inner {
  display: grid;
  grid-template-columns: 16px 1fr 16px;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  height: 28px;
  padding: 0 4px 0 8px;
  cursor: pointer;
  border-radius: 4px;
}
.me-contextmenu-inner:hover {
  background: var(--color-neutral-2);
}
.me-contextmenu-icon {
  width: 16px;
}
.me-contextmenu-name {
  flex: 1;
}
.me-contextmenu-tip {
  font-size: 12px;
  color: var(--color-neutral-6);
}
.me-contextmenu-divider {
  height: 1px;
  background: var(--color-neutral-3);
  margin: 0;
}
.me-contextmenu-expand {
  color: var(--color-neutral-5);
}
</style>
