<template>
  <div>
    <Form :model="current.selected" layout="vertical">
      <FormItem label="节点名称">
        <Input v-model="current.selected.name"></Input>
      </FormItem>
      <FormItem label="父级名称">
        <Input v-model="current.selected.name"></Input>
      </FormItem>
      <FormItem label="坐标X">
        <InputNumber v-model="current.selected.x" :min="0" />
      </FormItem>
      <FormItem label="坐标Y">
        <InputNumber v-model="current.selected.y" :min="0" />
      </FormItem>
      <FormItem label="站名偏移X">
        <InputNumber v-model="current.selected.labelX" />
      </FormItem>
      <FormItem label="站名偏移Y">
        <InputNumber v-model="current.selected.labelY" />
      </FormItem>
      <FormItem label="站名旋转角度">
        <InputNumber v-model="current.selected.labelRotate" :min="-90" :max="90" />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, FormItem, Input, InputNumber } from "@arco-design/web-vue";
import { MeContext } from "../main/interface";

defineModel<MeContext>("current", { required: true });
</script>

<style scoped></style>
