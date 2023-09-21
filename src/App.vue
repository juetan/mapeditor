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

<style scoped></style>
