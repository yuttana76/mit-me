
    import { Injectable } from '../../../../../node_modules/@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Subject, of, Observable } from 'rxjs';
    import { map, mergeMap } from 'rxjs/operators';
    import { Router } from '@angular/router';
    import {InspSearch} from '../model/inspSearch.model';
    import { environment } from '../../../../environments/environment';
    import { MitLedInspCust } from '../model/mitLedInspCust.model';
    import { mitLedMasHis } from '../model/mitLedMasHis.model';
    import { ResultDialogComponent } from '../dialog/result-dialog/result-dialog.component';

    const BACKEND_URL = environment.apiURL + '/led/';

    @Injectable({ providedIn: 'root' })
    export class LEDService {

      constructor(private http: HttpClient , private router: Router) { }

      /**
       * Search Inspection
       * @param rowPerPage
       * @param currentPage
       * @param cond
       */
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
        // From dash board
        if(cond.chooseDate){
          queryParams += `&chooseDate=${cond.chooseDate}`;
        }
        if(cond.led_state){
          queryParams += `&led_state=${cond.led_state}`;
        }

        return this.http.get<{result: any }>(BACKEND_URL+"/inspCust"+  queryParams)
        .pipe(map( _data => {
          return _data.result.map(data => {
            return data
          });
        }));
      }

/**
 *
 * @param rowPerPage
 * @param currentPage
 * @param cond
 */
      getLedMaster(rowPerPage: number, currentPage: number, id,firstName,lastName) {

        let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;

        if(id){
          queryParams += `&id=${id}`;
        }
        if(firstName){
          queryParams += `&firstName=${firstName}`;
        }
        if(lastName){
          queryParams += `&lastName=${lastName}`;
        }


        return this.http.get<{result: any }>(BACKEND_URL+"/ledMaster"+  queryParams)
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

            console.log("getInspByKey()>>" + JSON.stringify(data));

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

      getCntByDate(onDate) {
        let queryParams = `?onDate=${onDate}`;
        return this.http.get<{result: any }>(BACKEND_URL+"/cntByDate" + queryParams)
      }



      updateInspCust(obj:MitLedInspCust,updateBy){

        var statusInt=0;
        if(obj.status){
          statusInt =1
        }else{
          statusInt =0
        }

        const data = {
                "led_inspect_id":obj.led_inspect_id,
                "no":obj.no,
                "version":obj.version,
                "cust_code":obj.cust_code,
                "firstName":obj.firstName,
                "lastName":obj.lastName,
                "memo":obj.memo,
                "status":obj.status,
                "led_code":obj.led_code,
                "updateBy":updateBy
                      }

        return this.http.put<{ message: string, data: any }>(BACKEND_URL + '/inspCust', data);
    }


    // getLedMasterHis(id){
    //   return this.http.get<{ message: string, data: any }>(BACKEND_URL + '/ledMasHis/' + id);
    // }

    getLedMasterHis(id){
      return this.http.get<{ message: string, result: any }>(BACKEND_URL + '/ledMasHis/' + id)
      .pipe(map( _data => {

        return _data.result.map(map_data => {
          return {
            'twsid':map_data.twsid,
            'no':map_data.no,
            'led_state':map_data.led_state,
            'led_state_txt':map_data.led_state_txt,
            'memo':map_data.memo,
            'resourceRef':map_data.resourceRef,
            'createBy':map_data.createBy,
            'createDate':map_data.createDate,
            'updateBy':map_data.updateBy,
            'updateDate':map_data.updateDate,
            'status':map_data.status,
            'resourceExt':this.getMinetypeFromLink(map_data.resourceRef)
          }
          // return map_data
        });
      }));

    }



    createLedMasterHis(obj:mitLedMasHis,createBy,_resourceRef:File){

      console.log("createLedMasterHis()>>" + JSON.stringify(_resourceRef));

      const postData = new FormData();
      postData.append("status",obj.status);
      postData.append("led_state",obj.led_state);
      postData.append("memo",obj.memo);
      postData.append("resourceRef",_resourceRef);
      postData.append("createBy",createBy);

        return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/ledMasHis/' + obj.twsid, postData);
        // .subscribe(resData=>{
        //   console.log("createLedMasterHis SUB>>" + JSON.stringify(resData));
        // }
        // );
    }


      updateLedMasterHis(obj:mitLedMasHis,updateBy,_resourceRef:File | string){

        let data :any;

        if(typeof(_resourceRef)==='object'){

          data = new FormData();
          data.append("no",obj.no);
          data.append("status",obj.status);
          data.append("led_state",obj.led_state);
          data.append("memo",obj.memo);
          data.append("resourceRef",_resourceRef);
          data.append("updateBy",updateBy);
        }else{

           data = {
            "no":obj.no,
            "status":obj.status,
            "led_state":obj.led_state,
            "memo":obj.memo,
            "resourceRef":obj.resourceRef,
            "updateBy":updateBy
                  }
        }

        return this.http.put<{ message: string, data: any }>(BACKEND_URL + '/ledMasHis/' + obj.twsid, data);
    }

      getMinetypeFromLink(link:string){

        var ext='';
        if(link){
          var fileName = link.split('/files/');
          ext = fileName[1].split('.')[1].toLowerCase();
        }

        return ext;
        // return new Promise(function(resolve, reject) {
        //   var fileName = link.split('/files/');
        //   var ext = fileName[1].split('.')[1].toLowerCase();
        //   resolve(ext);
        // });

      }

      // ******************************** END FILE
    }
