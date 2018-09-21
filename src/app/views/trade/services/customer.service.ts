
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Customer} from './customer.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL ;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [];
  private customerUpdated = new Subject<Customer[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getCustomers(rowPerPage: number, currentPage: number) {

    console.log(' Fund service get:' + rowPerPage);

    const queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;
    console.log('queryParams>' + queryParams);

    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/customer')
    .pipe(map((resultData) => {
        return resultData.result.map(data => {
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
    }))
    .subscribe((transformed) => {
        this.customers = transformed;
        this.customerUpdated.next([...this.customers]);
    });
  }

  getCustomerUpdateListener() {
    return this.customerUpdated.asObservable();
  }

}
