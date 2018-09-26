
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Customer} from '../model/customer.model';
import { environment } from '../../../../environments/environment';
import { CustomerCond } from '../model/customerCond.model';
import { CustAddress } from '../model/custAddress.model';

const BACKEND_URL = environment.apiURL + '/customer/';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [];
  private customerUpdated = new Subject<Customer[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getCustomers(rowPerPage: number, currentPage: number, conditionObj: CustomerCond) {

    // console.log(' Fund service get:' + rowPerPage + ' ;currentPage=' + currentPage + ' ;CustomerCond=' + JSON.stringify(conditionObj));
    // const queryParams = `?pagesize=${rowPerPage}&page=${currentPage}&cust_id=${conditionObj.custId}&cust_type=${conditionObj.custType}`;
    let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;


    console.log('isNaN>>', isNaN(Number(conditionObj.custId)));

    var splitted = conditionObj.custId.split("-");

    if ( isNaN(Number(splitted[0])) === true) {
      queryParams += `&cust_name=${conditionObj.custId}`;
    } else {
      queryParams += `&cust_id=${conditionObj.custId}`;
    }

    console.log('queryParams>' + queryParams);

    this.http.get<{ message: string, result: any }>(BACKEND_URL + queryParams)
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

  createCustomer(customer: Customer, ceAddress: CustAddress, maAddress: CustAddress){
    console.log('Service   createCustomer() !');
    const data = {
      'customer': JSON.stringify(customer),
      'ceAddress': JSON.stringify(ceAddress),
      'maAddress': JSON.stringify(maAddress)
      };

    this.http
        .post<{ message: string, data: any }>(BACKEND_URL, data)
        .subscribe(responseData => {
          console.log('Service  Result createCustomer()>>', JSON.stringify(responseData));
            this.router.navigate(['/']);
        });
  }

  updateCustomer(customer: Customer, ceAddress: CustAddress, maAddress: CustAddress){
    console.log('updateCustomer !');
  }

}

