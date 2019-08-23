import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FcDownload } from '../model/FcDownload.model';
import { jsonpCallbackContext } from '@angular/common/http/src/module';


const BACKEND_URL = environment.apiURL + '/fundConnext/';

@Injectable({ providedIn: 'root' })
    export class FundConnextService {

      constructor(private http: HttpClient , private router: Router) { }

// https://localhost:3009/api/fundConnext/downloadFileAPI?fileType=AccountProfile.zip&businessDate=20190820&fileAs=excel
      getDownloadAPI(model:FcDownload) {

        let queryParams = `?1=1`;
        if(model.fileType){
          queryParams += `&fileType=${model.fileType}`;
        }
        if(model.businessDate){
          queryParams += `&businessDate=${model.businessDate}`;
        }

        queryParams += `&fileAs=excel`;

        console.log('Welcome getDownloadAPI()' + queryParams );
        return this.http.get(BACKEND_URL+"/downloadFileAPI"+  queryParams,{ responseType: 'blob' });

      }


    }
