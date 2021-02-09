import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable} from 'rxjs';
import {forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { CrmPersonModel } from '../model/crmPersonal.model';
import { CrmTask } from '../model/crmTask.model';

const BACKEND_URL = environment.apiURL + '/mitCrm';
const COMP_CODE='MPAM';
const LANG='TH';

@Injectable({ providedIn: 'root' })
export class CrmService {
  private personList: CrmPersonModel[] = [];
  private personListUpdated = new Subject<CrmPersonModel[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getMastert(refType) {

    let queryParams = `?compCode=${COMP_CODE}`;

    queryParams += `&refType=${refType}`;
    queryParams += `&lang=${LANG}`;

    return this.http
      .get<any>(BACKEND_URL + '/getMastert'+ queryParams)
      .pipe( map(fundtData => {
          return fundtData;
        })
      );
  }

  getPersonalLists(rowPerPage: number, currentPage: number, idCard,firstName,lastName,CustomerAlias,mobile) {

    const actionBy = 'DEV';

    console.log('Call getPersonalLists()');

    let URL =BACKEND_URL+'/searchPersonal'
    let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;

    if(idCard)
      queryParams += `&idCard=${idCard}`;

    if(firstName)
      queryParams += `&firstName=${firstName}`;

    if(lastName)
      queryParams += `&lastName=${lastName}`;

    if(mobile)
      queryParams += `&mobile=${mobile}`;

    if(CustomerAlias)
      queryParams += `&CustomerAlias=${CustomerAlias}`;

    if(COMP_CODE)
      queryParams += `&compCode=${COMP_CODE}`;

    if(actionBy)
      queryParams += `&actionBy=${actionBy}`;

    this.http.get<{ message: string, result: any }>(URL + queryParams)
    .pipe(map((resultData:any) => {

      // console.log('*** resultData>'+ JSON.stringify(resultData))
      if(resultData.records === 0){
        return [];
      }

        return resultData.result.map((data: any) => {
          return {
            compCode: data.compCode,
            CustCode: data.CustCode,
            idCard: data.idCard,
            FirstName: data.FirstName,
            LastName: data.LastName,
            CustomerAlias: data.CustomerAlias,
            Dob: data.Dob,
            Sex: data.Sex,
            State: data.State,
            custType: data.custType,
            Mobile: data.Mobile,
            Telephone: data.Telephone,
            Email: data.Email,
            SocialAccount: data.SocialAccount,
            Interested: data.Interested,
            UserOwner: data.UserOwner,
            Refer: data.Refer,
            Class: data.Class,
            InvestCondition: data.InvestCondition,
            ImportantData: data.ImportantData,
            CreateBy: data.CreateBy,
            CreateDate: data.CreateDate,
            UpdateBy: data.UpdateBy,
            UpdateDate: data.UpdateDate
          };
      });
      // }
    }))
    .subscribe((transformed) => {
        this.personList = transformed;
        this.personListUpdated.next([...this.personList]);
    });
  }

  getPersonalListsListener() {
    return this.personListUpdated.asObservable();
  }


  getPersonal(CustCode: string) {

    console.log('Welcome getPersonal()>>', CustCode);

    let queryParams = `?compCode=${COMP_CODE}`;
    let URL =BACKEND_URL+'/person/'

    return this.http.get<{result: any }>(URL + CustCode +queryParams)
    .pipe(map( data => {
      return data;
    }));
  }

  getTask(taskId: string) {

    console.log('Welcome getTask()>>', taskId);

    let queryParams = `?compCode=${COMP_CODE}`;
    let URL =BACKEND_URL+ `/task/`

    return this.http.get<{result: any }>(URL + taskId +queryParams)
    .pipe(map( data => {
      return data;
    }));
  }

  // http://localhost:3000/api/mitCrm/portfolio/123

  getPortfolio(crmCustCode: string) {

    // console.log('Welcome getPortfolio()>>', crmCustCode);
    let queryParams = `?compCode=${COMP_CODE}`;
    let URL =BACKEND_URL+'/portfolio/'

    return this.http.get<{result: any }>(URL + crmCustCode +queryParams)
    .pipe(map( data => {
      return data;
    }));
  }


  updatePerson(personalModel: CrmPersonModel): Observable<any> {
    const URL = BACKEND_URL + '/person';
    let data = {
      'personObj': personalModel,
      'compCode': COMP_CODE,
      'actionBy': 'DEV'
      };

      // data= JSON.parse(JSON.stringify(data).replace(/\s/g, ''));

      if (personalModel.CustCode && personalModel.CustCode !== null && personalModel.CustCode !== '') {
        // Update person
        // console.log("***Update person" ,JSON.stringify(personalModel))
        return this.http.put<{ message: string, data: any }>(URL + '/' + personalModel.CustCode, data);
    } else {
        // New person
        // console.log("***New person" ,JSON.stringify(personalModel))
        return this.http.post<{ message: string, data: any }>(URL, data);
    }
  }


  updateTask(obj: CrmTask): Observable<any> {
    const URL = BACKEND_URL + '/task';
    let data = {
      'obj': obj,
      'compCode': COMP_CODE,
      'actionBy': 'DEV'
      };

      // data= JSON.parse(JSON.stringify(data).replace(/\s/g, ''));

      if (obj.task_id && obj.task_id !== null && obj.task_id !== '') {
        // Update person
        // console.log("***Update person" ,JSON.stringify(personalModel))
        return this.http.put<{ message: string, data: any }>(URL + '/' + obj.task_id, data);
    } else {
        // New person
        // console.log("***New person" ,JSON.stringify(personalModel))
        return this.http.post<{ message: string, data: any }>(URL, data);
    }
  }

}
