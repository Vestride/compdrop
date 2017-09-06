<template>
  <div class="image-viewer" :class="{ 'image-viewer--user-inactive': !isUserActive }"
      @click="handleNextTrigger"
      @mousemove="handleUserAction"
      tabindex="-1"
      @keydown.left.prevent="handlePreviousTrigger"
      @keydown.75.prevent="handlePreviousTrigger"
      @keydown.right.prevent="handleNextTrigger"
      @keydown.74.prevent="handleNextTrigger">
    <div class="image-viewer__images">
      <img v-for="(displayImage, i) in images" class="image-viewer__img" :class="{ hidden: i !== selectedIndex }" :src="displayImage.src" :key="displayImage.id" />
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
  },
})
export default class ImageViewer extends Vue {
  images: DisplayImage[];
  selectedIndex: number = 0;
  isUserActive: boolean = false;
  timer: number;

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

  handleUserAction(): void {
    clearTimeout(this.timer);
    this.isUserActive = true;
    this.timer = setTimeout(() => {
      this.isUserActive = false;
    }, 3000);
  }

  handleNextTrigger(evt: MouseEvent | KeyboardEvent): void {
    this.goToNext(evt.shiftKey === false);
    this.handleUserAction();
  }

  handlePreviousTrigger(evt: MouseEvent | KeyboardEvent): void {
    this.goToPrevious(evt.shiftKey === false);
    this.handleUserAction();
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

<style scoped>
  .image-viewer {
    position: relative;
    min-height: 100vh;
    background-color: rgb(240, 240, 240);
  }

  #app.layout-centered .image-viewer__images {
    display: flex;
    justify-content: center;
  }

  .image-viewer__img {
    user-select: none;
  }

  .image-viewer--user-inactive .fade-when-inactive {
    opacity: 0;
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

