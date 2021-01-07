import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CrmActivity } from '../model/crmActivity.model';
import { CrmContactCustAct } from '../model/crmContactCustAct.model';
import { MatSelectChange } from '@angular/material';


@Component({
  selector: 'app-crm-activity',
  templateUrl: './crm-activity.component.html',
  styleUrls: ['./crm-activity.component.scss']
})
export class CrmActivityComponent implements  OnInit, OnDestroy  {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  activityForm: FormGroup;
  feedbackForm: FormGroup;

  contactForm: FormGroup;
  meetCusForm: FormGroup;
  appointmentForm: FormGroup;
  offerForm: FormGroup;
  orderForm: FormGroup;
  complainForm: FormGroup;


  paramId: String = '';
  activityObj: CrmActivity = new CrmActivity();

  actTypeList =[
    {
    code:'generalAct',
    desc:'ทั่วไป	General',
  },
  {
    code:'contactCustAct',
    desc:'ติดต่อลูกค้า	Contact ',
  },
  {
    code:'meetCustAct',
    desc:'พบลูกค้า	Meet customer',
  },
  {
    code:'appointmentAct',
    desc:'นัดหมาย	Appointment',
  },
  {
    code:'sendThingAct',
    desc:'ส่งเอกสาร	Send',
  },
  {
    code:'offerAct',
    desc:'เสนอขาย(การจอง)',
  },
  {
    code:'orderAct',
    desc:'ซื้อสินค้า	Order Taking',
  },
  {
    code:'complainAct',
    desc:'ร้องเรียน	Complain',
  },
];

actStatusList =[
  {
  code:'1',
  desc:'enable',
  },
  {
  code:'0',
  desc:'disable',
  },
];

Feedback=[
  {
  code:'1',
  desc:'ลูกค้าสนใจ',
  },
  {
  code:'2',
  desc:'ลูกค้าไม่สนใจ',
  },
  {
  code:'3',
  desc:'ลูกค้ายังไม่แน่ใจ',
  },
  {
  code:'0',
  desc:'อื่นๆ',
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

offerResults=[
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

compTypeList=[
  {
    code:'1',
    desc:'ทั่วไป',
  },
  {
    code:'2',
    desc:'สินค้า',
  },
  {
    code:'3',
    desc:'การติดต่อ',
  },
  {
    code:'4',
    desc:'บริการ',
  },

]

compStatus=[
  {
    code:'1',
    desc:'Open',
  },
  {
    code:'2',
    desc:'Close',
  },
  {
    code:'3',
    desc:'Pending',
  },
  {
    code:'4',
    desc:'On Process',
  },

]


assignTo=[
  {
    code:'1',
    desc:'Sale A',
  },
  {
    code:'2',
    desc:'Sale B',
  },
  {
    code:'3',
    desc:'Sale C',
  },
  {
    code:'4',
    desc:'Sale D',
  },

]


constructor(
  private _formBuilder: FormBuilder,
  private location: Location,
  ) {}

ngOnInit() {
  this.build_activity_Form();

  this.build_feedback_Form();
  this.build_contact_Form();
  this.build_meetCust_Form();
  this.build_appointment_Form();
  this.build_offer_Form();
  this.build_order_Form();
  this.build_complain_Form();

  this.firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required]
  });
  this.secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required]
  });

}

activityChange(event: MatSelectChange) {

  console.log('***activityChange >>' +  event.value);

}

private build_activity_Form() {
  this.activityForm = new FormGroup({

   actType: new FormControl(null, {
     validators: [Validators.required]
   }),

   actStatus: new FormControl(null, {
     validators: [Validators.required]
   }),
   remindDateTime: new FormControl(null, { }),
   description: new FormControl(null, {
     validators: [Validators.required
     ]
   }),
   feedback: new FormControl(null, {
     validators: [Validators.required]
   }),
   feedbackOth: new FormControl(null, { }),
   attachFiles: new FormControl(null, {  }),
   assignTo: new FormControl(null, {  }),
  });
}

private build_feedback_Form() {
  this.feedbackForm = new FormGroup({

   feedback: new FormControl(null, {
     validators: [Validators.required]
   }),
   feedbackOth: new FormControl(null, { }),
   attachFiles: new FormControl(null, {  }),
   assignTo: new FormControl(null, {  }),
  });
}

