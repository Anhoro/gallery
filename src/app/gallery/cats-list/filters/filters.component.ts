import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs';

import { Breed } from 'src/app/models/breed.model';
import { Filter } from 'src/app/models/filter.model';
import { BreedService } from 'src/app/services/breed.service';
import { FilterService } from 'src/app/services/filter.service';
import { environment } from 'src/environments/environment.prod';
import { amountItemsList } from './amount-items.config';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  filtersForm!: FormGroup;
  errorMessage = '';
  breeds!: Array<Breed>;  //fetched from backend
  filters: {breeds: Array<boolean>} = {breeds: []};
  isCheckboxesAll = false;
  amountItemsList = amountItemsList;
  preparedBreeds: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private breedService: BreedService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.formFiltersInit();
    this.filterService.filterSubject.next(this.preparedFilters());

    //get list of breeds
    this.breedService.getBreeds()
      .pipe(
        take(1)
      )
      .subscribe({
        next: breeds => {
          if (breeds !== null) {
            this.breeds = breeds;
            this.addBreedCheckboxes(false);
            this.errorMessage = '';
          }
        },
        error: err => {
          this.errorMessage = err.message;
        }
      })
  }

  /* used in a template */
  get breedsFormArray() {
    return (this.filtersForm.get('breeds') as FormArray).controls;
  }

  /* dynamically create array of FormControls for each breed from back-end
     1) input: true output: url is comprises all breed id separated by comma
     2) input: false output: url does not contain info about breed,
        however result is the same as in 1) because of user experience */
  private addBreedCheckboxes(isChecked: boolean) {
    this.breeds.forEach((item) => {
      (this.filtersForm.get('breeds') as FormArray).push(new FormControl(isChecked))
    });
  }

  /* initialize form  */
  formFiltersInit() {
    this.filtersForm = this.formBuilder.group({
      breeds: this.formBuilder.array([]),
      itemsAmount: new FormControl(environment.GALLERY_ITEMS_AMOUNT)
    });
  }

  /* called when a single checkbox is pressed */
  onToggleCheckbox() {
    this.updateFilteredGalleryItems();
    this.filterService.filterSubject.next(this.preparedFilters());
  }

  /* push breed id (from checked checkbox) into an array used in filterSubject */
  private updateFilteredGalleryItems() {
    const breeds = (this.filtersForm.get('breeds') as FormArray).controls;
    this.preparedBreeds = [];

    this.breeds.forEach((breed, i) => {
      if (breeds[i].value) {
        this.preparedBreeds.push(this.breeds[i].id)
      }
    });
  }

  /* called when the button is pressed in a template*/
  onToggleCheckboxesAll() {
    this.isCheckboxesAll = !this.isCheckboxesAll;

    //refresh checkboxes
    (<FormArray>this.filtersForm.get('breeds')).clear();
    this.addBreedCheckboxes(this.isCheckboxesAll);
    const breeds = (this.filtersForm.get('breeds') as FormArray).controls;

    //refresh breeds array used in filters subject
    this.preparedBreeds = [];
    breeds.forEach((breed, i) => {
      if (breeds[i].value) {
        this.preparedBreeds.push(this.breeds[i].id)
      }
    });

    this.filterService.filterSubject.next(this.preparedFilters());
  }

  /* called when an item is selected in a template */
  onSelectOption() {
    this.filterService.filterSubject.next(this.preparedFilters());
  }

  /* prepare filters object out of form */
  preparedFilters() {
    const amountItems = this.filtersForm.get('itemsAmount')?.value || environment.GALLERY_ITEMS_AMOUNT;
    const breeds = this.preparedBreeds;

    return new Filter(amountItems, breeds);
  }

  onSubmit() { }
}
