import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrmPersonModel } from '../model/crmPersonal.model';
import { BehaviorSubject } from 'rxjs';

// import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking

@Component({
  selector: 'app-crm-personal-data',
  templateUrl: './crm-personal-data.component.html',
  styleUrls: ['./crm-personal-data.component.scss']
})
export class CrmPersonalDataComponent implements OnInit, OnDestroy {

  form: FormGroup;
  paramId: String = '';
  customer: CrmPersonModel = new CrmPersonModel();

   lbdu_list=[{'Code':'KF-RMF','Val':'100,000.00'}
   ,{'Code':'KFGTECHRMF', 'Val':'144,059.82'}
   ,{'Code':'KF-SSF', 'Val':'20,569.98'}
   ,{'Code':'TISCO-SSF', 'Val':'50,123.98'}
   ,{'Code':'KBANK-SSF', 'Val':'5123.98'}
  ];

  lbdu_displayedColumns: string[] = ['Code', 'Val'];
  lbdu_dataSource = new BehaviorSubject(this.lbdu_list);

  private_list=[{'Code':'PF001', 'Val':'20,000,000'}
   ,{'Code':'PF002', 'Val':'50,000,000'}
  
  ];

  private_displayedColumns: string[] = ['Code', 'Val'];
  private_dataSource = new BehaviorSubject(this.private_list);

  bond_list=[{'Code':'CHAIYO', 'Val':'1,000,000'}
   ,{'Code':'SANSIRI', 'Val':'2,000,000'}
   ,{'Code':'MAGNOLIA', 'Val':'10,000,000'}
  
  ];

  bond_displayedColumns: string[] = ['Code', 'Val'];
  bond_dataSource = new BehaviorSubject(this.bond_list);


  consent_list=[{'topic':'ยินยิมเปิดเผยข้อมูล', 'submitDate':'01/01/2020','status':'Active','action':''}
   ,{'topic':'ยินยอมให้ข้อมูลการตลาด', 'submitDate':'01/01/2020','status':'Cancel','action':''}
   ,{'topic':'ยิยยอมให้ข้อมูลจัดเก็บต่างประเทศ', 'submitDate':'01/01/2020','status':'Active','action':''}
  
  ];

  consent_displayedColumns: string[] = ['topic', 'submitDate','status','action'];
  consent_dataSource = new BehaviorSubject(this.consent_list);

  SexList =[
    {
    code:'Male',
    desc:'Male',
  },
  {
    code:'Female',
    desc:'Female',
  },
];

stateList = [{
  code:'Lead',
  desc:'Lead',
},
{
  code:'Prospect',
  desc:'Prospect',
},
{
  code:'Customer',
  desc:'Customer',
},
];

custTypeList = [{
  code:'Business',
  desc:'Business',
  },
  {
    code:'Individual',
    desc:'Individual',
  },
];

custGroupList = [{
  code:'Online',
  desc:'Online',
  },
  {
    code:'Agent',
    desc:'ตัวแทน',
  },
  {
    code:'General',
    desc:'ทั่วไป',
  },
];

interestList= [{
  code:'PF',
  desc:'PF',
  },
  {
    code:'BF',
    desc:'BF',
  },
  {
    code:'Bond',
    desc:'Bond',
  },
  {
    code:'BE',
    desc:'BE',
  },
];

SourceOfCustomerList = [{
  code:'Facebook',
  desc:'Facebook',
  },
  {
    code:'Line',
    desc:'Line',
  },
];

ReferList = [{
  code:'Pine',
  desc:'K.Pine',
  },
  {
    code:'Sale A',
    desc:'Sale A',
  },
  {
    code:'Sale B',
    desc:'Sale B',
  },
  {
    code:'Sale C',
    desc:'Sale C',
  },
];

ClassList = [{
  code:'Retail',
  desc:'Retail',
  },
  {
    code:'HNW',
    desc:'HNW',
  },
  {
    code:'U-HNW',
    desc:'U-HNW',
  },
];


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


  // ****************************** Graph

  // theme: string;
  // options = {
  //   title: {
  //     text: 'Nightingale\'s Rose Diagram',
  //     subtext: 'Mocking Data',
  //     x: 'center'
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: '{a} <br/>{b} : {c} ({d}%)'
  //   },
  //   legend: {
  //     x: 'center',
  //     y: 'bottom',
  //     data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
  //   },
  //   calculable: true,
  //   series: [
  //     {
  //       name: 'area',
  //       type: 'pie',
  //       radius: [30, 110],
  //       roseType: 'area',
  //       data: [
  //         { value: 10, name: 'rose1' },
  //         { value: 5, name: 'rose2' },
  //         { value: 15, name: 'rose3' },
  //         { value: 25, name: 'rose4' },
  //         { value: 20, name: 'rose5' },
  //         { value: 35, name: 'rose6' },
  //         { value: 30, name: 'rose7' },
  //         { value: 40, name: 'rose8' }
  //       ]
  //     }
  //   ]
  // };

  // ******************************

    // events
    public chartClicked(e: any): void {
      console.log(e);
    }

    public chartHovered(e: any): void {
      console.log(e);
    }


}
