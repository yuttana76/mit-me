import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Group } from '../model/group.model';

const BACKEND_URL = environment.apiURL + '/emp';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  constructor(private http: HttpClient , private router: Router) { }

  getEmployeebyUserId(id: string) {

    console.log('Service getEmployeebyUserId() ' + id);
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/byUserId/' + id)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {
            return {
              LoginName: data.LoginName,
              EMAIL: data.EMAIL,
              imageProfile: data.imageProfile,
              empID: data.empID,
              UserId: data.UserId,
              First_Name: data.First_Name,
              Last_Name: data.Last_Name,
              STATUS: data.status,
              Position: data.Position,
              Division: data.Division,
              Branch: data.Branch,
              DEP_CODE: data.DEP_CODE,
              mobPhone: data.mobPhone,
              officePhone: data.officePhone,
              othEmail: data.othEmail,
              empDate: data.empDate,
              quitDate: data.quitDate,
              CREATEBY: data.CREATEBY,
              CREATEDATE: data.CREATEDATE,
              UPDATEBY: data.UPDATEBY,
              UPDATEDATE: data.UPDATEDATE,
            };
          });
        })
      );
  }
}
