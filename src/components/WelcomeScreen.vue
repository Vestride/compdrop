<template>
  <div class="welcome-screen" :class="{ 'welcome-screen--can-drop': canDrop }">
    <div class="welcome-screen__inner">
      <div class="type--center" v-if="!canDrop">
        <p class="type-header-1">Drop images here.</p>
        <p>png, jpg, gif, bmp</p>
        <p><label class="btn" for="file-input">Choose files</label></p>
        <input type="file" accept="image/*" multiple class="welcome-screen__file-input" @change="handleFiles" id="file-input">
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

  handleFiles(evt: Event): void {
    const target = evt.target as HTMLInputElement;
    this.$emit('fileschosen', Array.from(target.files));
    target.value = '';
  }
}
</script>


<style>
.welcome-screen {
  display: block;
  padding: 52px 40px;
  height: 100vh;
}

.welcome-screen__inner {
  border: 5px dashed rgb(189, 189, 189);
  display: flex;
  height: 100%;
  background-color: white;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
}

.welcome-screen--can-drop .welcome-screen__inner {
  border-style: solid;
  border-color: mediumseagreen;
}

.welcome-screen__text {
  margin: 0;
}

.welcome-screen__file-input {
  position: absolute;
  opacity: 0;
  width: 1px;
}

@media screen and (max-width: 767px) {
  .welcome-screen {
    padding-left: 16px;
    padding-right: 16px;
  }
}

</style>

