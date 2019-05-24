
    import { Injectable } from '../../../../../node_modules/@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Subject } from 'rxjs';
    import { map } from 'rxjs/operators';
    import { Router } from '@angular/router';
    import {InspSearch} from '../model/inspSearch.model';
    import { environment } from '../../../../environments/environment';

    const BACKEND_URL = environment.apiURL + '/led/';

    @Injectable({ providedIn: 'root' })
    export class LEDService {

      constructor(private http: HttpClient , private router: Router) { }

      // https://localhost:3009/api/led/inspCust?pagesize=5&page=1&custId=&fromSource=&led_code=001&
      getInsp(rowPerPage: number, currentPage: number, cond: InspSearch) {

        let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;

        if(cond.custId){
          queryParams += `&custId=${cond.custId}`;
        }
        if(cond.firstName){
          queryParams += `&firstName=${cond.firstName}`;
        }
        if(cond.lastName){
          queryParams += `&lastName=${cond.lastName}`;
        }
        // if(cond.fromSource && (cond.fromSource != '0')){
        if(cond.fromSource){
          queryParams += `&fromSource=${cond.fromSource}`;
        }
        if(cond.led_code){
          queryParams += `&led_code=${cond.led_code}`;
        }

        return this.http.get<{result: any }>(BACKEND_URL+"/inspCust"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data
          });
        }));
      }

      getLEDMasterBykey(key) {
        let queryParams = `?key=${key}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/ledMasterBykey"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data
          });
        }));
      }

      getInspByKey(key) {
        let queryParams = `?key=${key}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/inspByKey"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data

          });
        }));
      }



      getInspByCustCode(key) {

        let queryParams = `?key=${key}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/inspByCustCode"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data

          });
        }));
      }

      getInspByGroupId(key) {
        let queryParams = `?key=${key}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/inspByGroupId"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data
          });
        }));
      }


      getInspHistory(key) {
        let queryParams = `?key=${key}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/inspHistory"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data
          });
        }));
      }

    getAddInspHistory(led_inspect_id,version,memo,actionBy){
        const data = {
          key:led_inspect_id,
          version:version,
          memo:memo,
          actionBy:actionBy
        }
        return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/inspHistory', data);
    }

      getInspResource(key) {
        let queryParams = `?key=${key}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/inspResource"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data
          });
        }));
      }

      getCntInspToday() {
        return this.http.get<{result: any }>(BACKEND_URL+"/cntInspToday")

      }

      getCntOnInspection() {
        return this.http.get<{result: any }>(BACKEND_URL+"/cntOnInspection")

      }

      getCntOnFreeze() {
        return this.http.get<{result: any }>(BACKEND_URL+"/cntOnFreeze")

      }

      // ******************************** END FILE
    }
