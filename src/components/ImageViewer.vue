<template>
  <div class="image-viewer"
      @click="handleNextTrigger"
      tabindex="-1"
      @keydown.left.prevent="handlePreviousTrigger"
      @keydown.75.prevent="handlePreviousTrigger"
      @keydown.right.prevent="handleNextTrigger"
      @keydown.74.prevent="handleNextTrigger">
    <div class="image-viewer__images">
      <img v-for="(displayImage, i) in images" class="image-viewer__img"
        :class="{ hidden: i !== selectedIndex }"
        :src="displayImage.src"
        :alt="displayImage.filename"
        :key="displayImage.id"
        :style="{ transform: scaleImages ? 'scale(0.5)' : 'none' }" />
    </div>
    <button aria-label="next image" class="nav-button nav-button--next fade-when-inactive" @click.stop="handleNextTrigger">
      <svg viewBox="75.4 27 461.2 738"><path d="M167.7 27l368.9 369-368.9 369-92.3-92.3 276.7-276.7-276.7-276.7z"></path></svg>
    </button>
    <button aria-label="previous image" class="nav-button nav-button--prev fade-when-inactive" @click.stop="handlePreviousTrigger">
      <svg viewBox="75.396 26.994 461.208 738.012"><path d="M444.336 765.006l-368.94-369.006 368.94-369.006 92.268 92.268-276.738 276.738 276.738 276.738z"></path></svg>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DisplayImage from '../DisplayImage';

@Component({
  props: {
    images: Array,
    scaleImages: Boolean,
  },
})
export default class ImageViewer extends Vue {
  images: DisplayImage[];
  scaleImages: boolean;
  selectedIndex: number = 0;

  setSelectedIndex(index: number, scrollToTop: boolean = true): void {
    if (index >= 0 || index < this.images.length) {
      this.selectedIndex = index;

      if (scrollToTop) {
        window.scrollTo(0, 0);
      }
    }
  }

  getSelectedIndex(): number {
    return this.selectedIndex;
  }

  handleNextTrigger(evt: MouseEvent | KeyboardEvent): void {
    this.goToNext(evt.shiftKey === false);
  }

  handlePreviousTrigger(evt: MouseEvent | KeyboardEvent): void {
    this.goToPrevious(evt.shiftKey === false);
  }

  goToNext(scrollToTop: boolean): void {
    this.setSelectedIndex(this.selectedIndex === this.images.length - 1 ?
      0 :
      this.selectedIndex + 1, scrollToTop);
  }

  goToPrevious(scrollToTop: boolean): void {
    this.setSelectedIndex(this.selectedIndex === 0 ?
      this.images.length - 1 :
      this.selectedIndex - 1, scrollToTop);
  }
}
</script>

<style>
  .image-viewer {
    position: relative;
    min-height: 100vh;
    background-color: rgb(240, 240, 240);
  }

  .image-viewer__images {
    user-select: none;
  }

  .layout-centered .image-viewer__images {
    display: flex;
    justify-content: center;
  }

  .image-viewer__img {
    transform-origin: top center;
    max-width: none;
  }

  .nav-button {
    position: fixed;
    top: 50%;
    display: block;
    border: 0;
    margin-top: -30px;
    padding: 0;
    width: 60px;
    height: 60px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    transition: 200ms ease-out;
    will-change: transform;
  }

  .nav-button--prev {
    left: 12px;
  }

  .nav-button--next {
    right: 12px;
  }

  .nav-button:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .nav-button svg {
    display: block;
    margin-left: 11px;
    width: 40px;
    height: 40px;
    fill: white;
    transition: 200ms ease-out;
  }

  .nav-button:hover svg {
    transform: scale(1.1);
  }

  .nav-button--prev svg {
    margin-left: 8px;
  }
</style>

