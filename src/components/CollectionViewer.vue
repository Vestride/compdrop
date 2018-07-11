<template>
  <div class="collection-viewer">
    <image-viewer ref="imageViewer"
      v-for="(collection, i) in $store.state.collections"
      :key="collection.id"
      :class="{ hidden: i !== selectedIndex }"
      :collection-index="i"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Collection from '../Collection';
import DisplayImage from '../DisplayImage';
import ImageViewer from './ImageViewer.vue';

@Component
export default class CollectionViewer extends Vue {

  get selectedIndex(): number {
    return this.$store.state.selectedCollectionIndex;
  }

  public setSelectedGroup(index: number): void {
    this.$store.commit('setSelectedGroup', index);
    // Focus on the image viewer element so the bound keyboard events work.
    const imageViewer = this.getImageViewer(index);
    requestAnimationFrame(() => {
      imageViewer.$el.focus();
    });
  }

  public getImageViewer(index: number): ImageViewer {
    return (this.$refs.imageViewer as any)[index] as ImageViewer;
  }

  public mounted(): void {
    this.$parent.$on('selectgroup', this.setSelectedGroup);
  }

  public created(): void {
    this.$store.commit('setSelectedGroup', 0);
  }
}
</script>

<style>

</style>


