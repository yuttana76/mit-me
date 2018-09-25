import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { ClientType } from "../model/ref_clientType.model";
import { PIDTypes } from "../model/ref_PIDTypes.model";
import { BeforeTitle } from "../model/ref_before_title.model";

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
}

export const MOCK_COUNTRY: any[] = [
  {
    Country_ID: '0',
    Name_Thai: 'ประเทศไทย',
    Name_Eng: 'Thailand',
    Nation: '000',
    Country_Code: 'TH',
    Country_Abbrv: 'THA'
  },
  {
    Country_ID: '9',
    Name_Thai: 'อื่นๆ',
    Name_Eng: 'Unknown',
    Nation: '999',
    Country_Code: 'ZZ',
    Country_Abbrv: 'ZZZ'
  },
  {
    Country_ID: '110',
    Name_Thai: 'สหรัฐอเมริกา',
    Name_Eng: 'UNITED STATES OF AMERICA',
    Nation: 'A10',
    Country_Code: 'US',
    Country_Abbrv: 'USA'
  }
];

export const MOCK_clientTypeList: any[] = [
  { ClientType_Code: '1', ClientType_Desc: 'Personal' },
  { ClientType_Code: '2', ClientType_Desc: 'Insatitute' }
];

export const MOCK_PIDTypeList: any[] = [
  { PIDType_Code: '1', TypeHolder: '2', PIDType_Desc: 'Foreign CitiZen ID' },
  {
    PIDType_Code: '2',
    TypeHolder: '2',
    PIDType_Desc: 'Legal Permanent Resident'
  },
  { PIDType_Code: 'C', TypeHolder: '1', PIDType_Desc: 'บัตรประชาชน' },
  {
    PIDType_Code: 'D',
    TypeHolder: '2',
    PIDType_Desc: 'บัตรข้าราชการ/รัฐวิสาหกิจ'
  },
  { PIDType_Code: 'E', TypeHolder: '2', PIDType_Desc: 'บัตรประชาชน' },
  { PIDType_Code: 'G', TypeHolder: '1', PIDType_Desc: 'บัตรข้าราชการ' },
  { PIDType_Code: 'I', TypeHolder: '2', PIDType_Desc: 'ใบจดทะเบียนนิติบุคคล' },
  { PIDType_Code: 'M', TypeHolder: '2', PIDType_Desc: 'เลขที่มูลนิธิ' },
  { PIDType_Code: 'P', TypeHolder: '1', PIDType_Desc: 'หนังสือเดินทาง' }
];

export const MOCK_thaiTitleList: any[] = [
  {
    Title_Name: 'นาย',
    Prefix_Name: 'นาย',
    Suffix_Name: 'นาย'
  },
  {
    Title_Name: 'นาง',
    Prefix_Name: 'นาง',
    Suffix_Name: 'นาง'
  },
  {
    Title_Name: 'นส.',
    Prefix_Name: 'นส.',
    Suffix_Name: 'นส.'
  }
];

export const MOCK_engTitleList: any[] = [
  {
    Title_Name: 'MR.',
    Prefix_Name: 'MR.',
    Suffix_Name: 'MR.'
  },
  {
    Title_Name: 'MRS.',
    Prefix_Name: 'MRS.',
    Suffix_Name: 'MRS.'
  },
  {
    Title_Name: 'MISS.',
    Prefix_Name: 'MISS.',
    Suffix_Name: 'MISS.'
  }
];
