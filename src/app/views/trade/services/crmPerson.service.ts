import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable} from 'rxjs';
import {forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { CrmPersonModel } from '../model/crmPersonal.model';

const BACKEND_URL = environment.apiURL + '/mitCrm';
const COMP_CODE='MPAM';
const LANG='TH';

@Injectable({ providedIn: 'root' })
export class CrmPersonalService {
  private personList: CrmPersonModel[] = [];
  private personListUpdated = new Subject<CrmPersonModel[]>();

  constructor(private http: HttpClient , private router: Router) { }

  // getMastert(refType) {
  //   console.log("*** Service getMastert()>" + refType)
  //   return this.http
  //     .get<{ message: string; result: any }>(BACKEND_URL + '/getMastert?refType='+ refType)
  //     .pipe(map( _data => {
  //       return _data.result.map(data => {
  //         console.log("*** RS Service getMastert()>" + JSON.stringify(data))
  //         return data
  //       });
  //     }));
  // }

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


  getPersonalLists(rowPerPage: number, currentPage: number, idCard: String,name: String,mobile:String,aliasName) {

    console.log('Execute getPersonalLists()');

    let URL =BACKEND_URL+'personList?'
    let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;
      queryParams += `&name=${idCard}`;
      queryParams += `&mobile=${name}`;
      queryParams += `&email=${mobile}`;
      queryParams += `&aliasName=${aliasName}`;

    console.log('*** params:' + URL+queryParams );

    this.http.get<{ message: string, result: any }>(URL + queryParams)
    .pipe(map((resultData) => {
        return resultData.result.map(data => {
            return {
              CompCode:data.CompCode,
              CustCode:data.CustCode,
              IdCard:data.IdCard,
              AccountNo:data.AccountNo,
              FirstName:data.FirstName,
              LastName:data.LastName,
              CustomerAlias:data.CustomerAlias,
              Dob:data.Dob,
              Sex:data.Sex,
              State:data.State,
              Type:data.Type,
              Mobile:data.Mobile,
              Telephone:data.Telephone,
              Email:data.Email,
              SocialAccount:data.SocialAccount,
              Fax:data.Fax,
              CustomerGroup:data.CustomerGroup,
              Interested:data.Interested,
              ImportantData:data.ImportantData,
              SourceOfCustomer:data.SourceOfCustomer,
              UserOwner:data.UserOwner,
              Refer:data.Refer,
              Class:data.Class,
              InvestCondition:data.InvestCondition,
              Note:data.Note,
              CreateBy:data.CreateBy,
              CreateDate:data.CreateDate,
              UpdateBy:data.UpdateBy,
              UpdateDate:data.UpdateDate
            };
        });
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

  updatePerson(personalModel: CrmPersonModel): Observable<any> {
    const URL = BACKEND_URL + '/person';
    let data = {
      'personObj': personalModel,
      'compCode': COMP_CODE,
      'actionBy': 'DEV'
      };

      data= JSON.parse(JSON.stringify(data).replace(/\s/g, ''));

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

}
