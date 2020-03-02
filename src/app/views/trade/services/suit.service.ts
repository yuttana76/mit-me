import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subject, Observable, forkJoin } from 'rxjs';
import { Question } from '../model/question.model';
import { KycSurveyList } from '../model/kycSurveyList';

const BACKEND_URL = environment.apiURL + '/suit';
const BACKEND_URL_FATCA = environment.apiURL + '/fatca';
const BACKEND_URL_OTP = environment.apiURL + '/otp';
const BACKEND_URL_SURVEY = environment.apiURL + '/survey';
const BACKEND_URL_FC = environment.apiURL + '/fundConnext';



@Injectable({ providedIn: 'root' })
export class SuiteService {

  private kycSurveyList: KycSurveyList[] = [];
  private kycSurveyListUpdated = new Subject<KycSurveyList[]>();


  constructor(private http: HttpClient) { }

  verifyExtLink(_pid: string, _has: string): Observable<any> {
    const data = {
      'pid': _pid.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/verifyExtLink', data);
  }

  verifyRequestOTP(_pid: string,_mobile: string): Observable<any> {
    const data = {
      'pid': _pid.trim(),
      'm': _mobile.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_OTP + '/getOTPtokenSMS', data);
  }

  verifyConfirmOTP(_pid: string, token: string,mobile:string): Observable<any> {
    const data = {
      'pid': _pid.trim(),
      'token': token.trim(),
      'mobile': mobile,
      'device': 'Mobile',
      'module': 'MIT-Survey',
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

  saveSuitabilityByPID(actionBy: string,_pid: string,_suitSerieId: string,
    _suitScore: number, _riskLevel: number, _riskLevelTxt: string, _riskLevelDesc: string, _ans: Array<Question>,_OTP_ID:string): Observable<any> {
    // console.log(`Service saveSuitability()  ${_pid} `);
    const data = {
      'userId': actionBy,
      'pid': _pid,
      'suitSerieId': _suitSerieId,
      'score': _suitScore,
      'riskLevel': _riskLevel,
      'riskLevelTxt': _riskLevelTxt,
      'type_Investor': _riskLevelDesc,
      'ans': _ans,
      'otp_id':_OTP_ID
    };

    return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/suitSave', data);
  }

  saveFATCA(_id: string,_pid: string, _ans: Array<Question>,opt_id: string): Observable<any> {
    const data = {
      'userId': _id,
      'pid': _pid,
      'ans': _ans,
      'opt_id': opt_id,
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_FATCA + '/saveFATCA', data);
  }


  getFATCA(_id: string): Observable<any> {
    return this.http.get<{ message: string, result: string }>(BACKEND_URL_FATCA + '/getfatca/'+_id);
  }

  getSuitByCust(_id: string): Observable<any> {

    return this.http.get<{result: any }>(BACKEND_URL_SURVEY + '/getSuit/'+_id);
  }

  mailThankCust(_pid: string): Observable<any> {
    const data = {
      'custCode': _pid.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_SURVEY + '/surveyThankCust', data);
  }

  surveySuitThankCust(_pid: string): Observable<any> {
    const data = {
      'custCode': _pid.trim()
    };
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_SURVEY + '/surveySuitThankCust', data);
  }

  reqNewMobile(custCode: string,newMobile:string): Observable<any> {
    const data = {
      "custCode":custCode,
      "log_msg":newMobile
    }
    return this.http.post<{ message: string, result: string }>(BACKEND_URL_SURVEY + '/reqNewMobile', data);
  }

  getKycSurveyListener() {
    return this.kycSurveyListUpdated.asObservable();
  }


  getKycSurveyList(rowPerPage: number, currentPage: number, Cust_Code: string,SurveyStartDate:string,SurveyToDate:string) {

    let queryParams = `?pagesize=${rowPerPage}&page=${currentPage}`;

    if(Cust_Code){
      queryParams += `&custCode=${Cust_Code}`;
    }
    if(SurveyStartDate){
      queryParams += `&SurveyStartDate=${SurveyStartDate}`;
    }
    if(SurveyToDate){
      queryParams += `&SurveyToDate=${SurveyToDate}`;
    }

    console.log('queryParams>' + queryParams);

    this.http.get<{ msg: string, data: any }>(BACKEND_URL_SURVEY+'/dashboard' + queryParams)
    .pipe(map((resultData) => {

        return resultData.data.map(data => {
            return {
              Cust_Code :data.Cust_Code,
              FullName : data.FullName,
              KYC_C_DATE : data.KYC_C_DATE,
              KYC_U_DATE : data.KYC_U_DATE,
              SUIT_DATE :data.SUIT_DATE,
              SUIT_LEVEL :data.SUIT_LEVEL
            };
        });
    }))
    .subscribe((transformed) => {
        this.kycSurveyList = transformed;
        this.kycSurveyListUpdated.next([...this.kycSurveyList]);
    }
    );
  }

  // https://localhost:3009/api/fundConnext/customer/individual/
  // tslint:disable-next-line:max-line-length
  uploadCustInd(identificationCardType,passportCountry, cardNumber, referralPerson, suitabilityRiskLevel,suitabilityEvaluationDate,fatca,fatcaDeclarationDate,cddScore,cddDate,actionBy):
  Observable<any> {

    console.log('uploadCustInd() actionBy>> ' + actionBy);

    const data = {
      "identificationCardType": identificationCardType,
      "passportCountry":passportCountry,
      "cardNumber": cardNumber,
      "referralPerson": referralPerson,
      "approved": false,
      "suitabilityRiskLevel":suitabilityRiskLevel,
      "suitabilityEvaluationDate":suitabilityEvaluationDate,
      "fatca":fatca,
      "fatcaDeclarationDate":fatcaDeclarationDate,
      "cddScore":cddScore,
      "cddDate":cddDate,
      "actionBy":actionBy,
     };

     console.log( "FC API>" +JSON.stringify(data));

    let observableBatch = [];
    observableBatch.push(this.http.patch<{ message: string, result: string }>(BACKEND_URL_FC + '/customer/individual/', data));

    return forkJoin(observableBatch);

    // return this.http.patch<{ message: string, result: string }>(BACKEND_URL_FC + '/customer/individual/', data);

  }


  getCustIndPartial(_id: string): Observable<any> {
    return this.http.get<{ result: any }>(BACKEND_URL_SURVEY + '/custIndPartial/'+_id);
  }


  // https://localhost:3009/api/survey/surveyKYCByID

  sendKYCToCustomer(_id: string){

    var _target="prod"
    if(environment.apiURL && environment.apiURL.includes('localhost')){
      _target ="test";
    }

    const data = {
      "custCode":_id,
        "target":_target
    }
    return this.http.post<{ result: any}>(BACKEND_URL_SURVEY + '/surveyKYCByID', data);
  }
}
