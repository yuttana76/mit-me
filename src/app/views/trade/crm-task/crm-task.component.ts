import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-crm-task',
  templateUrl: './crm-task.component.html',
  styleUrls: ['./crm-task.component.scss']
})
export class CrmTaskComponent implements OnInit {

  firstFormGroup: FormGroup;

  actTypeList =[
    {
    code:'callReport',
    desc:'Call report',
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

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
  ) { }

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]

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

  activityChange(event: MatSelectChange) {

    console.log('***activityChange >>' +  event.value);

  }

}
