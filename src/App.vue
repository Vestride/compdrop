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
      <image-viewer v-if="hasContent" :images="images"/>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DisplayImage from './DisplayImage';

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
  groups: DisplayImage[][] = [];
  images: DisplayImage[] = [];
  selectedGroupIndex: number = 0;
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

      // Set flag for whether there was content.
      this.hasContent = this.groups.length > 0 || fileList.length > 0;
    }

    // Hide drop messaging.
    this.canDrop = false;
  }

  async renderFirstImageThenOthers(files: File[]): Promise<void> {
    // Remove the first file from the array.
    const first = files.shift();

    // Read the file and update the images property so that Vue re-renders.
    // This intentionally blocks execution for reading the other files.
    const image = await this.getDisplayImage(first);
    const groupIndex = this.groups.length;
    this.groups[groupIndex] = [image];
    this.images = [image];

    // Wait a frame, then start reading the remaining files.
    // Fix? This won't sort newly added images by file name. Sort button?
    requestAnimationFrame(() => {
      Promise.all(this.getDisplayImages(files)).then((images) => {
        this.groups[groupIndex] = this.groups[groupIndex].concat(images);
        this.images = this.images.concat(images);

        if (this.groups.length > 1) {
          const totalImages = this.groups.reduce((total, images) => total + images.length, 0);
          document.title = `${maybePluralize(this.groups.length, 'group')} – ${maybePluralize(totalImages, 'image')} – compdrop`;
        } else {
          document.title = `${maybePluralize(this.images.length, 'image')} – compdrop`;
        }
      });
    });
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

  setSelectedGroup(index: number): void {
    if (this.hasContent && index > -1 && index < this.groups.length) {
      this.selectedGroupIndex = index;
      this.images = this.groups[index];
    }
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
    } else if (isNumber && !evt.metaKey && !evt.shiftKey) {
      this.setSelectedGroup(number - 1);
    }
  }

  helpToggle(): void {
    this.$emit('helptoggle');
  }

  reset(): void {
    this.groups = [];
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
