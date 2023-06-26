<script setup lang="ts">
import { MapEditor } from "./components/map-editor";
import { ref } from "vue";
import { Button } from "@arco-design/web-vue";

const editorRef = ref<InstanceType<typeof MapEditor>>();

const open = () => {
  editorRef.value?.open();
};
</script>

<template>
  <div>
    <map-editor ref="editorRef"></map-editor>
    <Button @click="open">打开</Button>
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
