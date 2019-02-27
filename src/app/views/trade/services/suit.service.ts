import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subject, Observable } from 'rxjs';
import { Question } from '../model/question.model';

const BACKEND_URL = environment.apiURL + '/suit';

const BACKEND_URL_OTP = environment.apiURL + '/otp';


@Injectable({ providedIn: 'root' })
export class SuiteService {

  constructor(private http: HttpClient) { }

  verifyExtLink(_pid: string, _has: string): Observable<any> {
    const data = {
      'pid': _pid.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/verifyExtLink', data);
  }


  verifyRequestOTP(_pid: string): Observable<any> {
    console.log(` verifyRequestOTP() ${_pid}`);

    const data = {
      'pid': _pid.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_OTP + '/getOTPtoken', data);
  }

  verifyConfirmOTP(_pid: string, token: string): Observable<any> {
    const data = {
      'pid': _pid.trim(),
      'token': token.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_OTP + '/verityOTPtoken', data);
  }


  suitEvaluate(_pid: string,_suitSerieId: string, _suitScore: number): Observable<any> {
    // console.log(`Service suitEvaluate()  ${_pid} - score: ${_suitScore}`);
    const data = {
      'pid': _pid,
      'suitSerieId': _suitSerieId,
      'score': _suitScore
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/evaluate', data);
  }

  saveSuitabilityByPID(_userId: string,_pid: string,_suitSerieId: string,
    _suitScore: number, _riskLevel: number, _riskLevelTxt: string, _riskLevelDesc: string, _ans: Array<Question>): Observable<any> {
    // console.log(`Service saveSuitability()  ${_pid} `);
    const data = {
      'userId': _userId,
      'pid': _pid,
      'suitSerieId': _suitSerieId,
      'score': _suitScore,
      'riskLevel': _riskLevel,
      'riskLevelTxt': _riskLevelTxt,
      'type_Investor': _riskLevelDesc,
      'ans': _ans
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/suitSave', data);
  }


  saveFATCA(_userId: string,_pid: string, _ans: Array<Question>): Observable<any> {

    console.log(`Service saveFATCA()  ${_pid} `);

    const data = {
      'userId': _userId,
      'pid': _pid,
      'ans': _ans
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/saveFATCA', data);
  }


  // ************************
}
