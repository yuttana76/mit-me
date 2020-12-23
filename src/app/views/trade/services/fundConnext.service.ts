import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FcDownload } from '../model/FcDownload.model';
// import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { formatDate } from '@angular/common';
import { Inverter } from '../fcutility/fcutility.component';


const BACKEND_URL = environment.apiURL + '/fundConnext/';

@Injectable({ providedIn: 'root' })
    export class FundConnextService {

      constructor(private http: HttpClient , private router: Router) { }

      getDownloadAPI(data:FcDownload) {

        var _businessDate = formatDate(data.businessDate, 'yyyyMMdd', 'en');

        let queryParams = `?1=1`;
        if(data.fileType){
          queryParams += `&fileType=${data.fileType}`;
        }
        if(data.businessDate){
          queryParams += `&businessDate=${_businessDate}`;
        }

        if(data.fileAs=='excel'){
          queryParams += `&fileAs=excel`;

        }else {
          queryParams += `&fileAs=zip`;
        }

        console.log('Welcome getDownloadAPI()' + queryParams );
       return this.http.get(BACKEND_URL+"/downloadFileAPI"+  queryParams,{ responseType: 'blob' });

      }


      getDownloaInfo(data:FcDownload) {

        var _businessDate = formatDate(data.businessDate, 'yyyyMMdd', 'en');

        let queryParams = `?1=1`;
        if(data.fileType){
          queryParams += `&fileType=${data.fileType}`;
        }
        if(data.businessDate){
          queryParams += `&businessDate=${_businessDate}`;
        }

        // if(data.fileAs=='excel'){
        //   queryParams += `&fileAs=excel`;

        // }else {
        //   queryParams += `&fileAs=zip`;
        // }

        console.log('Welcome downloadToClient()' + queryParams );
       return this.http.get(BACKEND_URL+"/downloadInfo"+  queryParams);

      }


      uploadDB(data:FcDownload) {

        var _businessDate = formatDate(data.businessDate, 'yyyyMMdd', 'en');

        const postData ={
          "businessDate":_businessDate,
          "fileType":data.fileType,
          "extract":data.extract,
        };

        return this.http.post(BACKEND_URL + '/uploadDB/', postData);
      }

      exportExcel(data:FcDownload) {

        var _businessDate = formatDate(data.businessDate, 'yyyyMMdd', 'en');

        const postData ={
          "businessDate":_businessDate,
          "fileType":data.fileType,
          "extract":data.extract,
        };

        return this.http.post(BACKEND_URL + '/exportExcel/', postData,{ responseType: 'blob' });
      }

      downloadNAV_Sync(data:FcDownload) {

        console.log('SERVICE onDownloadNAV_Sync() >' + JSON.stringify(data.businessDate));

        var _businessDate = formatDate(data.businessDate, 'yyyyMMdd', 'en');

        const postData ={
          "businessDate":_businessDate,
          "fileType":'Nav.zip',
        };

        return this.http.post<{ result: any}>(BACKEND_URL + '/downloadNavAPI/v2/', postData);
      }


      downloadInvestor(data:Inverter) {

        console.log('SERVICE downloadInvestor() >' + JSON.stringify(data));

        return this.http.get(BACKEND_URL+"customer/individual/"+  data.cardNumber);
      }

    }
