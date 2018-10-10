import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient ) { }

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

}
