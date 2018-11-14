
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Authority} from '../model/authority.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + '/authority';

@Injectable({ providedIn: 'root' })
export class AuthorityService {

  private authority: Authority[] = [];
  private authorityUpdated = new Subject<Authority[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getAuthority() {
    this.http.get<{ message: string, result: any }>(BACKEND_URL)
    .pipe(map((fundtData) => {
        return fundtData.result.map(data => {
            return {
              AppId: data.AppId,
              MIT_GROUP: data.MIT_GROUP,
              Status: data.Status,
              mcreate: data.mcreate,
              medit: data.medit,
              mview: data.mview,
              mdelete: data.mdelete,
              EXPIRE_DATE: data.EXPIRE_DATE,
            };
        });
    }))
    .subscribe((transformedData) => {
        this.authority = transformedData;
        this.authorityUpdated.next([...this.authority]);
    });
  }

  getAuthorityListener() {
    return this.authorityUpdated.asObservable();
  }

  getAuthorityByGroupId(id: string) {

    console.log('getAuthorityByGroupId() >>' + id );

    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/' + id)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {
            return {
              AppId: data.AppId,
              MIT_GROUP: data.MIT_GROUP,
              Status: data.Status,
              mcreate: data.mcreate,
              medit: data.medit,
              mview: data.mview,
              mdelete: data.mdelete,
              EXPIRE_DATE: data.EXPIRE_DATE,
              AppName: data.AppName,
            };
          });
        })
      )
      .subscribe((transformedData) => {
        this.authority = transformedData;
        this.authorityUpdated.next([...this.authority]);
    });
  }

  deleteAuthrity(groupId: string, appId: string): Observable<any> {

    return new Observable((observer) => {
        this.http
        .delete<{ message: string, result: string }>( BACKEND_URL + '/' + groupId + '/' + appId)
        .subscribe((data) => {
                    console.log('Deleted  Authorityservice >' + JSON.stringify(data));
                    const updatedGroup = this.authority.filter(authority => authority.AppId !== appId);
                    this.authority = updatedGroup;
                    this.authorityUpdated.next([...this.authority]);

                    // observable execution
                    observer.next(data);
                    // observer.complete();

                });
      });
}

}
