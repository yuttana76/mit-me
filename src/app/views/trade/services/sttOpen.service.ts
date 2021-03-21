import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable} from 'rxjs';
import {forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { CrmPersonModel } from '../model/crmPersonal.model';
import { CrmTask } from '../model/crmTask.model';

const BACKEND_URL = environment.apiURL + '/stteopen';

const COMP_CODE='MPAM';
const LANG='TH';

@Injectable({ providedIn: 'root' })
export class SttOpenService {

  private personList: CrmPersonModel[] = [];
  private personListUpdated = new Subject<CrmPersonModel[]>();

  private taskList: CrmTask[] = [];
  private taskListUpdated = new Subject<CrmTask[]>();

  constructor(private http: HttpClient , private router: Router) {

  }

  getApplications(status,startLastUpdatedTime,endLastUpdatedTime) {

    let queryParams = `?status=${status}`;
    queryParams += `&startLastUpdatedTime=${startLastUpdatedTime}`;
    queryParams += `&endLastUpdatedTime=${endLastUpdatedTime}`;

    console.log('getApplications() >> ' + queryParams)

    return this.http
      .get<any>(BACKEND_URL + '/applications'+ queryParams)
      .pipe( map(fundtData => {
          return fundtData;
        })
      );
  }


}
