import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Subject, throwError } from "rxjs";

import { environment } from "src/environments/environment";
import { GalleryItemBackend } from "../models/gallery-item-backend.model";
import { Filter } from "../models/filter.model";
import { GalleryItem } from "../models/gallery-item.model";

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(
    private http: HttpClient
  ) { }

  /* get cats from a back-end */
  fetchCats(filters?: Filter) {
    const url = this.preparedGalleryUrl(filters);

    return this.http.get<GalleryItemBackend[]>(url)
      .pipe(
        catchError(this.handleError),
        map(catsBackend => {
          const cats: GalleryItemBackend[] = catsBackend.map((catBackend) => {
            const cat = new GalleryItem(
              catBackend.id,
              catBackend.url,
              catBackend.width,
              catBackend.height,
              catBackend.breeds
            );

            return cat;
          });

          return cats;
        })
      )
  }

  /* build url link for fetching data */
  preparedGalleryUrl(filters: Filter | undefined): string {
    let url = environment.API_URL + 'images/search';
    let limit = '';
    let breeds = '';

    if (filters) {
      limit = '?limit=' + filters.amountItems;

      if (filters.breeds.length !== 0) {
        breeds = '&breed_ids=' + filters.breeds.join(',');
      }

      url += limit + breeds;
    }

    return url;
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching data.';

    return throwError(() => new Error(errorMessage));
  }
}
