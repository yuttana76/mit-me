import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment';
import { User } from "../model/user.model";
import { Subject, Observable } from "rxjs";
import { UserCond } from "../model/userCond.model";
import { UserLevel } from "../model/userLevel.model";
import { UserGroup } from "../model/userGroup.model";

const BACKEND_URL = environment.apiURL + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

  private userList: User[] = [];
  private userUpdated = new Subject<User[]>();

  private userLevelList: UserLevel[] = [];
  private userLevelUpdated = new Subject<UserLevel[]>();

  private userGroupList: UserGroup[] = [];
  private userGroupUpdated = new Subject<UserGroup[]>();

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

  execUserEmp(user: User,
    mode: string): Observable<any> {
    const data = {
      'user': JSON.stringify(user),
      'mode': mode
      };
    return this.http
        .post<{ message: string, result: string }>(BACKEND_URL + '/exeUserEmp', data);
  }

  // ---------------- User Level
  getUserLevelByUserId(userId: string) {

    const queryParams = `?userId=${userId}`;
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/userLevelByUserId' + queryParams)
      .pipe(map((rsData) => {
          return rsData.result.map(mapData => {
            return {
              USERID: mapData.USERID,
              AppId: mapData.AppId,
              AppName: mapData.AppName,
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
      )
      .subscribe((transformed) => {
        this.userLevelList = transformed;
        this.userLevelUpdated.next([...this.userLevelList]);
      });
  }

  getUserLevelUpdated() {
    return this.userLevelUpdated.asObservable();
  }

  deleteUserLevelByAppId(userId: string, appId: string): Observable<any> {

    return new Observable((observer) => {
        this.http
        .delete<{ message: string, result: string }>( BACKEND_URL + 'userLevelByAppId/' + userId + '/' + appId)
        .subscribe((data) => {

                    const _userList = this.userLevelList.filter(list => list.AppId !== appId);
                    this.userLevelList = _userList;
                    this.userLevelUpdated.next([...this.userLevelList]);

                    observer.next(data);
                });
      });
}

  addUserLevel(userLevel: UserLevel): Observable<any> {
    const data = {
      'userId': userLevel.UserId,
      'appId': userLevel.AppId,
      'level': userLevel.Level,
      'remark': userLevel.Remark,
      'status': userLevel.STATUS,
      'expireDate': userLevel.EXPIRE_DATE,
      'createBy': userLevel.createBy,
      };
    return  new Observable((observer) => {
      this.http
      .post<{ message: string, result: string }>(BACKEND_URL + '/addUserLevel', data)
      .subscribe((_data) => {

        this.getUserLevelByUserId( userLevel.UserId);
         observer.next(data);

      });
    });
  }

// ---------------- User Group
getUserGroupByUserId(userId: string) {

  const queryParams = `?userId=${userId}`;
  return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/userGroupByUserId' + queryParams)
    .pipe(map((rsData) => {
        return rsData.result.map(mapData => {
          return {
            USERID: mapData.USERID,
            GroupId: mapData.GroupId,
            groupName: mapData.GroupName,
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
    )
    .subscribe((transformed) => {
      this.userGroupList = transformed;
      this.userGroupUpdated.next([...this.userGroupList]);
    });
}


getUserGroupUpdated() {
  return this.userGroupUpdated.asObservable();
}

deleteUserGroupByAppId(userId: string, groupId: string): Observable<any> {

  return new Observable((observer) => {
      this.http
      .delete<{ message: string, result: string }>( BACKEND_URL + 'userGroupByUserId/' + userId + '/' + groupId)
      .subscribe((data) => {

                  const _groupList = this.userGroupList.filter(list => list.GroupId !== groupId);
                  this.userGroupList = _groupList;
                  this.userGroupUpdated.next([...this.userGroupList]);

                  observer.next(data);
              });
    });
}


addUserGroup(userGroup: UserGroup): Observable<any> {
  const data = {
    'userId': userGroup.UserId,
    'groupId': userGroup.GroupId,
    'remark': userGroup.Remark,
    'status': userGroup.STATUS,
    'expireDate': userGroup.EXPIRE_DATE,
    'createBy': userGroup.createBy,
    };
  return  new Observable((observer) => {
    this.http
    .post<{ message: string, result: string }>(BACKEND_URL + '/addUserGroup', data)
    .subscribe((_data) => {

      this.getUserGroupByUserId( userGroup.UserId);
       observer.next(data);

    });
  });
}



verifyExtLink(_pid: string): Observable<any> {

  return  new Observable((observer) => {
    this.http
    .post<{ message: string, result: string }>(BACKEND_URL + '/verifyExtLink', _pid)
    .subscribe((_data) => {
      const data = {
        'userid': '000X',
        'pid': _pid,
        'fullName': 'XXX YYYY'
        };
       observer.next(data);

    });
  });
}



}
