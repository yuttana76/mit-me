import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { FcDownload } from '../model/FcDownload.model';
// import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { formatDate } from '@angular/common';
import { RegisterModel } from '../model/sitRegister.model';


const BACKEND_URL = environment.apiURL + '/stream/';
const BACKEND_OTP_URL = environment.apiURL + '/otp/';

@Injectable({ providedIn: 'root' })
    export class StreamingService {

      constructor(private http: HttpClient , private router: Router) { }

      addRegister(data:RegisterModel,counter) {

        const postData ={
          "idCard":data.idCard,
          "fname":data.firstName,
          "lname":data.lastName,
          "email":data.email,
          "mobile":data.mobile,
          "counter":counter
        };

        console.log('addRegister()' + JSON.stringify(postData));
        return this.http.post(BACKEND_URL + '/regis/', postData);
      }



      requestOTP(data:RegisterModel){

        const postData ={
          "m":data.mobile,

        };
        console.log('requestOTP()' + JSON.stringify(postData));
        return this.http.post(BACKEND_OTP_URL + '/getOTPtokenSMS/', postData);

      }


      regisAccept(data:RegisterModel) {

          let _acceptFlag ='N'

          if(data.acceptFlag)
          _acceptFlag ='Y'

        const postData ={
          "idCard":data.idCard,
          "otp":data.otp,
          "acceptFlag":_acceptFlag
          // "otpCounter":otpCounter

        };
        console.log('regisAccept()' + JSON.stringify(postData));
        return this.http.post(BACKEND_URL + '/regisProcess/', postData);
      }


      newCustRegisToMailService(name,surName,mobile,email,lineId,description){

        console.log(`regisToMailService() ${name};${surName};${mobile};${email} `);

        const data ={
          name:name,
          surName:surName,
          phone:mobile,
          email:email,
          lineId:lineId,
          description:description
        }
        return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/regisNewCustToMail', data);
      }

    }
