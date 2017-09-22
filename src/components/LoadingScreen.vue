<template>
  <div class="loading-screen">
    <div class="loading-screen__inner">
      <h2 class="type-header-2 marginless loading-screen__text">Loading files</h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class LoadingScreen extends Vue {
}
</script>


<style>
.loading-screen {
  position: relative;
  z-index: 1100;
  display: block;
  height: 100vh;
}

.loading-screen__inner {
  display: flex;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loading-screen__text {
  color: white;
}
</style>

