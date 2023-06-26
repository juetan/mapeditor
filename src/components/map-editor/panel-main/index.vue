<template>
  <div class="editor-main">
    <div class="editor-main-wrapper" @contextmenu="($event) => emit('contextmenu', $event)" @click="onClick">
      <div id="map1"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["contextmenu", "click"]);

const onClick = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  emit("click", e);
};
</script>

<style>
.editor-main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 16px;
}
.editor-main-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
#map1 {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
