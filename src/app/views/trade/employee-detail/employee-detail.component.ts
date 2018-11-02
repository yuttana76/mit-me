import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeFormService } from './employee-form.service';
import { Employee } from '../model/employee.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DATE_REGEX, TIME_REGEX, stringsToDate } from '../trade.factory';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  providers: [EmployeeFormService],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  validationMessages: any;
  employee: Employee = new Employee();
  form: FormGroup;
  formChangeSub: Subscription;

  constructor(
    public empFormSerice: EmployeeFormService
  ) { }

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
    dobDate: new FormControl(null, {
      validators: [Validators.required
         , Validators.pattern(DATE_REGEX)
      ]
    }),
   });

    // Subscribe to form value changes
    this.formChangeSub = this.form
    .valueChanges
    .subscribe(data => this._onValueChanged());

    // this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.form) { return; }
  }

  ngOnDestroy() {
    this.formChangeSub.unsubscribe();
  }
}
