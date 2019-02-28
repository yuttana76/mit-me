import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiURL + '/customer';

@Injectable({ providedIn: 'root' })
export class CddService {

  constructor(private http: HttpClient) {}

  getCustCDDInfo(id: string){
      return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/cddInfo/' + id)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {
            console.log(` Service getCustCDDInfo() >> ${JSON.stringify(data)}`);
            return {
              pid: data.Cust_Code,
              title: data.Title_Name_T,
              firstName: data.First_Name_T,
              lastName: data.Last_Name_T,
              dob: data.Birth_Day,
              mobile: data.Mobile,
              email: data.Email,
              occupation: data.Occupation_Code,
              position: data.Position_Code,
              typeBusiness: data.BusinessType_Code,
              incomeLevel: data.Income_Code,
              incomeSource: data.Income_Source_Code

            };
          });
        })
      );
    }
}



