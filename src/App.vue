<template>
  <div id="app" :class="{
    'layout-centered': isCenteredImageMode,
    'user-inactive': !isUserActive,
  }"
    tabindex="-1"
    @mousemove="handleUserAction"
    @mousedown="handleUserAction">
    <help-menu />
    <main @dragover="handleDragHover" @dragleave="handleDragCancel" @drop="handleDrop">
      <welcome-screen v-if="!hasContent" :can-drop="canDrop"/>
      <collection-viewer v-if="hasContent" :collections="collections"/>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DisplayImage from './DisplayImage';
import Collection from './Collection';

let count = 0;
function uniqueId(): number {
  count += 1;
  return count;
}

function maybePluralize(count: number, noun: string, suffix: string = 's') {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

@Component
export default class App extends Vue {
  collections: Collection[] = [];
  hasContent: boolean = false;
  canDrop: boolean = false;
  isCenteredImageMode: boolean = true;

  // Activity watcher.
  isUserActive: boolean = false;
  timer: number;

  handleDragHover(evt: DragEvent): void {
    evt.preventDefault();
    // evt.dataTransfer.dropEffect = 'copy';
    this.canDrop = true;
  }

  handleDragCancel(evt: DragEvent): void {
    evt.preventDefault();
    this.canDrop = false;
  }

  handleDrop(evt: DragEvent): void {
    evt.preventDefault();

    // Filter out non-images and sort by file name.
    const fileList = Array.from(evt.dataTransfer.files)
      .filter((file: File): boolean => file.type.includes('image/'))
      .sort((a: File, b: File): number => a.name.localeCompare(b.name));

    if (fileList.length > 0) {
      // Async load all files with a FileReader and update the images array when done.
      this.renderFirstImageThenOthers(fileList);
    }

    // Hide drop messaging.
    this.canDrop = false;
  }

  async renderFirstImageThenOthers(files: File[]): Promise<void> {
    const collectionId = uniqueId();
    // Remove the first file from the array.
    // const first = files.shift();

    // Read the file and update the images property so that Vue re-renders.
    // This intentionally blocks execution for reading the other files.
    // const image = await this.getDisplayImage(first);
    // const collectionIndex = this.collections.length;
    // this.collections[collectionIndex] = [image];

    // Set flag for whether there was content after the first display image has
    // been read.
    // this.hasContent = this.collections.length > 0 || files.length > 0;

    // Wait a frame, then start reading the remaining files.
    // requestAnimationFrame(() => {
      Promise.all(this.getDisplayImages(files)).then((images) => {
        // this.collections[collectionIndex] = this.collections[collectionIndex].concat(images);
        this.collections.push({
          id: collectionId,
          images,
        });
        this.hasContent = this.collections.length > 0 || files.length > 0;
        this.updatePageTitle();
      });
    // });
  }

  getDisplayImages(files: File[]): Promise<DisplayImage>[] {
    return files.map(this.getDisplayImage);
  }

  getDisplayImage(file: File): Promise<DisplayImage> {
    const id = uniqueId();
    const filename = file.name;
    return new Promise((resolve) => {
      const reader = new FileReader();

      // Resolve promise when the reader finishes.
      reader.onload = () => {
        resolve({
          id,
          filename,
          src: reader.result,
        });
      };

      // Start reader.
      reader.readAsDataURL(file)
    });
  }

  getPageTitle(): string {
    if (this.collections.length > 1) {
      const totalImages = this.collections.reduce((total, collection) => total + collection.images.length, 0);
      return `${maybePluralize(this.collections.length, 'collection')} – ${maybePluralize(totalImages, 'image')} – compdrop`;
    }

    return `${maybePluralize(this.collections[0].images.length, 'image')} – compdrop`;
  }

  updatePageTitle(): void {
    document.title = this.getPageTitle();
  }

  mounted(): void {
    this._handleKeyDown = this._handleKeyDown.bind(this);
    document.addEventListener('keydown', this._handleKeyDown);
  }

  beforeDestroy(): void {
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  _handleKeyDown(evt: KeyboardEvent): void {
    this.handleUserAction();
    const number = parseInt(evt.key, 10);
    const isNumber = !isNaN(number);

    if (evt.shiftKey && evt.keyCode === 191) {
      this.helpToggle();
    } else if (evt.keyCode === 82) {
      this.reset();
    } else if (this.hasContent && isNumber && !evt.metaKey && !evt.shiftKey) {
      this.$emit('selectgroup', number - 1);
    }
  }

  helpToggle(): void {
    this.$emit('helptoggle');
  }

  reset(): void {
    this.collections = [];
    this.hasContent = false;
  }

  // Activity watcher
  handleUserAction(): void {
    clearTimeout(this.timer);
    this.isUserActive = true;
    this.timer = setTimeout(() => {
      this.isUserActive = false;
    }, 3000);
  }

  /*
  preloadImages(images: string[]): Promise<void>[] {
    return images.map((dataURI: string) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { resolve(); };
      img.src = dataURI;
    }));
  }
  */
};
</script>

<style>
.layout-centered main {
  overflow: hidden;
}

.user-inactive .fade-when-inactive {
  opacity: 0;
}
</style>
