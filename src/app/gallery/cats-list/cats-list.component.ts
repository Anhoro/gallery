import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { GalleryItemBackend } from 'src/app/models/gallery-item-backend.model';
import { FilterService } from 'src/app/services/filter.service';
import { GalleryService } from 'src/app/services/gallery.service';

@Component({
  selector: 'app-cats-list',
  templateUrl: './cats-list.component.html',
  styleUrls: ['./cats-list.component.scss']
})
export class CatsListComponent implements OnInit, OnDestroy {
  cats!: GalleryItemBackend[] | null;
  isFetching!: boolean;
  errorMessage = '';
  filterSubscription!: Subscription;
  gallerySubscription!: Subscription;

  constructor(
    private galleryService: GalleryService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.isFetching = true;

    //get filters
    this.filterService.filterSubject.subscribe(filters => {
      this.isFetching = true;

      //get gallery items with filters
      this.galleryService.fetchCats(filters)
        .subscribe({
          next: res => {
            this.isFetching = false;
            this.cats = res;
            this.errorMessage = '';
          },
          error: err => {
            this.isFetching = false;
            this.errorMessage = err.message;
          }});
    });
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.gallerySubscription.unsubscribe();
  }
}
