import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserFormService } from './userForm.service';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from '../trade.factory';
import { DatePipe, Location } from '@angular/common';
import { DISABLED } from '@angular/forms/src/model';
import { Department } from '../model/department.model';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  validationMessages: any;
  user: User = new User();
  form: FormGroup;
  formChangeSub: Subscription;
  isDisableFields = false;

  private mode = this.userFormService.MODE_CREATE;

  public statusList = this.userFormService.statusList;
  departmentList: Department[] = [];

  constructor(
    public userFormService: UserFormService,
    private departmentService: DepartmentService,
    private location: Location
  ) { }

  ngOnInit() {

    this._buildForm();

    this.departmentService.getDepartment().subscribe((data: any[]) => {
      this.departmentList = data;
    });
  }

  goBack() {
    this.location.back();
  }

  private _buildForm() {
   // Initial Form fields
   this.form = new FormGroup({
    loginName: new FormControl(null, {
      validators: [Validators.required]
    }),
    email: new FormControl(null, {
      validators: [Validators.required]
    }),
    status: new FormControl(null, {
      validators: [Validators.required]
    }),
    empDate: new FormControl(null, {
      // validators: [Validators.required]
    }),
    expDate: new FormControl(null, {
      // validators: [Validators.required]
    }),
    firstName: new FormControl(null, {
      validators: [Validators.required]
    }),
    lastName: new FormControl(null, {
      validators: [Validators.required]
    }),
    dobDate: new FormControl(null, {
      validators: [Validators.required
        //  , Validators.pattern(DATE_REGEX)
      ]
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

  onSubmit() {
    console.log('SUBMITED ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

  }

}
