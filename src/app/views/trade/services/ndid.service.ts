
    import { Injectable } from '../../../../../node_modules/@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Subject, of, Observable } from 'rxjs';
    import { map, mergeMap } from 'rxjs/operators';
    import { Router } from '@angular/router';
    import { environment } from '../../../../environments/environment';

    const BACKEND_URL = environment.apiURL + '/proxy/';

    @Injectable({ providedIn: 'root' })
    export class NDIDService {

      constructor(private http: HttpClient , private router: Router) { }

      // getInspByGroupId(key) {
      //   let queryParams = `?key=${key}`;
      //   return this.http.get<{result: any }>(BACKEND_URL+"/inspByGroupId"+  queryParams)
      //   .pipe(map( _data => {
      //     return _data.result.map(data => {
      //       return data
      //     });
      //   }));
      // }

      getToken(){
        const postData = new FormData();
        return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/authtoken',postData);
      }

      getIdp(token,min_ial,min_aal,namespace,identifier){

        const postData ={
          "token":token,
          "min_ial":min_ial,
          "min_aal":min_aal,
          "namespace":namespace,
          "identifier":identifier
        };

        return this.http.post<{data: any}>(BACKEND_URL + '/providers',postData);
      }


    }
