<template>
  <div>
    <Form :model="current.selected" layout="vertical">
      <FormItem label="边的宽度">
        <InputNumber v-model="current.selected.edgeWidth"></InputNumber>
      </FormItem>
      <FormItem label="节点名称大小">
        <InputNumber v-model="current.selected.nodeLabelSize"></InputNumber>
      </FormItem>
      <FormItem label="背景地图">
        <Button style="width: 100%">请选择SVG文件...</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Button, Form, FormItem, InputNumber } from "@arco-design/web-vue";
import { ICurrent } from "../main/interface";

defineModel<ICurrent>("current", { required: true });
</script>

<style scoped></style>
