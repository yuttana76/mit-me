import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiURL;

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  constructor(private http: HttpClient) {}

  getClientTypes() {
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/clientType')
      .pipe(
        map(fundtData => {
          return fundtData.result.map(rtnData => {
            return {
              ClientType_Code: rtnData.ClientType_Code,
              ClientType_Desc: rtnData.ClientType_Desc
            };
          });
        })
      );
  }

  getPIDTypes() {
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

  getThaiTitleList() {
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/thaiTitle')
      .pipe(
        map(fundtData => {
          return fundtData.result.map(rtnData => {
            return {
              Title_Name: rtnData.Title_Name,
              Prefix_Name: rtnData.Prefix_Name,
              Suffix_Name: rtnData.Suffix_Name
            };
          });
        })
      );
  }

  getEngTitleList() {
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/engTitle')
      .pipe(
        map(fundtData => {
          return fundtData.result.map(rtnData => {
            return {
              Title_Name: rtnData.Title_Name,
              Prefix_Name: rtnData.Prefix_Name,
              Suffix_Name: rtnData.Suffix_Name
            };
          });
        })
      );
  }

  getNations() {
    return this.http
      .get<{ message: string; result: any }>(BACKEND_URL + '/nation')
      .pipe(
        map(fundtData => {
          return fundtData.result.map(rtnData => {
            return {
              Nation_Code: rtnData.Nation_Code,
              Nation_Desc: rtnData.Nation_Desc,
              IT_Code: rtnData.IT_Code,
              SET_Code: rtnData.SET_Code
            };
          });
        })
      );
  }


  getCountry() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/country')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Country_ID: rtnData.Country_ID,
            Name_Thai: rtnData.Name_Thai,
            Name_Eng: rtnData.Name_Eng,
            Nation: rtnData.Nation,
            Country_Code: rtnData.Country_Code,
            Country_Abbrv: rtnData.Country_Abbrv
          };
        });
      })
    );
}

  getProvince() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/province')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Province_ID: rtnData.Province_ID,
            Name_Thai: rtnData.Name_Thai,
            Name_Eng: rtnData.Name_Eng,
            Country_ID: rtnData.Country_ID
          };
        });
      })
    );
  }

  getAmphurs() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/amphur')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Amphur_ID: rtnData.Amphur_ID,
            Name_Thai: rtnData.Name_Thai,
            Name_Eng: rtnData.Name_Eng,
            Prefix: rtnData.Prefix,
            Province_ID: rtnData.Province_ID
          };
        });
      })
    );
  }

  getTambons() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/tambon')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Tambon_ID: rtnData.Tambon_ID,
            Prefix: rtnData.Prefix,
            Name_Thai: rtnData.Name_Thai,
            Name_Eng: rtnData.Name_Eng,
            Amphur_ID: rtnData.Amphur_ID
          };
        });
      })
    );
  }

  getSaleAgent() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL + '/saleAgent')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Id: rtnData.Id,
            Type: rtnData.Type,
            License_Code: rtnData.License_Code,
            Issue_Date: rtnData.Issue_Date,
            User_Code: rtnData.User_Code,
            Full_Name: rtnData.Full_Name,
            Email: rtnData.Email
          };
        });
      })
    );
  }
}
