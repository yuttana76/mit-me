import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { CDDModel } from "../model/cdd.model";
import { AddrCustModel } from "../model/addrCust.model";

const BACKEND_URL = environment.apiURL + '/cdd';

@Injectable({ providedIn: 'root' })
export class CddService {

  constructor(private http: HttpClient) {}

  getCustCDDInfo(custCode: string){
      return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/cddInfo/' + custCode)
      .pipe(
        map(fundtData => {
          return fundtData.result.map(data => {

            console.log("Title BF>>" + data.title);
            var _title = data.title.split(".");
            console.log("Title AF>>" + _title);

            return {
              pid: data.ID_CARD,
              firstName: data.First_Name_T,
              lastName: data.Last_Name_T,
              dob: data.Birth_Day,
              nationality: data.nationality,
              PIDExpDate: data.cardExpiryDate,
              mobile: data.Mobile,
              email: data.Email,
              occupation: data.Occupation_Code,
              occupationOth: data.Occupation_Desc,
              position: data.Position_Code,
              positionOth: data.Position_Desc,
              typeBusiness: data.BusinessType_Code,
              typeBusinessOth: data.BusinessType_Desc,
              incomeLevel: data.Income_Code,
              incomeSource: data.Income_Source_Code,
              incomeSourceOth: data.Income_Source_Desc,
              workPlace: data.WorkPlace,
              identificationCardType: data.identificationCardType,
              passportCountry: data.passportCountry,
              // title: data.title,
              title: _title[0],
              titleOther: data.titleOther,
              firstNameE: data.First_Name_E,
              lastNameE: data.Last_Name_E,
              MailSameAs: data.MailSameAs,

              maritalStatus: data.MaritalStatus,
              spouseCardType: data.SpouseCardType,
              spousePassportCountry: data.SpousePassportCountry,
              spouseCardNumber: data.SpouseCardNumber,
              spouseTitle: data.SpouseTitle,
              spouseTitleOther: data.SpouseTitleOther,
              spouseFirstName: data.SpouseFirstName,
              spouseLastName: data.SpouseLastName,
              spouseIDExpDate: data.SpouseIDExpDate,
              moneyLaundaring: data.MoneyLaundaring,
              politicalRelate: data.PoliticalRelate,
              rejectFinancial: data.RejectFinancial,
              taxDeduction: data.TaxDeduction,
              cardNotExp: data.cardNotExp,
              SpouseIDNotExp: data.SpouseIDNotExp,
              NumChildren: data.NumChildren.toString(),
            };
          });
        })
      );
    }


    saveCustCDDInfo(ActionBy:string,custCode: string, cdd: CDDModel) {

    let newDate = new Date(cdd.dob)
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear()    ;
    let _DOB = year+"-"+month+"-"+day;

    let _cardEXPDate = '';
    if('Y' != cdd.cardNotExp){
      newDate = new Date(cdd.PIDExpDate)
      day = newDate.getDate();
      month = newDate.getMonth() + 1;
      year = newDate.getFullYear()    ;
     _cardEXPDate = year+"-"+month+"-"+day;
    }

    let _spouseIDExpDate = '';
    if('Y' != cdd.SPpersonModel.cardNotExp && cdd.SPpersonModel.cardExpDate != ''){
      newDate = new Date(cdd.SPpersonModel.cardExpDate)
      day = newDate.getDate();
      month = newDate.getMonth() + 1;
      year = newDate.getFullYear()    ;
     _spouseIDExpDate = year+"-"+month+"-"+day;
    }

    let _reqModifyFlag ;
    if (cdd.ReqModifyFlag){
      _reqModifyFlag = 1;
    }else {
      _reqModifyFlag = 0;
    }

    const data = {
      actionBy: ActionBy,
      Cust_Code: custCode,
      pid: cdd.pid,
      // title: cdd.title,
      firstName: cdd.firstName,
      lastName: cdd.lastName,
      dob: _DOB,
      nationality: cdd.nationality,
      cardExpiryDate:_cardEXPDate,
      mobile: cdd.mobile,
      email: cdd.email,
      occupation: cdd.occupation,
      occupation_Oth: cdd.occupation_Oth,
      position: cdd.position,
      position_Oth: cdd.position_Oth,
      typeBusiness: cdd.typeBusiness,
      typeBusiness_Oth: cdd.typeBusiness_Oth,
      incomeLevel: cdd.incomeLevel,
      incomeSource: cdd.incomeSource,
      incomeSource_Oth: cdd.incomeSource_Oth,
      workPlace: cdd.workPlace,
      ReqModifyFlag: _reqModifyFlag,

      identificationCardType: cdd.identificationCardType,
      passportCountry: cdd.passportCountry,
      title: cdd.title,
      titleOther: cdd.titleOther,
      firstNameE: cdd.firstNameE,
      lastNameE: cdd.lastNameE,
      MailSameAs: cdd.MailSameAs,

      MaritalStatus: cdd.maritalStatus,

      SpouseCardType: cdd.SPpersonModel.cardType,
      SpousePassportCountry: cdd.SPpersonModel.passportCountry,
      SpouseCardNumber: cdd.SPpersonModel.cardNumber,
      SpouseTitle: cdd.SPpersonModel.title,
      SpouseTitleOther: cdd.SPpersonModel.titleOther,
      SpouseFirstName: cdd.SPpersonModel.firstName,
      SpouseLastName: cdd.SPpersonModel.lastName,
      SpouseIDNotExp: cdd.SPpersonModel.cardNotExp,
      SpouseIDExpDate: _spouseIDExpDate,

      MoneyLaundaring: cdd.moneyLaundaring,
      PoliticalRelate: cdd.politicalRelate,
      RejectFinancial: cdd.rejectFinancial,
      TaxDeduction: cdd.taxDeduction,
      cardNotExp: cdd.cardNotExp,
      NumChildren: cdd.numChildren,
      };

    return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/cddInfo', data);
  }


