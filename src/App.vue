<template>
  <div id="app" :class="{
    'layout-centered': isCenteredImageMode,
    'user-inactive': !isUserActive,
  }"
    tabindex="-1"
    @mousemove="handleUserAction"
    @mousedown="handleUserAction">
    <help-menu />
    <settings-menu @layoutchange="handleLayoutChange" @retinachange="handleRetinaChange" />
    <collections-menu v-show="hasContent" :collections="collections" />
    <main>
      <welcome-screen v-if="!hasContent" :can-drop="canDrop" @fileschosen="_addFileList" />
      <collection-viewer v-if="hasContent" :collections="collections" :scale-images="isScaledImageMode" />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import DisplayImage from './DisplayImage';
import Collection from './Collection';
import FileCollection from './FileCollection';
import { readDroppedItems, readFileAsDataURL, isImageFile } from './FileDropReader';

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
  isScaledImageMode: boolean = false;

  // Activity watcher.
  isUserActive: boolean = false;
  timer: number;

  _handleDragHover(evt: DragEvent): void {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    this.canDrop = true;
  }

  _handleDragCancel(evt: DragEvent): void {
    evt.preventDefault();
    this.canDrop = false;
  }

  _handleDrop(evt: DragEvent): void {
    evt.preventDefault();

    // Safari and IE don't support `items` property.
    if (evt.dataTransfer.items) {
      readDroppedItems(evt.dataTransfer.items).then((collections: FileCollection[]) => {
        collections.forEach((collection: FileCollection) => {
          this._addFileList(collection);
        });
      });
    } else {
      this._addFileList({
        name: '',
        files: Array.from(evt.dataTransfer.files),
      });
    }
  }

  _addFileList(fileCollection: FileCollection, collectionName: string = ''): void {
    // Filter out non-images and sort by file name.
    const files = fileCollection.files
      .filter(isImageFile)
      .sort((a: File, b: File): number => a.name.localeCompare(b.name));

    if (files.length > 0) {
      // Async load all files with a FileReader and update the images array when done.
      this.renderFirstImageThenOthers(files, fileCollection.name);
    }

    // Hide drop messaging.
    this.canDrop = false;
  }

  async renderFirstImageThenOthers(files: File[], collectionName: string): Promise<void> {
    const collectionId = uniqueId();
    // Remove the first file from the array.
    const first = files.shift();

    // Read the file and update the images property so that Vue re-renders.
    // This intentionally blocks execution for reading the other files.
    const image = await this.getDisplayImage(first);
    const collectionIndex = this.collections.length;
    this.collections[collectionIndex] = {
      id: collectionId,
      name: collectionName,
      images: [image],
    };

    // Set flag for whether there was content after the first display image has
    // been read.
    this.hasContent = this.collections.length > 0 || files.length > 0;

    // Wait a frame, then start reading the remaining files.
    requestAnimationFrame(() => {
      Promise.all(this.getDisplayImages(files)).then((images) => {
        this.collections.splice(collectionIndex, 1, {
          id: this.collections[collectionIndex].id,
          name: this.collections[collectionIndex].name,
          images: this.collections[collectionIndex].images.concat(images),
        });
        this.updatePageTitle();
      });
    });
  }

  getDisplayImages(files: File[]): Promise<DisplayImage>[] {
    return files.map(this.getDisplayImage);
  }

  getDisplayImage(file: File): Promise<DisplayImage> {
    return readFileAsDataURL(file).then((dataURL: string) => {
      return {
        id: uniqueId(),
        filename: file.name,
        src: dataURL,
      };
    });
  }

  getPageTitle(): string {
    if (this.collections.length > 1) {
      const totalImages = this.collections.reduce((total, collection) => total + collection.images.length, 0);
      return `${maybePluralize(this.collections.length, 'collection')} – ${maybePluralize(totalImages, 'image')} – compdrop`;
    }

    if (this.collections.length > 0) {
      return `${maybePluralize(this.collections[0].images.length, 'image')} – compdrop`;
    }

    return 'compdrop';
  }

  updatePageTitle(): void {
    document.title = this.getPageTitle();
  }

  mounted(): void {
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleDragHover = this._handleDragHover.bind(this);
    this._handleDragCancel = this._handleDragCancel.bind(this);
    this._handleDrop = this._handleDrop.bind(this);
    document.body.addEventListener('keydown', this._handleKeyDown);
    document.body.addEventListener('dragover', this._handleDragHover);
    document.body.addEventListener('dragleave', this._handleDragCancel);
    document.body.addEventListener('drop', this._handleDrop);
  }

  beforeDestroy(): void {
    document.body.removeEventListener('keydown', this._handleKeyDown);
    document.body.removeEventListener('dragover', this._handleDragHover);
    document.body.removeEventListener('dragleave', this._handleDragCancel);
    document.body.removeEventListener('drop', this._handleDrop);
  }

  _handleKeyDown(evt: KeyboardEvent): void {
    this.handleUserAction();
    const number = parseInt(evt.key, 10);
    const isNumber = !isNaN(number);

    if (evt.key === '?') {
      this.helpToggle();
    } else if (evt.key === 's') {
      this.settingsToggle();
    } else if (evt.key === 'c') {
      this.collectionsToggle();
    } else if (evt.key === 'h') {
      this.isUserActive = false;
    } else if (evt.key === 'r') {
      this.reset();
      this.updatePageTitle();
    } else if (this.hasContent && isNumber && !evt.metaKey && !evt.shiftKey) {
      this.$emit('selectgroup', number - 1);
    }
  }

  helpToggle(): void {
    this.$emit('helptoggle');
  }

  settingsToggle(): void {
    this.$emit('settingstoggle');
  }

  collectionsToggle(): void {
    this.$emit('collectionstoggle');
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

  handleLayoutChange(isCenteredLayout: boolean): void {
    this.isCenteredImageMode = isCenteredLayout;
  }

  handleRetinaChange(isHalfSize: boolean): void {
    this.isScaledImageMode = isHalfSize;
  }
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
