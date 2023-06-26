<template>
  <div>
    <Form :model="current.selected" layout="vertical">
      <FormItem label="坐标X">
        <InputNumber v-model="current.selected.x" :min="0" />
      </FormItem>
      <FormItem label="坐标Y">
        <InputNumber v-model="current.selected.y" :min="0" />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, FormItem, InputNumber } from "@arco-design/web-vue";
import { ICurrent } from "../main/interface";

defineModel<ICurrent>("current", { required: true });
</script>

<style scoped></style>
