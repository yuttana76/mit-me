import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CrmActivity } from '../model/crmActivity.model';

@Component({
  selector: 'app-crm-activity',
  templateUrl: './crm-activity.component.html',
  styleUrls: ['./crm-activity.component.scss']
})
export class CrmActivityComponent implements  OnInit, OnDestroy  {

  form: FormGroup;
  paramId: String = '';
  activityObj: CrmActivity = new CrmActivity();

  actTypeList =[
    {
    code:'General',
    desc:'ทั่วไป	General',
  },
  {
    code:'Contact',
    desc:'ติดต่อลูกค้า	Contact ',
  },
  {
    code:'Send',
    desc:'ส่งเอกสาร	Send',
  },
  {
    code:'Meet customer',
    desc:'พบลูกค้า	Meet customer',
  },
  {
    code:'Appointment',
    desc:'นัดหมาย	Appointment',
  },
  {
    code:'Order Taking',
    desc:'ซื้อสินค้า	Order Taking',
  },
  {
    code:'Complain',
    desc:'ร้องเรียน	Complain',
  },
];

contactChannelList =[ {
  code:'tel',
  desc:'โทรศัพท์',
},
{
  code:'email',
  desc:'E-mail',
},
{
  code:'Social',
  desc:'Social',
},
{
  code:'mail',
  desc:'จดหมาย',
},
];

prodGroupList=[
  {
    code:'bond',
    desc:'Bond',
  },
  {
    code:'mf',
    desc:'MF',
  },
  {
    code:'pf',
    desc:'PF',
  },
];


contactResult=[
  {
    code:'1',
    desc:'สนใจ',
  },
  {
    code:'2',
    desc:'ไม่สนใจ',
  },
  {
    code:'3',
    desc:'ยังไม่สนใจ',
  },
  {
    code:'4',
    desc:'ตัดสินใจ',
  },
  {
    code:'5',
    desc:'คุยอีกครั้ง',
  },
]

ProductList=[
  {
    code:'1',
    desc:'Chaiyo',
  },
  {
    code:'2',
    desc:'JMT',
  },
  {
    code:'3',
    desc:'PTT-w3',
  },
  {
    code:'4',
    desc:'THAI',
  },
  {
    code:'5',
    desc:'PTTGC',
  },
]


offerResult=[
  {
    code:'1',
    desc:'สนใจ',
  },
  {
    code:'2',
    desc:'ไม่สนใจ',
  },
  {
    code:'3',
    desc:'ยังไม่สนใจ',
  },
  {
    code:'4',
    desc:'ตัดสินใจ',
  },
  {
    code:'5',
    desc:'คุยอีกครั้ง',
  },
]

// generalAct
contactCustAct={contactChannel:'',dateTime:'',prod:'',contactResult:'',nextTime:'',note:''}
// meetCustAct={datetime:dd/mm/yyyy hh:mm,locate:xxxx,note:xxxx,}
// appointmentAct={subject:xxxx,startTime:dd/mm/yyyy hh:mm,endTime:dd/mm/yyyy hh:mm,note:xxxx,allDay:Y/N}
// sendGoodAct={doc:xxNamexx,path:xxxx,datetime:dd/mm/yyyy hh:mm,by:xxxx,app:xxxappNamexxx,appId:IDxxx,note:xxxx}
// offerAct={prod:xxxx,offerResult:xxxx,amount:yyyy,note:xxxx,offerDate}
// orderAct={prod:xxxx,amount:yyyy,note:xxxx}
// complainAct={Type:xxxx,Desc:xxxx,Status:Open,ActionBy:xxxx,ActionDate:dd/mm/yyy hh:mm};



constructor(
  private location: Location,
) {

 }

ngOnInit() {
  this._buildForm();
}

private _buildForm() {
  // Initial Form fields
  this.form = new FormGroup({

   firstName: new FormControl(null, {
     validators: [Validators.required]
   }),
   lastName: new FormControl(null, {
     validators: [Validators.required]
   }),
   dob: new FormControl(null, {
     // validators: [Validators.required
       //  , Validators.pattern(DATE_REGEX)
     // ]
   }),
   department: new FormControl(null, {
     validators: [Validators.required]
   }),
   position: new FormControl(null, {
     validators: [Validators.required]
   }),
   officePhone: new FormControl(null, {
     // validators: [Validators.required]
   }),
   mobPhone: new FormControl(null, {
     // validators: [Validators.required]
   }),
   othEmail: new FormControl(null, {
     // validators: [Validators.required]
   }),

  });
}

ngOnDestroy() {
  // this.formChangeSub.unsubscribe();
}

  onSave() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
}


  goBack() {
    this.location.back();
  }

}
