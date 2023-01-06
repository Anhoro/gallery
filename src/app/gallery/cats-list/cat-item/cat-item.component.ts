import { Component, Input, OnInit } from '@angular/core';
import { GalleryItemBackend } from 'src/app/models/gallery-item-backend.model';

@Component({
  selector: '[app-cat-item]',
  templateUrl: './cat-item.component.html',
  styleUrls: ['./cat-item.component.scss']
})
export class CatItemComponent implements OnInit {
  @Input() li_id: number = 1;
  @Input() galleryItem!: GalleryItemBackend;

  constructor() { }

  ngOnInit(): void {
  }

  /* if url does not exist, replace with a default image */
  onHandleMissingImage(event: Event) {
    (event.target as HTMLImageElement).src = '../../../../assets/images/gallery-cat-404.jpg';

    //to eliminate it from sliding up or left
    this.galleryItem.width = 200;
    this.galleryItem.height = 200;
  }

  /* detect if aspect ratio is, for example 9:16 */
  isVertical() {
    return this.galleryItem.width >= this.galleryItem.height ? false : true;
  }

  /* detect if aspect ratio is, for example 16:9 */
  isHorizontal() {
    return this.galleryItem.width <= this.galleryItem.height ? false : true;
  }

  /* input: 10, 20; output: 10/20 */
  calcRelativeDiff(value1: number, value2: number) {
    const min = value1 < value2 ? value1 : value2;
    const max = value1 > value2 ? value1 : value2;
    const relativeDiff = min / max;

    return relativeDiff;
  }

  /* if image is quite "squarish", do not shift it, and squize it instead */
  getClassByAspectRatio() {
    const relativeDiff = this.calcRelativeDiff(this.galleryItem.width, this.galleryItem.height);

    //squize
    if (relativeDiff > 0.76) {
      return {};
    }

    //shift or do not change (for square images)
    return {
      'image__horizontal': this.isHorizontal(),
      'image__vertical': this.isVertical()
    }
  }
}
