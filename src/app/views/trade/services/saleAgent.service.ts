
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Sale } from '../model/sale.model';

const BACKEND_URL = environment.apiURL + '/saleAgent/';

@Injectable({ providedIn: 'root' })
export class SaleAgentService {
  private sales: Sale[] = [];
  private salesUpdated = new Subject<Sale[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getSales(rowPerPage: number, currentPage: number, User_Code: string) {

    let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;

    queryParams += `&User_Code=${User_Code}`;

    this.http.get<{ message: string, result: any }>(BACKEND_URL + queryParams)
    .pipe(map((resultData) => {
        return resultData.result.map(data => {
            return {
              Id: data.Id,
              Type: data.Type,
              License_Code: data.License_Code,
              Issue_Date: data.Issue_Date,
              User_Code: data.User_Code,
              Full_Name: data.Full_Name,
              Email: data.Email
            };
        });
    }))
    .subscribe((transformed) => {
        this.sales = transformed;
        this.salesUpdated.next([...this.sales]);
    });
  }

  getSalesUpdateListener() {
    return this.salesUpdated.asObservable();
  }

}

