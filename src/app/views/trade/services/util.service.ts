
import { Injectable } from '../../../../../node_modules/@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const BACKEND_URL = environment.apiURL + '/util/';

@Injectable({ providedIn: 'root' })
export class UtilService {

  constructor(private http: HttpClient ) { }

  regisToMailService(name,surName,mobile,email){

    console.log(`regisToMailService() ${name};${surName};${mobile};${email} `);

    const data ={
      name:name,
      surName:surName,
      phone:mobile,
      email:email
    }
    return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/regisToMail', data);
  }

}

