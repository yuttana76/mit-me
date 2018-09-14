
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Fund} from './fund.model';

@Injectable({ providedIn: 'root' })
export class FundService {

  private funds: Fund[] = [];
  private fundUpdated = new Subject<Fund[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getFunds(rowPerPage: number, currentPage: number) {

    console.log(' Fund service get:' + rowPerPage);

    const queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;
    console.log('queryParams>' + queryParams);

    this.http.get<{ message: string, result: any }>('http://localhost:3000/api/connexFund')
    .pipe(map((fundtData) => {
        return fundtData.result.map(fund => {
            return {
              fundCode: fund.Fund_Code,
              thaiName: fund.Thai_Name,
              engName: fund.Eng_Name,
            };
        });
    }))
    .subscribe((transformedFunds) => {
        this.funds = transformedFunds;
        this.fundUpdated.next([...this.funds]);
    });
  }

  getFundUpdateListener() {
    return this.fundUpdated.asObservable();
  }

}
