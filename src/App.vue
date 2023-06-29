<script setup lang="ts">
import { Button } from "@arco-design/web-vue";
import { ref } from "vue";
import { MapEditor } from "./components/map-editor";

const editorRef = ref<InstanceType<typeof MapEditor>>();

const open = () => {
  editorRef.value?.open();
};
</script>

<template>
  <div>
    <map-editor ref="editorRef"></map-editor>
    <Button @click="open" type="primary">打开编辑器</Button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
