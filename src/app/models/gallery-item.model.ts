import { Breed } from "./breed.model";

export class GalleryItem {
  constructor(
    public id: string,
    public url: string,
    public width: number,
    public height: number,
    public breeds: Breed[]
  ) { }
}
