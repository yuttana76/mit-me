import { Injectable } from '../../../../../node_modules/@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Subject, of, Observable, forkJoin } from 'rxjs';
    import { map, mergeMap } from 'rxjs/operators';
    import { Router } from '@angular/router';
    import { environment } from '../../../../environments/environment';

    const BACKEND_ONLINE_URL = environment.apiURL + '/online/';
    const BACKEND_ACCOUNT_URL = environment.apiURL + '/account';
    const BACKEND_MASTER_URL = environment.apiURL + '/master';

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
    // console.log('Service   openAccount() !');
    const data = {
      'fcIndCustomer': JSON.stringify(fcIndCustomer),
      'actionBy': actionBy,
      };

    // console.log('DATA Submit>>' + JSON.stringify(data));

    return this.http.post<{ message: string, data: any }>(BACKEND_ACCOUNT_URL+'/openAccount', data);
  }


    }
