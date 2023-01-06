import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, of, tap, throwError } from "rxjs";

import { environment } from "src/environments/environment";
import { Breed } from "../models/breed.model";

@Injectable({
  providedIn: 'root'
})
export class BreedService {
  private breeds: Breed[] | null = null;

  constructor(
    private http: HttpClient
  ) { }

  getBreeds(): Observable<Breed[] | null> {
    if (this.breeds !== null) {
      return of(this.breeds);
    }

    return this.fetchBreeds();
  }

  /* get breeds list from a back-end */
  fetchBreeds() {
    const url = environment.API_URL + 'breeds';

    return this.http.get<Breed[]>(url)
      .pipe(
        catchError(this.handleError),
        map((breedsBackend) => {
          return breedsBackend.map((breed) => {
            return new Breed(breed.id, breed.name);
          })
        }),
        tap((breeds) => {
          this.breeds = breeds;
        })
      )
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching breeds. Breed filter is disabled.';

    return throwError(() => new Error(errorMessage));
  }
}
