import DisplayImage from './DisplayImage';

export default interface Collection {
  id: number;
  name?: string;
  images: DisplayImage[];
}
