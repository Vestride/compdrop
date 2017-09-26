import Vue from 'vue';
import Vuex from 'vuex';
import State from './state';
import Collection from './Collection';
import DisplayImage from './DisplayImage';

Vue.use(Vuex);

function maybePluralize(count: number, noun: string, suffix: string = 's') {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

export default new Vuex.Store({
  state: new State(),
  mutations: {
    addCollection(state: State, collection: Collection): void {
      state.collections.push(collection);
      Vue.set(state.selectedImages, state.collections.length - 1, 0);
    },
    updateCollectionImages(state: State, payload: { index: number, images: DisplayImage[] }): void {
      Vue.set(state.collections, payload.index, {
        id: state.collections[payload.index].id,
        name: state.collections[payload.index].name,
        images: state.collections[payload.index].images.concat(payload.images),
      });
    },
    emptyCollections(state: State): void {
      state.collections = [];
      state.selectedImages = [];
      state.selectedCollectionIndex = 0;
    },
    setSelectedGroup(state: State, index: number): void {
      if (index > -1 && index < state.collections.length) {
        state.selectedCollectionIndex = index;
      }
    },
    selectImage(state: State, payload: { index: number, collectionIndex: number }): void {
      Vue.set(state.selectedImages, payload.collectionIndex, payload.index);
      state.selectedCollectionIndex = payload.collectionIndex;
    }
  },
  getters: {
    totalCollections(state: State): number {
      return state.collections.length;
    },
    pageTitle(state: State): string {
      if (state.collections.length > 1) {
        const totalImages = state.collections.reduce((total, collection) => total + collection.images.length, 0);
        return `${maybePluralize(state.collections.length, 'collection')} – ${maybePluralize(totalImages, 'image')} – compdrop`;
      }

      if (state.collections.length > 0) {
        return `${maybePluralize(state.collections[0].images.length, 'image')} – compdrop`;
      }

      return 'compdrop';
    }
  }
});

