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
              status: data.status,
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

    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/' + id)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {
            return {
              GroupId: data.GroupId,
              GroupName: data.GroupName,
              status: data.status,
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


  deleteGroup(groupId: string): Observable<any> {

              return new Observable((observer) => {
                  this.http
                  .delete<{ message: string, result: string }>( BACKEND_URL + '/' + groupId)
                  .subscribe((data) => {
                              console.log('Deleted service >' + JSON.stringify(data));
                              const updatedGroup = this.groupList.filter(group => group.GroupId !== groupId);
                              this.groupList = updatedGroup;
                              this.groupUpdated.next([...this.groupList]);

                              // observable execution
                              observer.next(data);
                              // observer.complete();

                          });
                });
    }

  updateGroup(groupId: string, groupName: string, status: string): Observable<any> {
    const groupData = {
      'groupId': groupId,
      'groupName': groupName,
      'status': status
      };

      console.log('Group updateGroup>', JSON.stringify(groupData) );
    return new Observable((observer) => {
        this.http
        .put<{ message: string, result: string }>( BACKEND_URL + '/' + groupId, groupData)
        .subscribe((data) => {
                    // console.log('Deleted service >' + JSON.stringify(data));
                    const updatedGroup = this.groupList.filter(group => group.GroupId !== groupId);
                    this.groupList = updatedGroup;
                    this.groupUpdated.next([...this.groupList]);

                    // observable execution
                    observer.next(data);
                    // observer.complete();

                });
      });
}

  // deleteGroup(groupId: string) {
  //   console.log('deleteGroup  groupId>' + groupId);
  //   this.http.delete( BACKEND_URL + '/' + groupId)
  //       .subscribe(() => {
  //           console.log('Deleted!');
  //           const updatedGroup = this.groupList.filter(group => group.GroupId !== groupId);
  //           this.groupList = updatedGroup;
  //           this.groupUpdated.next([...this.groupList]);
  //       });
  // }

}