private build_contact_Form() {
  this.contactForm = new FormGroup({
    contactChannel: new FormControl(null, {
     validators: [Validators.required]
   }),
   prodCat: new FormControl(null, {
     validators: [Validators.required]
   }),
   product: new FormControl(null, { }),
   contactDate: new FormControl(null, {
     validators: [Validators.required
        // , Validators.pattern(DATE_REGEX)
     ]
   }),
   contactResult: new FormControl(null, {
     validators: [Validators.required]
   }),
   nextTime: new FormControl(null, { }),
   note: new FormControl(null, {  }),
  });
}

// meetCustAct{meetDate:dd/mm/yyyy hh:mm,locate:xxxxnote:xxxx,note:xxxx}
private build_meetCust_Form() {
  this.meetCusForm = new FormGroup({
    meetDate: new FormControl(null, {
     validators: [Validators.required]
   }),
   locate: new FormControl(null, {
     validators: [Validators.required]
   }),
   note: new FormControl(null, { }),

  });
}

private build_appointment_Form() {

  this.appointmentForm = new FormGroup({

   subject: new FormControl(null, {
     validators: [Validators.required]
   }),
   startTime: new FormControl(null, {
     validators: [Validators.required]
   }),
   endTime: new FormControl(null, {
     validators: [Validators.required]
   }),
   note: new FormControl(null, { }),
   allDay: new FormControl(null, { }),
  });
}

// offerAct{product:xxxx,offerResult:xxxx,value:yyyy,amount:xxxx,note:xxxx,offerDate}
private build_offer_Form() {

  this.offerForm = new FormGroup({
      product: new FormControl(null, {
      validators: [Validators.required]
    }),
    offerResult: new FormControl(null, {
      validators: [Validators.required]
    }),
    amount: new FormControl(null, {
      //  validators: [Validators.required]
    }),
    volumn: new FormControl(null, {
      //  validators: [Validators.required]
    }),
    offerDate_: new FormControl(null, {
      validators: [Validators.required]
    }),
    note: new FormControl(null, {
      // validators: [Validators.required]
    }),
  });
}

private build_order_Form() {

  this.orderForm = new FormGroup({

    product: new FormControl(null, {
     validators: [Validators.required]
   }),
   amount: new FormControl(null, {
    //  validators: [Validators.required]
   }),
   volumn: new FormControl(null, {
    //  validators: [Validators.required]
   }),
   orderDate: new FormControl(null, {
    //  validators: [Validators.required]
   }),
   note: new FormControl(null, { }),
  });
}

private build_complain_Form() {

  this.complainForm = new FormGroup({

    compType: new FormControl(null, {
     validators: [Validators.required]
   }),
   desc: new FormControl(null, {
     validators: [Validators.required]
   }),
   status: new FormControl(null, {
     validators: [Validators.required]
   }),
   assignTo: new FormControl(null, {
    //  validators: [Validators.required]
   }),
   assignDate: new FormControl(null, { }),
   note: new FormControl(null, { }),
  });
}


ngOnDestroy() {
  // this.formChangeSub.unsubscribe();
}

goBack() {
  this.location.back();
}

public contactSubmited = (formValue) => {
  if (this.contactForm.valid) {
    this.exe_ContactAct(formValue);
  }
}

public meetCusFormSubmited = (formValue) => {
  if (this.meetCusForm.valid) {
    this.exe_ContactAct(formValue);
  }
}

public appointmentFormSubmited = (formValue) => {
  if (this.appointmentForm.valid) {
    this.exe_ContactAct(formValue);
  }
}

public offerFormSubmited = (formValue) => {
  if (this.offerForm.valid) {
    this.exe_ContactAct(formValue);
  }
}

public orderFormSubmited = (formValue) => {
  if (this.orderForm.valid) {
    this.exe_ContactAct(formValue);
  }
}

public complainFormSubmited = (formValue) => {
  if (this.complainForm.valid) {
    this.exe_ContactAct(formValue);
  }
}

// public contactReset = () => {
//   this.contactForm.reset();
// }

  private exe_ContactAct = (formValue) => {

    // let owner: OwnerForCreation = {
    //   name: ownerFormValue.name,
    //   dateOfBirth: ownerFormValue.dateOfBirth,
    //   address: ownerFormValue.address
    // }

    console.log(`***Form data -> ${JSON.stringify(formValue)}`)
  }

  // private exe_MeetCustAct = (formValue) => {
  //   console.log(`***Meeting cust data -> ${JSON.stringify(formValue)}`)
  // }


}
