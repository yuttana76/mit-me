import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable} from 'rxjs';
import {forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { CrmPersonModel } from '../model/crmPersonal.model';

const BACKEND_URL = environment.apiURL + '/crm/';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private personList: CrmPersonModel[] = [];
  private personListUpdated = new Subject<CrmPersonModel[]>();

  constructor(private http: HttpClient , private router: Router) { }

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


  getPersonalr(CustCode: string) {

    let URL =BACKEND_URL+'person/'

    return this.http.get<{result: any }>(URL + CustCode )
    .pipe(map( fundtData => {
      return fundtData.result.map(data => {
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
          SourceOfCustomer:data.SourceOfCustomer,
          UserOwner:data.UserOwner,
          Refer:data.Refer,
          Class:data.Class,
          InvestCondition:data.InvestCondition,
          ImportantData:data.ImportantData,
          Note:data.Note,
          CreateBy:data.CreateBy,
          CreateDate:data.CreateDate,
          UpdateBy:data.UpdateBy,
          UpdateDate:data.UpdateDate
        };
      });
    }));
  }

  updatePerson(personal: CrmPersonModel) {

    let URL =BACKEND_URL+'person/'

    this.http
        .post<{ message: string, data: any }>(URL, personal)
        .subscribe(responseData => {
          console.log('Service  Result updatePerson()>>', JSON.stringify(responseData));
            this.router.navigate(['/']);
        });
  }


}
