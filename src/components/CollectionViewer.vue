<template>
  <div class="collection-viewer">
    <image-viewer ref="imageViewer"
      v-for="(collection, i) in $store.state.collections"
      :key="collection.id"
      :class="{ hidden: i !== selectedIndex }"
      :collection-index="i"
      :scale-images="scaleImages"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Collection from '../Collection';
import DisplayImage from '../DisplayImage';
import ImageViewer from './ImageViewer.vue';

@Component({
  props: {
    scaleImages: Boolean,
  },
})
export default class CollectionViewer extends Vue {
  scaleImages: boolean;

  get selectedIndex(): number {
    return this.$store.state.selectedCollectionIndex;
  }

  setSelectedGroup(index: number): void {
    this.$store.commit('setSelectedGroup', index);
    // Focus on the image viewer element so the bound keyboard events work.
    const imageViewer = this.getImageViewer(index);
    requestAnimationFrame(() => {
      imageViewer.$el.focus();
    });
  }

  getImageViewer(index: number): ImageViewer {
    return (<any>this.$refs.imageViewer)[index] as ImageViewer;
  }

  mounted(): void {
    this.$parent.$on('selectgroup', this.setSelectedGroup);
  }

  created(): void {
    this.$store.commit('setSelectedGroup', 0);
  }
}
</script>

<style>

</style>


