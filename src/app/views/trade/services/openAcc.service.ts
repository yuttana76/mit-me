import { Injectable } from '../../../../../node_modules/@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Subject, of, Observable, forkJoin } from 'rxjs';
    import { map, mergeMap } from 'rxjs/operators';
    import { Router } from '@angular/router';
    import { environment } from '../../../../environments/environment';

    const BACKEND_ONLINE_URL = environment.apiURL + '/online/';
    const BACKEND_ACCOUNT_URL = environment.apiURL + '/account';
    const BACKEND_MASTER_URL = environment.apiURL + '/master';
    const BACKEND_URL_OTP = environment.apiURL + '/otp';

    @Injectable({ providedIn: 'root' })
    export class OpenAccService {

      constructor(private http: HttpClient , private router: Router) { }


      getMasterData(invParam): Observable<any> {

      let observableBatch = [];

      observableBatch.push(this.http.get<{result: any }>(BACKEND_MASTER_URL + '/FCoccupation'));
      observableBatch.push(this.http.get<{result: any }>(BACKEND_MASTER_URL + '/FCincomeSource'));
      observableBatch.push(this.http.get<{result: any }>(BACKEND_MASTER_URL + '/FCbusinessType'));
      observableBatch.push(this.http.get<{result: any }>(BACKEND_MASTER_URL + '/FCincomeLevel'));
      observableBatch.push(this.http.get<{result: any }>(BACKEND_MASTER_URL + '/codeLookup?keyname='+invParam));

      return forkJoin(observableBatch);

    }


    openAccount(fcIndCustomer, actionBy) {
      const data = {
        'fcIndCustomer': JSON.stringify(fcIndCustomer),
        'actionBy': actionBy,
        };

      return this.http.post<{ message: string, data: any }>(BACKEND_ACCOUNT_URL+'/openAccount', data);
    }

    verifyRequestOTP(_pid: string,_mobile: string): Observable<any> {

      const data = {
        'pid': _pid.trim(),
        'm': _mobile.trim()
      };
      return this.http.post<{ message: string, result: string }>(BACKEND_URL_OTP + '/getOTPtokenSMS', data);
    }


  verifyConfirmOTP(_pid: string, token: string,mobile:string): Observable<any> {
    const data = {
      'pid': _pid.trim(),
      'token': token.trim(),
      'mobile': mobile,
      'device': 'Mobile',
      'module': 'MIT-OpenAccount',
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_OTP + '/verityOTPtoken', data);
  }


    }
