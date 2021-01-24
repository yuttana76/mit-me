import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatSelectChange } from '@angular/material';
import { CrmTask } from '../model/crmTask.model';

@Component({
  selector: 'app-crm-task',
  templateUrl: './crm-task.component.html',
  styleUrls: ['./crm-task.component.scss']
})
export class CrmTaskComponent implements OnInit {

  schFormGroup: FormGroup;
  crmTaskObj: CrmTask = new CrmTask();

  actTypeList =[
    {
      code:'0',
      desc:'Please choose',
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
  // {
  //   code:'sendThingAct',
  //   desc:'ส่งเอกสาร	Send',
  // },
  {
    code:'offerAct',
    desc:'เสนอขาย(การจอง)',
  },
  // {
  //   code:'orderAct',
  //   desc:'ซื้อสินค้า	Order Taking',
  // },
  // {
  //   code:'complainAct',
  //   desc:'ร้องเรียน	Complain',
  // },
];

channelList =[ {
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


productList=[
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

feedbackResultList=[
  {
    code:'1',
    desc:'ลงทุน',
  },
  {
    code:'2',
    desc:'ไม่ลงทุน',
  },
  {
    code:'3',
    desc:'ติดตามต่อ',
  },  
]

feedbackNotList=[
  {
    code:'1',
    desc:'ไม่น่าสนใจ',
  },
  {
    code:'2',
    desc:'มีความเสี่ยงสูง',
  },
  {
    code:'3',
    desc:'ลงทุนนานเงินไป',
  },  
  {
    code:'4',
    desc:'ไม่ชอบลงทุนต่างประเทศ',
  },  
]

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
  ) { }

  ngOnInit() {

    this.schFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]

      schType: new FormControl(null, {validators: [Validators.required]}),
      // schStatus: new FormControl(null, {validators: [Validators.required]}),
      schStartDate: new FormControl(null, {validators: [Validators.required]}),
      
      note: new FormControl(null, {validators: [Validators.required]}),
      
      channel: new FormControl(null, { }),
      prodCate: new FormControl(null, { }),
      productItem: new FormControl(null, { }),

      schCloseDate: new FormControl(null, { }),
      feedbackRS: new FormControl(null, { }),
      feedbackReason: new FormControl(null, { }),
      feedbackNote: new FormControl(null, { }),
      investType: new FormControl(null, { }),
      investValue: new FormControl(null, { }),
      investDate: new FormControl(null, { }),
      


    });
  }

  activityChange(event: MatSelectChange) {

    console.log('***activityChange >>' +  event.value);

  }

}
