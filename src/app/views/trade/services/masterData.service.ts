import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiURL;
const BACKEND_URL_MASTER = environment.apiURL + '/master';

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


  getOccupations() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/occupations')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Amc_Id: rtnData.Amc_Id,
            Code: rtnData.Code,
            Describe: rtnData.Describe,
            Describe_E: rtnData.Describe_E
          };
        });
      })
    );
  }


  getBusinessType() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/businessType')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Amc_Id: rtnData.Amc_Id,
            Code: rtnData.Code,
            Describe: rtnData.Describe,
            Describe_E: rtnData.Describe_E
          };
        });
      })
    );
  }


  getPosition() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/position')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Amc_Id: rtnData.Amc_Id,
            Code: rtnData.Code.toString(),
            Thai_Name: rtnData.Thai_Name,
            Eng_Name: rtnData.Eng_Name
          };
        });
      })
    );
  }


  getIncome() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/income')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Amc_Id: rtnData.Amc_Id,
            Code: rtnData.Code.toString(),
            TypeHolder: rtnData.TypeHolder,
            Thai_Name: rtnData.Thai_Name,
            Eng_Name: rtnData.Eng_Name
          };
        });
      })
    );
  }


  getIncomeSource() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/incomeSource')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(rtnData => {
          return {
            Amc_Id: rtnData.Amc_Id,
            Code: rtnData.Code.toString(),
            TypeHolder: rtnData.TypeHolder,
            Thai_Name: rtnData.Thai_Name,
            Eng_Name: rtnData.Eng_Name
          };
        });
      })
    );
  }


  getFCbusinessType() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/FCbusinessType')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          return {
            Code: data.Code,
            Thai_Name: data.Thai_Name,
            Eng_Name: data.Eng_Name
          };
        });
      })
    );
  }


  getFCoccupation() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/FCoccupation')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          return {
            Code: data.Code,
            Thai_Name: data.Thai_Name,
            Eng_Name: data.Eng_Name
          };
        });
      })
    );
  }


  getFCincomeLevel() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/FCincomeLevel')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          return {
            Code: data.Code,
            Thai_Name: data.Thai_Name,
            Eng_Name: data.Eng_Name
          };
        });
      })
    );
  }


  getFCincomeSource() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/FCincomeSource')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          return {
            Code: data.Code,
            Thai_Name: data.Thai_Name,
            Eng_Name: data.Eng_Name
          };
        });
      })
    );
  }


  getFCnation() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/FCnation')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          return {
            Code: data.Code,
            Eng_Name: data.Eng_Name
          };
        });
      })
    );
  }


  getFCcountry() {
    return this.http
    .get<{ message: string; result: any }>(BACKEND_URL_MASTER + '/FCcountry')
    .pipe(
      map(fundtData => {
        return fundtData.result.map(data => {
          return {
            Code: data.Code,
            Eng_Name: data.Eng_Name
          };
        });
      })
    );
  }
  // *********************************
}
