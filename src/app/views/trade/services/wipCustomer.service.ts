
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


  createCustomer(customer: Customer, ceAddress: CustAddress, ofAddress: CustAddress, maAddress: CustAddress): Observable<any> {
    // console.log('Service WIP  createCustomer() !');
    const data = {
      'customer': JSON.stringify(customer),
      'ceAddress': JSON.stringify(ceAddress),
      'ofAddress': JSON.stringify(ofAddress),
      'maAddress': JSON.stringify(maAddress)
      };

    return this.http
        .post<{ message: string, result: string }>(BACKEND_URL, data);
  }

  restoreWIPCustomer(wfRef: String, updateBy: String): Observable<any> {

    console.log('Service WIP  restoreWIPCustomer() wfRef>' + wfRef + ' ;updateBy>' + updateBy );
    return this.http
        .put(BACKEND_URL + wfRef, {UpdateBy: updateBy});
  }


}
