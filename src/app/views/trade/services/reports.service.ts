
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
// import { Subject, Observable } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Fund} from '../model/fund.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL ;

@Injectable({ providedIn: 'root' })
export class ReportsService {

  constructor(private http: HttpClient) {}

  getSummaryReport(startDate: string, endDate: string, amcCode: string, fundCode: string) {

    const queryParams = `?startDate=${startDate}&endDate=${endDate}&amcCode=${amcCode}&fundCode=${fundCode}`;
    console.log('getSummaryReport()>>' + BACKEND_URL + '/rep/summary' + queryParams );
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(BACKEND_URL + '/rep/summary' + queryParams, { headers: headers, responseType: 'blob' });
  }

}
