import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrmPersonModel } from '../model/crmPersonal.model';

@Component({
  selector: 'app-crm-personal-data',
  templateUrl: './crm-personal-data.component.html',
  styleUrls: ['./crm-personal-data.component.scss']
})
export class CrmPersonalDataComponent implements OnInit, OnDestroy {

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

typeList = [{
  code:'Business',
  desc:'Business',
},
{
  code:'Individual',
  desc:'Individual',
},
];

// customerGroupList = [{
//   code:'Online',
//   desc:'Online',
// },
// {
//   code:'General',
//   desc:'General',
// },
// {
//   code:'Agency',
//   desc:'Agency',
// },
// ];


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

  onAddNew() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
}

  onUpdate() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
}

  goBack() {
    this.location.back();
  }

}
