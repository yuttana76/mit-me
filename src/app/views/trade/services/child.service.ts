import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { PersonModel } from "../model/person.model";

const BACKEND_URL = environment.apiURL + '/child';

@Injectable({ providedIn: 'root' })
export class ChildService {

  constructor(private http: HttpClient) {}

  getChildByCust(custCode: string){
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/cust/' + custCode)
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {

          console.log( "getChildByCust()" + JSON.stringify(data));

          return {
            Cust_Code : data.Cust_Code,
            ChildIDType : data.ChildIDType,
            ChildPassportCountry : data.ChildPassportCountry,
            ChildCardNumber : data.ChildCardNumber,
            cardExpiryDate : data.cardExpiryDate,
            cardNotExt : data.cardNotExt,
            title : data.title,
            titleOther : data.titleOther,
            First_Name_T :data.First_Name_T,
            Last_Name_T : data.Last_Name_T,
            First_Name_E : data.First_Name_E,
            Last_Name_E : data.Last_Name_E,
            Birth_Day : data.Birth_Day,
            CreateBy : data.CreateBy,
            CreateDate : data.CreateDate
          };
        });
      })
    );
  }

  saveCustCDDInfo(ActionBy:string,custCode: string, child: PersonModel) {
    let newDate = new Date(child.dob)
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear()    ;
    let _DOB = year+"-"+month+"-"+day


    let _cardEXPDate = '';
    if('Y' != child.cardNotExp){
      newDate = new Date(child.cardExpDate)
      day = newDate.getDate();
      month = newDate.getMonth() + 1;
      year = newDate.getFullYear()    ;
     _cardEXPDate = year+"-"+month+"-"+day;
    }

    const data = {
      Cust_Code: custCode
      ,ChildIDType: child.cardType
      ,ChildPassportCountry: child.passportCountry
      ,ChildCardNumber: child.cardNumber
      ,cardExpiryDate: _cardEXPDate
      ,cardNotExt: child.cardNotExp
      ,title:child.title
      ,titleOther: child.titleOther
      ,First_Name_T: child.firstName
      ,Last_Name_T: child.lastName
      ,Birth_Day:_DOB
      ,CreateBy:ActionBy
    };

    return this.http.post<{ message: string, data: any }>(BACKEND_URL , data);
  }

}
