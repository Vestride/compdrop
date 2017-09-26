import Collection from './Collection';

export default class State {
  collections: Collection[] = [];
  selectedCollectionIndex: number = 0;
  selectedImages: number[] = [];
};
