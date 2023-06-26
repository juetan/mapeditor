<template>
  <div>
    <Form :model="current.selected" layout="vertical">
      <FormItem label="节点名称">
        <Input v-model="current.selected.name"></Input>
      </FormItem>
      <FormItem label="颜色">
        <Input v-model="current.selected.color"></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Form, FormItem, Input } from "@arco-design/web-vue";
import { ICurrent } from "../main/interface";

defineModel<ICurrent>("current", { required: true });
</script>

<style scoped></style>
