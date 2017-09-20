<template>
  <div class="collection-viewer">
    <image-viewer ref="imageViewer"
      v-for="(collection, i) in collections"
      :key="collection.id"
      :class="{ hidden: i !== selectedIndex }"
      :images="collection.images"
      :scale-images="scaleImages"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Collection from '../Collection';
import DisplayImage from '../DisplayImage';
import bus from '../Events';
import ImageViewer from './ImageViewer.vue';

@Component({
  props: {
    collections: Array,
    scaleImages: Boolean,
  },
})
export default class CollectionViewer extends Vue {
  collections: Collection[];
  scaleImages: boolean;
  selectedIndex: number = -1;

  setSelectedGroup(index: number): void {
    if (index > -1 && index < this.collections.length) {
      this.selectedIndex = index;
      bus.$emit('collectionchanged');

      // Focus on the image viewer element so the bound keyboard events work.
      const imageViewer = this.getImageViewer(index);
      requestAnimationFrame(() => {
        imageViewer.$el.focus();
      });
    }
  }

  getImageViewer(index: number): ImageViewer {
    return (<any>this.$refs.imageViewer)[index] as ImageViewer;
  }

  mounted(): void {
    this.$parent.$on('selectgroup', this.setSelectedGroup);
    bus.$on('getselectedcollection', (fn: (index: number) => void) => {
      fn(this.selectedIndex);
    });

    bus.$on('getselectedimages', (fn: (indices: number[]) => void) => {
      const viewers = (this.$refs.imageViewer as ImageViewer[]);
      const indices = viewers.map((imageViewer: ImageViewer) => imageViewer.selectedIndex);
      fn(indices);
    });

    bus.$on('setselectedcollection', ({ collection, image }: { collection: number, image: number }) => {
      this.getImageViewer(collection).setSelectedIndex(image);
      this.setSelectedGroup(collection);
    });
  }

  beforeDestroy(): void {
    bus.$off('getselectedcollection');
  }

  created(): void {
    this.selectedIndex = 0;
  }
}
</script>

<style>

</style>


