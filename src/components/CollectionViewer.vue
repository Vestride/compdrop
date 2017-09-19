<template>
  <div class="collection-viewer">
    <image-viewer ref="imageViewer"
      v-for="(collection, i) in collections"
      :key="collection.id"
      :class="{ hidden: i !== selectedIndex }"
      :images="collection.images"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Collection from '../Collection';
import DisplayImage from '../DisplayImage';

@Component({
  props: {
    collections: Array,
  },
})
export default class CollectionViewer extends Vue {
  collections: Collection[];
  selectedIndex: number = -1;

  setSelectedGroup(index: number): void {
    if (index > -1 && index < this.collections.length) {
      console.log('set images to:', index);
      this.selectedIndex = index;

      // Focus on the image viewer element so the bound keyboard events work.
      const imageViewer: Vue = (<any>this.$refs.imageViewer)[index];
      requestAnimationFrame(() => {
        imageViewer.$el.focus();
      });
    }
  }

  mounted(): void {
    this.$parent.$on('selectgroup', this.setSelectedGroup);
  }

  created(): void {
    this.selectedIndex = 0;
  }
}
</script>

<style>

</style>


