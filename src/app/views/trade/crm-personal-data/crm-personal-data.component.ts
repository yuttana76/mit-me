import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrmPersonModel } from '../model/crmPersonal.model';

// import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking

@Component({
  selector: 'app-crm-personal-data',
  templateUrl: './crm-personal-data.component.html',
  styleUrls: ['./crm-personal-data.component.scss']
})
export class CrmPersonalDataComponent implements OnInit, OnDestroy {

  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth'
  // };

  form: FormGroup;
  paramId: String = '';
  customer: CrmPersonModel = new CrmPersonModel();

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


  // Doughnut
  public doughnutChartLabels: string[] = ['Private Fund', 'Bond', 'LBDU'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType = 'doughnut';


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
