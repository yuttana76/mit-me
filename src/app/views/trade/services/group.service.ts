import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Group } from '../model/group.model';

const BACKEND_URL = environment.apiURL ;

@Injectable({ providedIn: 'root' })
export class GroupService {

  private groupList: Group[] = [];
  private groupUpdated = new Subject<Group[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getGroup() {
    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/group')
    .pipe(map((fundtData) => {
        return fundtData.result.map(amc => {
            return {
              GroupId: amc.GroupId,
              GroupName: amc.GroupName,
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

}
