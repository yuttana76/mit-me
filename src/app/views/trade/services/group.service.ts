import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Group } from '../model/group.model';

const BACKEND_URL = environment.apiURL + '/group';

@Injectable({ providedIn: 'root' })
export class GroupService {

  private groupList: Group[] = [];
  private groupUpdated = new Subject<Group[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getGroup() {
    this.http.get<{ message: string, result: any }>(BACKEND_URL)
    .pipe(map((fundtData) => {
        return fundtData.result.map(data => {
            return {
              GroupId: data.GroupId,
              GroupName: data.GroupName,
            };
        });
    }))
    .subscribe((transformedData) => {
        this.groupList = transformedData;
        this.groupUpdated.next([...this.groupList]);
    });
  }

  getGroupListener() {
    return this.groupUpdated.asObservable();
  }

  getGroupById(id: string) {

    console.log('getGroupById() >> ' + id);

    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/' + id)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {
            return {
              GroupId: data.GroupId,
              GroupName: data.GroupName,
            };
          });
        })
      );
  }

  addGroup(groupId: string, groupName: string): Observable<any> {
    // console.log( 'Service addGroup()' + groupId + ' ;groupName:' + groupName);
    const data = {
      'groupId': groupId,
      'groupName': groupName,
      };

    return this.http
        .post<{ message: string, result: string }>(BACKEND_URL , data);
  }

}
