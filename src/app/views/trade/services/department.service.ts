import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiURL;

@Injectable({ providedIn: 'root' })
export class DepartmentService {

  constructor(private http: HttpClient) {}

  getDepartment() {
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/dep')
      .pipe(
        map(fundtData => {
          return fundtData.result.map(rtnData => {
            return {
              DEP_CODE: rtnData.DEP_CODE,
              NAME: rtnData.NAME
            };
          });
        })
      );
  }


}
