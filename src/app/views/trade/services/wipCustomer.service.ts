
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
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

  createCustomer(customer: Customer, ceAddress: CustAddress, ofAddress: CustAddress, maAddress: CustAddress) {
    console.log('Service WIP  createCustomer() !');
    const data = {
      'customer': JSON.stringify(customer),
      'ceAddress': JSON.stringify(ceAddress),
      'ofAddress': JSON.stringify(ofAddress),
      'maAddress': JSON.stringify(maAddress)
      };

    this.http
        .post<{ message: string, data: any }>(BACKEND_URL, data)
        .subscribe(responseData => {
          console.log('Result>>', JSON.stringify(responseData));
            this.router.navigate(['/']);
        });
  }
}
