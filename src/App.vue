<template>
  <div id="app" :class="{
    'layout-centered': $store.state.settings.isCenteredImageMode,
    'user-inactive': !isUserActive,
    'is-loading': isLoading,
  }"
    tabindex="-1"
    @mousemove="handleUserAction"
    @mousedown="handleUserAction">
    <help-menu />
    <settings-menu />
    <collections-menu v-show="hasContent" />
    <main>
      <welcome-screen v-show="!hasContent" :can-drop="canDrop" @fileschosen="_handleFilesChosen" />
      <loading-screen v-show="isLoading" />
      <collection-viewer v-show="hasContent" />
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

@Component
export default class App extends Vue {
  hasContent: boolean = false;
  canDrop: boolean = false;
  isLoading: boolean = false;

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

    this.isLoading = true;
    const start = Date.now();

    const done = () => {
      this.isLoading = false;
      requestAnimationFrame(() => {
        console.log(`Drop took ${Date.now() - start} milliseconds`)
      });
    };

    // Safari and IE don't support `items` property.
    if (evt.dataTransfer.items) {
      readDroppedItems(evt.dataTransfer.items).then((collections: FileCollection[]) => {
        Promise.all(collections.map(this._addFileList)).then(done);
      });
    } else {
      const fileCollection: FileCollection = {
        name: '',
        files: Array.from(evt.dataTransfer.files),
      };
      this._addFileList(fileCollection).then(done);
    }
  }

  _handleFilesChosen(files: File[]): void {
    this._addFileList({
      name: '',
      files: files,
    });
  }

  _addFileList(fileCollection: FileCollection): Promise<void> {
    // Filter out non-images and sort by file name.
    const files = fileCollection.files
      .filter(isImageFile)
      .sort((a: File, b: File): number => a.name.localeCompare(b.name));

    let promise;

    if (files.length > 0) {
      // Async load all files with a FileReader and update the images array when done.
      promise = this.renderFirstImageThenOthers(files, fileCollection.name);
    } else {
      promise = Promise.resolve();
    }

    // Hide drop messaging.
    this.canDrop = false;

    return promise;
  }

  async renderFirstImageThenOthers(files: File[], collectionName: string): Promise<void> {
    const collectionId = uniqueId();
    // Remove the first file from the array.
    const first = files.shift();

    // Read the file and update the images property so that Vue re-renders.
    // This intentionally blocks execution for reading the other files.
    const image = await this.getDisplayImage(first);
    const collectionIndex = this.$store.getters.totalCollections as number;
    this.$store.commit('addCollection', {
      id: collectionId,
      name: collectionName,
      images: [image],
    });

    // Set flag for whether there was content after the first display image has
    // been read.
    this.hasContent = this.$store.state.collections.length > 0 || files.length > 0;

    // Wait a frame, then start reading the remaining files.
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        Promise.all(this.getDisplayImages(files)).then((images) => {
          this.$store.commit('updateCollectionImages', {
            index: collectionIndex,
            images: images,
          });
          this.updatePageTitle();
          resolve();
        });
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

  updatePageTitle(): void {
    document.title = this.$store.getters.pageTitle as string;
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
    this.$store.commit('emptyCollections');
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
