<template>
  <div
    :style="{
      width: '250px',
      height: '50px',
      lineHeight: '50px',
      borderColor: '#6777ef',
      cursor: 'pointer',
    }"
    class="crx-btn"
  >
    Created by Extension (Moveable) 🚀
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>

<style lang="less" scoped>
@import "../style/popup.less";
</style>
