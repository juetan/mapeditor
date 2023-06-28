<template>
  <div
    ref="contextmenuRef"
    class="me-contextmenu"
    :style="{
      display: props.show ? 'grid' : 'none',
      left: props.x + 'px',
      top: props.y + 'px',
    }"
    @contextmenu="onContextMenu"
  >
    <MeMenu v-bind="props" @done="onDone" />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";
import MeMenu from "./menu.vue";
import { PropType } from "vue";

defineOptions({
  name: "MeContextmenu",
});

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  items: {
    type: Array as PropType<any[]>,
  },
});

const onContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const emit = defineEmits(["done"]);

const onDone = () => {
  emit("done");
};

const contextmenuRef = ref<HTMLDivElement>();

const onClick = (e: Event) => {
  if (contextmenuRef.value?.contains(e.target as Node)) {
    return;
  }
  emit("done");
};

onMounted(() => {
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
