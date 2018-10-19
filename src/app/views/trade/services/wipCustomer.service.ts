
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Customer} from '../model/customer.model';
import { environment } from '../../../../environments/environment';
import { CustomerCond } from '../model/customerCond.model';
import { CustAddress } from '../model/custAddress.model';

const BACKEND_URL = environment.apiURL + '/wipcustomer/';

@Injectable({ providedIn: 'root' })
export class WipCustomerService {

  constructor(private http: HttpClient , private router: Router) { }


  createCustomer(customer: Customer,
    ceAddress: CustAddress,
    ofAddress: CustAddress,
    maAddress: CustAddress,
    mode: string): Observable<any> {
    // console.log('Service WIP  createCustomer() !');
    const data = {
      'customer': JSON.stringify(customer),
      'ceAddress': JSON.stringify(ceAddress),
      'ofAddress': JSON.stringify(ofAddress),
      'maAddress': JSON.stringify(maAddress),
      'mode': mode
      };

    return this.http
        .post<{ message: string, result: string }>(BACKEND_URL, data);
  }

  restoreWIPCustomer(wfRef: String, updateBy: String): Observable<any> {
    return this.http
        .put(BACKEND_URL + 'restore/' + wfRef, {UpdateBy: updateBy});
  }

  getWipCustomer(id: string) {
    return this.http.get<{result: any }>(BACKEND_URL + id )
    .pipe(map( fundtData => {
      return fundtData.result.map(data => {
        return {
            Cust_Code: data.Cust_Code,
            Card_Type: data.Card_Type,
            Group_Code: data.Group_Code,
            Title_Name_T: data.Title_Name_T,
            First_Name_T: data.First_Name_T,
            Last_Name_T: data.Last_Name_T,
            Title_Name_E: data.Title_Name_E,
            First_Name_E: data.First_Name_E,
            Last_Name_E: data.Last_Name_E,
            Birth_Day: data.Birth_Day,
            Nation_Code: data.Nation_Code,
            Sex: data.Sex,
            Tax_No: data.Tax_No,
            Mobile: data.Mobile,
            Email: data.Email,
            MktId: data.MktId,
            Create_By: data.Create_By,
            Create_Date: data.Create_Date,
            Modify_By: data.Modify_By,
            Modify_Date: data.Modify_Date,
            IT_SentRepByEmail: data.IT_SentRepByEmail
        };
      });
    }));
  }

  getWipAddress(id: string) {
    return this.http.get<{result: any }>(BACKEND_URL + 'wipAddress/' +  id )
    .pipe(map( fundtData => {
      return fundtData.result.map(data => {
        return {
            // Cust_Code: data.Cust_Code,

            Cust_Code: data.Cust_Code,
            Addr_Seq: data.Addr_Seq,
            Addr_No: data.Addr_No,
            Place: data.Place,
            Road: data.Road,
            Tambon_Id: data.Tambon_Id,
            Amphur_Id: data.Amphur_Id,
            Province_Id: data.Province_Id,
            Country_Id: data.Country_Id,
            Zip_Code: data.Zip_Code,
            Print_Address: data.Print_Address,
            Tel: data.Tel,
            Fax: data.Fax
        };
      });
    }));
  }
}
