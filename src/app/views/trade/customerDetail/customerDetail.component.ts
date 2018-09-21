import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customerDetail.component.html',
  styleUrls: ['./customerDetail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  form: FormGroup;
  spinnerLoading = false;
  
  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      custType: new FormControl(null, {
        validators: [Validators.required]
      }),
      custId: new FormControl(null, {
        validators: [Validators.required]
      }),
      bf_title_th: new FormControl(null, {
        validators: [Validators.required]
      }),
      firstName_th: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName_th: new FormControl(null, {
        validators: [Validators.required]
      }),
      bf_title_en: new FormControl(null, {
        validators: [Validators.required]
      }),
      firstName_en: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName_en: new FormControl(null, {
        validators: [Validators.required]
      }),
      dobDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      compRegisDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      mobile: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      // Census Address
      ce_addr1: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_addr2: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_country: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_province: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_districe: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_subdistrict: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_tel: new FormControl(null, null),
      ce_fax: new FormControl(null, null),
       // Mail Address
       mail_addr1: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_addr2: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_country: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_province: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_districe: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_subdistrict: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_tel: new FormControl(null, null),
      mail_fax: new FormControl(null, null),
    });
  }

  onSubmit() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
  }

}
