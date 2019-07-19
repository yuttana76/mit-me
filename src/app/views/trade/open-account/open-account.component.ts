import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../model/customer.model';
import { OpenAccount } from '../model/openAccount.model';

@Component({
  selector: 'app-open-account',
  templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss']
})
export class OpenAccountComponent implements OnInit {

  isLinear = true;
  openAccount = new OpenAccount();

  firstFormGroup: FormGroup;
  fillFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      identifier: ['', Validators.required]
    });
    this.fillFormGroup = this._formBuilder.group({
      identifier: ['', Validators.required],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      cardIssueDate: ['', Validators.required],
      cardExpDate: ['', Validators.required],
      nationality: ['', Validators.required],
    });

    this.fillFormGroup.controls['identifier'].disable();
  }

}