  getCustCDDAddr(custCode: string, Addr_Seq: number){
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/cddAddr/' + custCode + '?Addr_Seq=' + Addr_Seq )
    .pipe(
      map(fundtData => {

        return fundtData.result.map(data => {
          // console.log('Service getCustCDDAddr()>>' + JSON.stringify(data))

          try{
            if (data.SameAs) {
              data.SameAs = data.SameAs.toString();
            }
          }catch(err){
            console.log('ERR >>' + err);
          }

          return {
            Cust_Code: data.Cust_Code,
            Addr_Seq: data.Addr_Seq,
            Addr_No: data.Addr_No,
            Moo: data.Moo,
            Place: data.Place,
            Floor: data.Floor,
            Soi: data.Soi,
            Road: data.Road,
            Tambon_Id: data.Tambon_Id,
            Amphur_Id: data.Amphur_Id,
            Province_Id: data.Province_Id,
            Country_Id: data.Country_Id,
            Country_oth: data.Country_oth,
            Zip_Code: data.Zip_Code,
            Print_Address: data.Print_Address,
            Tel: data.Tel,
            Fax: data.Fax,
            SameAs: data.SameAs,
            CreateBy: data.CreateBy,
            CreateDate: data.CreateDate,
            UpdateBy: data.UpdateBy,
            UpdateDate: data.UpdateDate

          };
        });
      })
    );
  }


  saveCustCDDAddr(ActionBy: string, custCode: string, _addr: AddrCustModel) {

    let _reqModifyFlag ;
    if (_addr.ReqModifyFlag){
      _reqModifyFlag = 1;
    }else {
      _reqModifyFlag = 0;
    }
    // console.log('saveCustCDDAddr()>>'+ JSON.stringify(_addr))
    const data = {
      actionBy: ActionBy,
      Cust_Code: custCode,
      Addr_Seq: _addr.Addr_Seq,
      Addr_No: _addr.Addr_No,
      Moo: _addr.Moo,
      Place: _addr.Place,
      Floor: _addr.Floor,
      Soi: _addr.Soi,
      Road: _addr.Road,
      Tambon_Id: _addr.Tambon_Id,
      Amphur_Id: _addr.Amphur_Id,
      Province_Id: _addr.Province_Id,
      Country_Id: _addr.Country_Id,
      Country_oth: _addr.Country_oth,
      Zip_Code: _addr.Zip_Code,
      Tel: _addr.Tel,
      Fax: _addr.Fax,
      SameAs: _addr.SameAs,
      ReqModifyFlag: _reqModifyFlag,
      };
    return this.http.post<{ message: string, data: any }>(BACKEND_URL + '/cddAddr', data);
  }

}

// function convert(str) {
//   var date = new Date(str),
//       mnth = ("0" + (date.getMonth()+1)).slice(-2),
//       day  = ("0" + date.getDate()).slice(-2);
//   return [ date.getFullYear(), mnth, day ].join("-");
// }



