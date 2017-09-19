<template>
  <div class="welcome-screen" :class="{ 'welcome-screen--can-drop': canDrop }">
    <div class="welcome-screen__inner">
      <div class="type--center" v-if="!canDrop">
        <p class="type-header-1">Drop images here.</p>
        <p>png, jpg, gif, bmp</p>
      </div>
      <div v-if="canDrop">
        <p class="type-header-1">Release!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    canDrop: {
      type: Boolean,
      required: true,
    },
  },
})
export default class WelcomeScreen extends Vue {
  canDrop: boolean;
}
</script>


<style>
.welcome-screen {
  padding: 40px;
  height: 100vh;
  background-color: rgb(240, 240, 240);
}

.welcome-screen__inner {
  border: 5px dashed rgb(189, 189, 189);
  display: flex;
  height: 100%;
  background-color: white;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.welcome-screen--can-drop .welcome-screen__inner {
  border-style: solid;
  border-color: mediumseagreen;
}

.welcome-screen__text {
  margin: 0;
}
</style>

