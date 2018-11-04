import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserFormService } from './userForm.service';
import { DATE_REGEX, TIME_REGEX, stringsToDate } from '../trade.factory';

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

  constructor(
    public userFormService: UserFormService
  ) { }

  ngOnInit() {
    this._buildForm();
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

  onSubmit() {
    console.log('SUBMITED ! ');
  }

  onSubmit2() {
    console.log('SUBMITED 2! ');
  }

  onSubmit3() {
    console.log('SUBMITED 3! ');
  }

}
