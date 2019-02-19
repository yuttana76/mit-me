import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subject, Observable } from 'rxjs';
import { Question } from '../model/question.model';

const BACKEND_URL = environment.apiURL + '/suit';

@Injectable({ providedIn: 'root' })
export class VerifyService {

  constructor(private http: HttpClient) { }

  verifyExtLink(_pid: string, _has: string): Observable<any> {
    const data = {
      'pid': _pid
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/verifyExtLink', data);
  }

  // TODO not fish yet
  getCustomerData() {
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/PIDType')
      .pipe(
        map(fundtData => {
          return fundtData.result.map(rtnData => {
            return {
              PIDType_Code: rtnData.PIDType_Code,
              PIDType_Desc: rtnData.PIDType_Desc,
              TypeHolder: rtnData.TypeHolder
            };
          });
        })
      );
  }

  suitEvaluate(_pid: string, _suitScore: number): Observable<any> {

    console.log(`Service suitEvaluate()  ${_pid} - score: ${_suitScore}`);

    const data = {
      'pid': _pid,
      'score': _suitScore,
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/evaluate', data);
  }

  saveSuitability(_pid: string,
    _suitScore: number, _riskLevel: number, _riskLevelTxt: string, _riskLevelDesc: string, _ans: Array<Question>): Observable<any> {

    console.log(`Service saveSuitability()  ${_pid} `);
    const data = {
      'pid': _pid,
      'score': _suitScore,
      'riskLevel': _riskLevel,
      'riskLevelTxt': _riskLevelTxt,
      'riskLevelDesc': _riskLevelDesc,
      'ans': _ans
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/suitSave', data);
  }


  // ************************
}
