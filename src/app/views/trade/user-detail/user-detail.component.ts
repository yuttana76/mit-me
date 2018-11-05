import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserFormService } from './userForm.service';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from '../trade.factory';
import { DatePipe, Location } from '@angular/common';
import { DISABLED } from '@angular/forms/src/model';

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

  constructor(
    public userFormService: UserFormService,
    private location: Location
  ) { }

  ngOnInit() {
    this._buildForm();
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
    firstName: new FormControl(null, {
      // validators: [Validators.required]
    }),
    lastName: new FormControl(null, {
      // validators: [Validators.required]
    }),
    dobDate: new FormControl(null, {
      validators: [Validators.required
         , //Validators.pattern(DATE_REGEX)
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

  onSubmit() {
    console.log('SUBMITED ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

  }

}
