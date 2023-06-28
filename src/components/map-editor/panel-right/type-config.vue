<template>
  <Form :model="current.selected" layout="vertical">
    <FormItem label="背景地图">
      <input type="file" ref="inputRef" @change="onInputChange" style="display: none" />
      <Button style="width: 100%" @click="onSelectFile">请选择SVG文件...</Button>
    </FormItem>
    <FormItem label="背景名称">
      <Input v-model="current.selected.bgName" />
    </FormItem>
    <FormItem label="边的宽度">
      <InputNumber v-model="current.selected.edgeWidth"></InputNumber>
    </FormItem>
    <FormItem label="节点名称大小">
      <InputNumber v-model="current.selected.nodeLabelSize"></InputNumber>
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import { Button, Form, FormItem, Input, InputNumber } from "@arco-design/web-vue";
import { ref } from "vue";
import { MeContext } from "../main/interface";

const current = defineModel<MeContext>("current", { required: true });

const inputRef = ref<HTMLInputElement>();

const onSelectFile = () => {
  inputRef.value?.click();
};

const onInputChange = (e: Event) => {
  const el = e.target as HTMLInputElement;
  const file = Array.from(el.files ?? [])[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result);
    current.value.selected.bgData = reader.result as string;
  };
  reader.readAsText(file);
};
</script>

<style scoped></style>
