
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Customer} from '../model/customer.model';
import { environment } from '../../../../environments/environment';
import { CustomerCond } from '../model/customerCond.model';
import { CustAddress } from '../model/custAddress.model';

const BACKEND_URL = environment.apiURL + '/custAddress/';

@Injectable({ providedIn: 'root' })
export class AddressService {

  constructor(private http: HttpClient , private router: Router) { }

  getAddress(id: string) {
    return this.http.get<{result: any }>(BACKEND_URL + id )
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
