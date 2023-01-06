import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //temp setup to get access to TheCatAPI with each request
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': environment.API_KEY
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict)
    };

    const modifiedReq = req.clone(requestOptions);

    return next.handle(modifiedReq);
  }
}
