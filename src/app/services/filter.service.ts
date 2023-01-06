import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Filter } from "../models/filter.model";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  public filterSubject = new Subject<Filter>();
}
