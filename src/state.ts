import Collection from './Collection';

export default class State {
  public collections: Collection[] = [];
  public selectedCollectionIndex: number = 0;
  public selectedImages: number[] = [];

  public settings: {
    isCenteredImageMode: boolean,
    isScaledImageMode: boolean,
  } = {
    isCenteredImageMode: true,
    isScaledImageMode: false,
  };
}
