
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


      getService(token){

        const postData ={
          "token":token,
        };

        return this.http.post<{data: any}>(BACKEND_URL + '/services',postData);
      }

      getAS(token,service_id){

        const postData ={
          "token":token,
          "service_id":service_id,
        };

        return this.http.post<{data: any}>(BACKEND_URL + '/as/service',postData);
      }

      ndidVeriReqData(token,namespace,identifier,request_message,idp_id_list,min_ial,min_aal,min_idp,callback_url,mode,service_id,as_id_list,min_as,request_params){
        const postData ={
            "token":token,
            "namespace": namespace,
            "identifier": identifier,
            "request_message": request_message,
            "idp_id_list": idp_id_list,
            "min_ial": min_ial,
            "min_aal": min_aal,
            "min_idp": min_idp,
            "callback_url": callback_url,
            "mode": mode,
            "data_request_list": [
              {
                "service_id": service_id,
                "as_id_list":as_id_list,
                "min_as": min_as,
                "request_params": request_params
              }
            ]
        };

        console.log("ndidVeriReqData()" + JSON.stringify(postData));

        return this.http.post<{data: any}>(BACKEND_URL + '/identity/verify-and-request-data',postData);
      }


      getVeriStatus(token,reference_id){

        const postData ={
          "token":token,
          "reference_id":reference_id,
        };

        return this.http.post<{data: any}>(BACKEND_URL + '/identity/verifyStatus',postData);
      }


      getDataVerify(token,reference_id){

        console.log(`getDataVerify() reference_id >> ${reference_id}  ` );

        const postData ={
          "token":token,
          "reference_id":reference_id,
        };

        return this.http.post<{data: any}>(BACKEND_URL + '/identity/verify-and-request-data/data',postData);
      }

    }
