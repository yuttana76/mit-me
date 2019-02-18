import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subject, Observable } from 'rxjs';
import { Question } from '../model/question.model';

const BACKEND_URL = environment.apiURL + '/suit';

@Injectable({ providedIn: 'root' })
export class VerifyService {

  constructor(private http: HttpClient ) { }

  verifyExtLink(_pid: string,_has: string): Observable<any> {
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

evaluateRiskLevel(_pid: string, _score: number, ans: Array<Question>): Observable<any> {

  console.log( `evaluateRiskLevel() Service ${_pid} - score: ${_score}` );

    const data = {
      'pid': _pid,
      'score': _score,
      'ans': ans
      };
      return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/evaluate', data);
}

saveSuitability(custCode: string,_has: string): Observable<any> {
  const data = {
    'custCode': custCode
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/verifyExtLink', data);
}


// ************************
}
