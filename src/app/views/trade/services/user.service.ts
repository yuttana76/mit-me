import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment';
import { User } from "../model/user.model";
import { Subject, Observable } from "rxjs";
import { UserCond } from "../model/userCond.model";

const BACKEND_URL = environment.apiURL + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

  private userList: User[] = [];
  private userUpdated = new Subject<User[]>();

  constructor(private http: HttpClient ) { }

  getUserInfo(userId: string) {

    const queryParams = `?userId=${userId}`;
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/userInfo' + queryParams)
      .pipe(map((rsData) => {
          return rsData.result.map(mapData => {
            return {
              USERID: mapData.USERID,
              EMAIL: mapData.EMAIL,
              DEP_CODE: mapData.DEP_CODE
            };
          });
        })
      );
  }

  getUserLevel(userId: string, appId: string) {

    const queryParams = `?userId=${userId}&appId=${appId}`;
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/userLevel' + queryParams)
      .pipe(map((rsData) => {
          return rsData.result.map(mapData => {
            return {
              USERID: mapData.USERID,
              AppId: mapData.AppId,
              Level: mapData.Level,
              Remark: mapData.Remark,
              STATUS: mapData.STATUS,
              EXPIRE_DATE: mapData.EXPIRE_DATE,
              CREATEBY: mapData.CREATEBY,
              CREATEDATE: mapData.CREATEDATE,
              UPDATEBY: mapData.UPDATEBY,
              UPDATEDATE: mapData.UPDATEDATE

            };
          });
        })
      );
  }

  getSearchUser(rowPerPage: number, currentPage: number, userCond: UserCond) {

    let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;

    if (userCond.firstName) {
      queryParams += `&firstName=${userCond.firstName}`;
    }

    if (userCond.lastName) {
      queryParams += `&lastName=${userCond.lastName}`;
    }

    if (userCond.email) {
      queryParams += `&email=${userCond.email}`;
    }

    if (userCond.department) {
      queryParams += `&depCode=${userCond.department}`;
    }


    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/searchUser' + queryParams)
    .pipe(map((resultData) => {
        return resultData.result.map(data => {
            return {
              NUMBER: data.NUMBER,
              LoginName: data.LoginName,
              USERID: data.USERID,
              STATUS: data.STATUS,
              First_Name: data.First_Name,
              Last_Name: data.Last_Name,
              EMAIL: data.EMAIL,
              Department: data.DEP_NAME,
              Position: data.Position,
              Branch: data.Branch,
            };
        });
    }))
    .subscribe((transformed) => {
        this.userList = transformed;
        this.userUpdated.next([...this.userList]);
    });
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }


  createUserEmp(user: User,
    mode: string): Observable<any> {
    // console.log('Service WIP  createCustomer() !');
    const data = {
      'user': JSON.stringify(user),
      'mode': mode
      };

      console.log('createUserEmp >>', JSON.stringify(data));

    return this.http
        .post<{ message: string, result: string }>(BACKEND_URL + '/exeUserEmp', data);
  }

}
