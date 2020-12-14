import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CrmActivity } from '../model/crmActivity.model';
import { CrmContactCustAct } from '../model/crmContactCustAct.model';

@Component({
  selector: 'app-crm-activity',
  templateUrl: './crm-activity.component.html',
  styleUrls: ['./crm-activity.component.scss']
})
export class CrmActivityComponent implements  OnInit, OnDestroy  {

  contactForm: FormGroup;
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
    code:'000',
    desc:'ไม่ระบุ',
  },
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
    code:'000',
    desc:'ไม่ระบุ',
  },
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
// contactCustAct = {contactChannel:'',prodCat:'',product:'',contactDate:'',contactResult:'',nextTime:'',note:'',createBy:'',createDate:''}
contactCustAct = new CrmContactCustAct();

// meetCustAct={datetime:dd/mm/yyyy hh:mm,locate:xxxx,note:xxxx,}
// appointmentAct={subject:xxxx,startTime:dd/mm/yyyy hh:mm,endTime:dd/mm/yyyy hh:mm,note:xxxx,allDay:Y/N}
// sendGoodAct={doc:xxNamexx,path:xxxx,datetime:dd/mm/yyyy hh:mm,by:xxxx,app:xxxappNamexxx,appId:IDxxx,note:xxxx}
// offerAct={product:xxxx,offerResult:xxxx,amount:yyyy,note:xxxx,offerDate}
// orderAct={product:xxxx,amount:yyyy,note:xxxx}
// complainAct={Type:xxxx,Desc:xxxx,Status:Open,ActionBy:xxxx,ActionDate:dd/mm/yyy hh:mm};



constructor(
  private location: Location,
  ) {

 }

ngOnInit() {

  this.contact_Form();
}

private contact_Form() {

this.contactForm = new FormGroup({

    contactChannel: new FormControl(null, {
     validators: [Validators.required]
   }),
   prodCat: new FormControl(null, {
     validators: [Validators.required]
   }),
   product: new FormControl(null, {
    //  validators: [Validators.required]
   }),
   contactDate: new FormControl(null, {
     validators: [Validators.required
        // , Validators.pattern(DATE_REGEX)
     ]
   }),
   contactResult: new FormControl(null, {
     validators: [Validators.required]
   }),
   nextTime: new FormControl(null, {
    //  validators: [Validators.required]
   }),
   note: new FormControl(null, {
     validators: [Validators.required]
   }),
   createBy: new FormControl(null, {
     // validators: [Validators.required]
   }),
   createDate: new FormControl(null, {
     // validators: [Validators.required]
   }),

  });
}

public hasError = (controlName: string, errorName: string) =>{
  return this.contactForm.controls[controlName].hasError(errorName);
}


ngOnDestroy() {
  // this.formChangeSub.unsubscribe();
}

onSave() {

    if (this.contactForm.invalid) {
      console.log('form.invalid() ' + this.contactForm.invalid);
      return true;
    }
}


  goBack() {
    this.location.back();
  }

}
