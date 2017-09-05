<template>
  <div id="app">
    <main @dragover="handleDragHover" @dragleave="handleDragCancel" @drop="handleDrop">
      <welcome-screen v-if="!hasContent" :can-drop="canDrop"/>
      <image-viewer v-if="hasContent" :images="blobs"/>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  files: File[] = [];
  blobs: string[] = [];
  hasContent: boolean = false;
  canDrop: boolean = false;

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
      // Async load all files with a FileReader and update the blobs array when done.
      Promise.all(this.loadFiles(fileList)).then((results) => {
        // Fix? This won't sort newly added images by file name.
        this.blobs = this.blobs.concat(results);
      });

      // Update the files array.
      // TODO(glen): Any reason to keep this when i'm using the blobs array? Filenames?
      this.files = this.files.concat(fileList);

      // Set flag for whether there was content.
      this.hasContent = this.files.length > 0;
    }

    // Hide drop messaging.
    this.canDrop = false;
  }

  loadFiles(files: File[]): Promise<string>[] {
    return files.map((file: File) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file)
    }));
  }
};
</script>

<style>
html {
  box-sizing: border-box;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
  color: #404040;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.4;
}

main {
  display: block;
  overflow: hidden;
}
</style>
