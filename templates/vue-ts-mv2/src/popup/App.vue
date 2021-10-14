<template>
  <div className="app">
    <img :src="logo" className="logo" />
    <div class="btn-wrapper">
      <div
        @click="goToOptions"
        class="crx-btn"
        :style="{
          width: '150px',
          height: '30px',
          lineHeight: '30px',
          cursor: 'pointer',
        }"
      >
        Go to Options Page
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// get static files by chrome.runtime.getURL
const logo = chrome.runtime.getURL("assets/create-crx-app.png");

export default defineComponent({
  name: "App",
  data: function () {
    return {
      logo,
    };
  },
  methods: {
    goToOptions() {
      // go to options page
      chrome.runtime.openOptionsPage();
    },
  },
});
</script>

<style lang="less" scoped>
@import "../style/popup.less";
</style>
