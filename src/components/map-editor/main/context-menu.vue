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
    <template v-for="item in state.items" :key="item.name">
      <div v-if="item.type === 'divider'" class="me-contextmenu-divider"></div>

      <div v-else class="me-contextmenu-item" @mouseover="onMouseOver(item)" @mouseleave="onMouseOut(item)">
        <div @click="onItemClick(item.onClick)" class="me-contextmenu-inner">
          <span class="me-contextmenu-icon">
            <IconCheck v-if="item.icon?.() === 'check'" />
            <component v-else :is="item.icon"></component>
          </span>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
            <span class="me-contextmenu-name"> {{ item.name }} </span>
            <span class="me-contextmenu-tip"> {{ item.tip }} </span>
          </div>
          <span class="me-contextmenu-expand" v-if="item.children">
            <IconRight />
          </span>
        </div>
        <MeContextmenu
          v-if="item.children"
          :state="{
            show: vmap[item.name],
            x: 10,
            y: 10,
            items: item.children,
          }"
          :style="{
            position: 'absolute',
            top: 0,
            left: '100%',
          }"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { IconCheck, IconRight } from "@arco-design/web-vue/es/icon";
import { onUnmounted } from "vue";
import { reactive } from "vue";
import { computed } from "vue";
import { nextTick } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

defineOptions({
  name: "MeContextmenu",
});

const state = defineModel<{
  show: boolean;
  x: number;
  y: number;
  items: any[];
}>("state", { required: true });

const vmap = reactive<Record<string, any>>({});

const map = computed(() => {
  const map = new WeakMap();
  for (const item of state.value.items) {
    if (item.type === "divider") {
      continue;
    }
    if (item.children) {
      vmap[item.name] = false;
      map.set(item, false);
    }
  }
  return map;
});

const onMouseOver = (val: any) => {
  vmap[val.name] = true;
};

const onMouseOut = (val: any) => {
  console.log("leave", val);
  vmap[val.name] = false;
};

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const onItemClick = async (click: Function) => {
  await click();
  state.value.show = false;
};

const contextmenuRef = ref<HTMLDivElement>();

const onClick = (e: Event) => {
  console.log("click");
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
