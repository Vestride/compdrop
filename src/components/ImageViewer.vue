<template>
  <div class="image-viewer" @click="goToNext">
    <img class="image-viewer__img" v-bind:src="currentSource" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    images: Array,
  },
})
export default class ImageViewer extends Vue {
  // Prop
  images: string[];

  index: number = 0;

  get currentSource(): string {
    return this.images[this.index];
  }

  setSelectedIndex(index: number): void {
    if (index >= 0 || index < this.images.length) {
      this.index = index;
    }
  }

  goToNext(): void {
    this.setSelectedIndex(this.index === this.images.length - 1 ? 0 : this.index + 1);
  }

  goToPrevious(): void {
    this.setSelectedIndex(this.index === 0 ? this.images.length - 1 : this.index - 1);
  }
}
</script>

<style scoped>
  .image-viewer {
    height: 100vh;
    overflow-x: auto;
  }

  .image-viewer__img {
    /* width: 100%;
    max-width: none;
    height: 100%;
    object-fit: contain; */
    user-select: none;
  }
</style>

