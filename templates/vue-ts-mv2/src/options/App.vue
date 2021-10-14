<template>
  <div class="container">
    <div class="title">create-crx-app</div>
    <div class="start" @click="goToExtensionDoc">
      Getting Chrome Extension Start &nbsp;
      <div class="arrow"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const chromeExtensionUrl = "https://developer.chrome.com/docs/extensions/";

export default defineComponent({
  name: "App",
  methods: {
    goToExtensionDoc() {
      window.open(chromeExtensionUrl);
    },
  },
});
</script>

<style lang="less" scoped>
@import "../style/options.less";
</style>
