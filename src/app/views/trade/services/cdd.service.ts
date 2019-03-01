import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { CDDModel } from "../model/cdd.model";
import { AddrCustModel } from "../model/addrCust.model";

const BACKEND_URL = environment.apiURL + '/cdd';

@Injectable({ providedIn: 'root' })
export class CddService {

  constructor(private http: HttpClient) {}

  getCustCDDInfo(custCode: string){
      return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/cddInfo/' + custCode)
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
              incomeSource: data.Income_Source_Code,
              workPlace: data.workPlace
            };
          });
        })
      );
    }

    saveCustCDDInfo(ActionBy:string,custCode: string, cdd: CDDModel) {
    // console.log('Service  saveCustCDDInfo() !');

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
      incomeSource: cdd.incomeSource,
      workPlace: cdd.workPlace
      };
    return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/cddInfo', data);
  }


  getCustCDDAddr(custCode: string){
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/cddAddr/' + custCode)
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          console.log(` Service getCustCDDInfo() >> ${JSON.stringify(data)}`);
          return {
            pid: data.Cust_Code,
          };
        });
      })
    );
  }


  saveCustCDDAddr(ActionBy:string,custCode: string, _addr: AddrCustModel) {

    console.log('Service  saveCustCDDAddr() >> ' + JSON.stringify(_addr));

    const data = {
      actionBy: ActionBy,
      custCode: custCode,
      Addr_Seq: _addr.Addr_Seq,
      Addr_No: _addr.Addr_No,
      Moo: _addr.Moo,
      Place: _addr.Place,
      Floor: _addr.Floor,
      Soi: _addr.Soi,
      Road: _addr.Road,
      Tambon_Id: _addr.Tambon_Id,
      Amphur_Id: _addr.Amphur_Id,
      Province_Id: _addr.Province_Id,
      Country_Id: _addr.Country_Id,
      Zip_Code: _addr.Zip_Code,
      Tel: _addr.Tel,
      Fax: _addr.Fax
      };
    return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/cddAddr', data);
  }

}

// function convert(str) {
//   var date = new Date(str),
//       mnth = ("0" + (date.getMonth()+1)).slice(-2),
//       day  = ("0" + date.getDate()).slice(-2);
//   return [ date.getFullYear(), mnth, day ].join("-");
// }



