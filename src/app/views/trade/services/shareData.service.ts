import { Injectable, Pipe, PipeTransform } from '@angular/core';


// @Pipe({name: 'statusTransform'})
// export class StatusTransform implements PipeTransform {
//   transform(value: string): string {

//     let newStr: string = '';
//     if (value === 'A') {
//       newStr = 'Active';
//     } else if (value === 'I') {
//       newStr = 'Inactive';
//     } else {
//       newStr = 'N/A';
//     }

//     return newStr;
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

   DATE_FORMAT = 'DD/MM/YYYY';
   DB_DATE_FORMAT = 'YYYY-MM-DD';

   public OCCUPATION_FC_OTHER ='170';
   public BUSINESSTYPE_FC_OTHER ='180';
   public INCOMESOURCE_FC_OTHER ='OTHER';
   public investmentObjective_FC_OTHER ='PleaseSpecify';

   public POSITION_OTHER ='999';

   public CardTypeList=[
    {"value":"PASSPORT","text":"PASSPORT"},{"value":"CITIZEN_CARD","text":"บัตรประชาชน"}
              ]


  public nationList= [{"Nation_Code":"TH","Nation_Desc":"Thai"}
  ,{"Nation_Code":"JP","Nation_Desc":"Japanese"},
]

public CountryList=[{"value":"TH","text":"Thailand "},{"value":"US","text":"United States of America (the)"},{"value":"JP","text":"Japan)"}]

public GenderList=[{"value":"Male","text":"Male"},{"value":"Female","text":"Female"}]

public TitleList=[{"value":"MR","text":"MR"}
,{"value":"MRS","text":"MRS"}
,{"value":"MRS","text":"MRS"}
,{"value":"MISS","text":"MISS"}
,{"value":"OTHER","text":"OTHER"}
];

public MaritalStatusList=[{"value":"Single","text":"Single"}
,{"value":"Married","text":"Married"}
,{"value":"Divorced","text":"Divorced"}
,{"value":"Widowhood","text":"Widowhood"}
]


  statusList = [
    {
    code: 'A',
    desc: 'Active'
    },
    {
      code: 'I',
      desc: 'Inactive'
      },
  ];

  statusListBoolean= [
    {
    code: true,
    desc: 'Active'
    },
    {
      code: false,
      desc: 'Inactive'
      },
  ];

  menuGroupList = [
    {
      code: 'Applications',
      desc: 'Applications'
    },
    {
      code: 'Report & Enquiry',
      desc: 'Report & Enquiry'
    },
    {
      code: 'Setting',
      desc: 'Setting'
     }
  ];

  menuSequence = [
    {
      code: 1,
      desc: '1'
    },
    {
      code: 2,
      desc: '2'
    },
    {
      code: 3,
      desc: '3'
     },
     {
      code: 4,
      desc: '4'
     },
     {
      code: 5,
      desc: '5'
     },
     {
      code: 6,
      desc: '6'
     },
     {
      code: 7,
      desc: '7'
     },
     {
      code: 8,
      desc: '8'
     },
     {
      code: 9,
      desc: '9'
     },
     {
      code: 10,
      desc: '10'
     }
  ];

// Anoucement value
  anouceCategory = [
    {
      code: 'Invest',
      desc: 'Invest'
    },
    {
      code: 'Law',
      desc: 'Law'
    },
    {
      code: 'Info',
      desc: 'Info'
     }
  ];

  anouceSourceType = [
    {
      code: 'link',
      desc: 'link'
    },
    {
      code: 'pdf',
      desc: 'pdf'
    },
    {
      code: 'doc',
      desc: 'doc'
     },
     {
      code: 'content',
      desc: 'content'
     }
  ];

  constructor() { }


/*
* ขั้นตอนที่ 1 - เอาเลข 12 หลักมา เขียนแยกหลักกันก่อน (หลักที่ 13 ไม่ต้องเอามานะคร้าบ)
1 2 0 1 5 4 1 4 6 2 2 3
* ขั้นตอนที่ 2 - เอาเลข 12 หลักนั้นมา คูณเข้ากับเลขประจำหลักของมัน
รหัสบัตร 1 2 0 1 5 4 1 4 6 2 2 3
ตัวคูณ 13 12 11 10 9 8 7 6 5 4 3 2
ผลคูณ 13 24 0 10 45 32 7 24 30 8 6 6
* ขั้นตอนที่ 3 - เอาผลคูณทั้ง 12 ตัวมา บวกกันทั้งหมด จะได้ 13+24+0+10+45+32+7+24+30+8+6+6=205
* ขั้นตอนที่ 4 - เอาเลขที่ได้จากขั้นตอนที่ 3 มา mod 11 (หารเอาเศษ) จะได้ 205 mod 11 = 7
* ขั้นตอนที่ 5 - เอา 11 ตั้ง ลบออกด้วย เลขที่ได้จากขั้นตอนที่ 4 จะได้ 11-7 = 4 (เราจะได้ 4 เป็นเลขในหลัก Check Digit)
ถ้าเกิด ลบแล้วได้ออกมาเป็นเลข 2 หลัก ให้เอาเลขในหลักหน่วยมาเป็น Check Digit (เช่น 11 ให้เอา 1 มา, 10 ให้เอา 0 มา เป็นต้น)

*/
  public checkIDcard(id):boolean
{
  if(id.length != 13) return false;

  let sum =0;
  for(let i=0; i < 12; i++){
    sum += parseFloat(id.charAt(i))*(13-i);
  }

  if((11-sum%11)%10!=parseFloat(id.charAt(12)))
  return false;

  return true;
}



}
