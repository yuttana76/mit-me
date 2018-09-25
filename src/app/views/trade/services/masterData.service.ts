
import { Injectable} from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ClientType } from '../model/ref_clientType.model';
import { BeforeTitle } from '../model/ref_before_title.model';

const BACKEND_URL = environment.apiURL ;

@Injectable({ providedIn: 'root' })
export class MasterDataService {

  // PIDTypeList = MOCK_PIDTypeList;
  private clientTypeList: ClientType[] = [];
  private clientTypeListUpdated = new Subject<ClientType[]>();

  constructor(private http: HttpClient ) { }

  getClientTypeList() {
    // return MOCK_clientTypeList;

    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/clientType')
    .pipe(map((fundtData) => {
        return fundtData.result.map(rtnData => {
            return {
              ClientType_Code: rtnData.ClientType_Code,
              ClientType_Desc: rtnData.ClientType_Desc,
            };
        });
    }))
    .subscribe((transformedData) => {
        this.clientTypeList = transformedData;
        this.clientTypeListUpdated.next([...this.clientTypeList]);
    });
  }

  getClientTypeListListener() {
    return this.clientTypeListUpdated.asObservable();
  }

  getPIDTypeList() {
    return MOCK_PIDTypeList;
  }

  getThaiTitleList() {
    return MOCK_thaiTitleList;
  }
  getEngTitleList() {
    return MOCK_engTitleList;
  }
  getCountry() {
    return MOCK_COUNTRY;
  }

  getProvince() {
    return null;
  }

  getAmphurs() {
    return null;
  }

  getTambons() {
    return null;
  }

}

export const MOCK_COUNTRY: any[] = [
  {Country_ID:'0'	, Name_Thai:'ประเทศไทย', Name_Eng:'Thailand',	Nation:'000'	,Country_Code:'TH'	,Country_Abbrv:'THA'},
  {Country_ID:'9'	, Name_Thai:'อื่นๆ', Name_Eng:'Unknown',	Nation:'999'	,Country_Code:'ZZ'	,Country_Abbrv:'ZZZ'},
  {Country_ID:'110'	, Name_Thai:'สหรัฐอเมริกา', Name_Eng:'UNITED STATES OF AMERICA',	Nation:'A10'	,Country_Code:'US'	,Country_Abbrv:'USA'},
]

export const MOCK_clientTypeList: any[] = [
  { ClientType_Code: '1', ClientType_Desc: 'Personal' },
  { ClientType_Code: '2', ClientType_Desc: 'Insatitute' }
];

export const MOCK_PIDTypeList: any[] = [
{PIDType_Code: '1'	, TypeHolder: '2'	, PIDType_Desc: 'Foreign CitiZen ID'},
{PIDType_Code: '2'	, TypeHolder: '2'	, PIDType_Desc: 'Legal Permanent Resident'},
{PIDType_Code: 'C'	, TypeHolder: '1'	, PIDType_Desc: 'บัตรประชาชน'},
{PIDType_Code: 'D'	, TypeHolder: '2'	, PIDType_Desc: 'บัตรข้าราชการ/รัฐวิสาหกิจ'},
{PIDType_Code: 'E'	, TypeHolder: '2'	, PIDType_Desc: 'บัตรประชาชน'},
{PIDType_Code: 'G'	, TypeHolder: '1'	, PIDType_Desc: 'บัตรข้าราชการ'},
{PIDType_Code: 'I'	, TypeHolder: '2'	, PIDType_Desc: 'ใบจดทะเบียนนิติบุคคล'},
{PIDType_Code: 'M'	, TypeHolder: '2'	, PIDType_Desc: 'เลขที่มูลนิธิ'},
{PIDType_Code: 'P'	, TypeHolder: '1'	, PIDType_Desc: 'หนังสือเดินทาง'}
];

export const MOCK_thaiTitleList: any[] = [
    {
      Title_Name: 'นาย'
      , Prefix_Name: 'นาย'
      , Suffix_Name: 'นาย'
    },
    {
      Title_Name: 'นาง'
      , Prefix_Name: 'นาง'
      , Suffix_Name: 'นาง'
    },
    {
      Title_Name: 'นส.'
      , Prefix_Name: 'นส.'
      , Suffix_Name: 'นส.'
    },
  ];

  export const MOCK_engTitleList: any[] = [
        {
          Title_Name: 'MR.'
          , Prefix_Name: 'MR.'
          , Suffix_Name: 'MR.'
        },
        {
          Title_Name: 'MRS.'
          , Prefix_Name: 'MRS.'
          , Suffix_Name: 'MRS.'
        },
        {
          Title_Name: 'MISS.'
          , Prefix_Name: 'MISS.'
          , Suffix_Name: 'MISS.'
        },
      ];

