import { Injectable } from '../../../../../node_modules/@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Subject, of, Observable } from 'rxjs';
    import { map, mergeMap } from 'rxjs/operators';
    import { Router } from '@angular/router';
    import { environment } from '../../../../environments/environment';

    const BACKEND_URL = environment.apiURL + '/online/';

    @Injectable({ providedIn: 'root' })
    export class OnlineProcessService {

      constructor(private http: HttpClient , private router: Router) { }

      saveAccount(fcIndCustomer){
        console.log('saveAccount()' + JSON.stringify(fcIndCustomer));

        const postData ={
          "fcIndCustomer":fcIndCustomer,
        };

        return this.http.post<{data: any}>(BACKEND_URL + '/fcOpenAccount',postData);
      }
    }
