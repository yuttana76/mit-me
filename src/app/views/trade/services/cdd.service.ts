import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { CDDModel } from "../model/cdd.model";

const BACKEND_URL = environment.apiURL + '/cdd';

@Injectable({ providedIn: 'root' })
export class CddService {

  constructor(private http: HttpClient) {}

  getCustCDDInfo(id: string){
      return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/cddInfo/' + id)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {
            // console.log(` Service getCustCDDInfo() >> ${JSON.stringify(data)}`);
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

    saveCustCDDInfo(ActionBy:string,custCode: string, cdd: CDDModel) {
    console.log('Service  saveCustCDDInfo() !');

    console.log('1 DOB>>' + cdd.dob );
    console.log('2 DOB>>' + new Date(cdd.dob) );
    let newDate = new Date(cdd.dob)

    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear()    ;
    let _DOB = year+"-"+month+"-"+day;
    console.log('cdd.dob >>' + cdd.dob);

    const data = {
      actionBy: ActionBy,
      custCode: custCode,
      pid: cdd.pid,
      title: cdd.title,
      firstName: cdd.firstName,
      lastName: cdd.lastName,
      dob: _DOB,
      mobile: cdd.mobile,
      email: cdd.email,
      occupation: cdd.occupation,
      position: cdd.position,
      typeBusiness: cdd.typeBusiness,
      incomeLevel: cdd.incomeLevel,
      incomeSource: cdd.incomeSource
      };
    return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/cddInfo', data);
  }


}

function convert(str) {
  var date = new Date(str),
      mnth = ("0" + (date.getMonth()+1)).slice(-2),
      day  = ("0" + date.getDate()).slice(-2);
  return [ date.getFullYear(), mnth, day ].join("-");
}



