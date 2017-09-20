<template>
  <div class="collections-menu floating-button">
    <button class="collections-menu__toggle fade-when-inactive" data-odo-dialog-open="collections-dialog" title="open collections menu">
      <svg viewBox="0 0 14 16" aria-hidden="true">
        <path d="M13 3H7c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 8H8V5h4v6zM4 4h1v1H4v6h1v1H4c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1zM1 5h1v1H1v4h1v1H1c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1z" fill-rule="evenodd"/>
      </svg>
    </button>
    <div class="odo-dialog collections-dialog" id="collections-dialog" role="dialog" aria-labelledby="collections-dialog-title" aria-hidden="true">
      <div class="odo-dialog__content container" role="document">
        <div class="odo-dialog__inner">
          <button type="button" class="odo-dialog__close" data-odo-dialog-close aria-label="Close this dialog window">&times;</button>
          <div class="dialog-header">
            <h2 class="type-header-2 marginless" id="collections-dialog-title">Collections</h2>
          </div>
          <div class="dialog-content">
            <div v-for="(collection, i) in collections" class="row"
              :key="collection.id">
              <h3 class="col-12@sm type-header-3 collections-menu__title">
                <span>Collection {{ i + 1 }}</span>
                <small v-show="i === selectedCollectionIndex">[current]</small>
              </h3>
              <div class="col-1@sm" v-for="(image, j) in collection.images" :key="image.id">
                <button class="collections-menu__thumb-btn" @click="select(i, j)">
                  <img class="collections-menu__thumb"
                    :class="{ 'collections-menu__thumb--selected': j === selectedImages[i] }"
                    :src="image.src"
                    :alt="image.filename"
                    :title="image.filename" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Dialog from '../Dialog';
import Collection from '../Collection';
import bus from '../Events';

@Component({
  props: {
    collections: {
      type: Array,
      required: true,
    },
  },
})
export default class CollectionsMenu extends Vue {
  collections: Collection[];
  dialog: Dialog;
  selectedCollectionIndex: number = 0;
  selectedImages: number[] = [];

  getSelectedCollection(): number {
    let i: number;
    bus.$emit('getselectedcollection', (index: number) => {
      i = index;
    });

    return i;
  }

  getSelectedImages(): number[] {
    let i: number[];
    bus.$emit('getselectedimages', (indices: number[]) => {
      i = indices;
    });

    return i;
  }

  toggle(): void {
    if (this.dialog.isOpen) {
      this.dialog.close();
    } else {
      this.dialog.open();
    }
  }

  update(): void {
    this.selectedCollectionIndex = this.getSelectedCollection();
    this.selectedImages = this.getSelectedImages();
  }

  select(collectionIndex: number, imageIndex: number): void {
    bus.$emit('setselectedcollection', {
      collection: collectionIndex,
      image: imageIndex,
    });

    this.dialog.close();
  }

  mounted(): void {
    this.$parent.$on('collectionstoggle', this.toggle);
    bus.$on('collectionchanged', this.update)
    this.dialog = new Dialog(document.getElementById('collections-dialog'));

    this.$watch('collections', (newCollections: Collection[], oldCollections: Collection[]) => {
      this.update();
    });

    this.update();
  }

  beforeDestroy(): void {
    this.dialog.dispose();
    this.dialog = null;
    this.$off('collectionchanged', this.update);
  }
}
</script>


<style>
.collections-menu {
  right: 90px;
}

.collections-menu__title {
  margin-top: 0.5em;
}

.dialog-content > :first-child .collections-menu__title {
  margin-top: 0;
}

.collections-menu__thumb-btn {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.collections-menu__thumb--selected {
  border: 4px solid mediumseagreen;
}
</style>

