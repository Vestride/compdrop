<template>
  <div class="welcome-screen" v-bind:class="{ 'welcome-screen--can-drop': canDrop }">
    <div class="welcome-screen__inner">
      <p class="welcome-screen__text" v-if="!canDrop">Drop images here.</p>
      <p class="welcome-screen__text" v-if="canDrop">Drop em!</p>
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


<style scoped>
.welcome-screen {
  margin: 40px;
  height: calc(100vh - 80px);
}

.welcome-screen__inner {
  border: 5px dashed gray;
  display: flex;
  padding: 40px;
  height: inherit;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.welcome-screen--can-drop .welcome-screen__inner {
  border-style: solid;
  border-color: mediumseagreen;
}

.welcome-screen__text {
  margin: 0;
  font-size: 36px;
}
</style>

