import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustType } from '../model/custType.model';
import { BeforeTitle } from '../model/before_title.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customerDetail.component.html',
  styleUrls: ['./customerDetail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  form: FormGroup;
  spinnerLoading = true;

  custType = 'P';
  asRegisterAddr = false;

  customerTypeList: CustType[] = [{ code: 'P', text: 'Personal' }, { code: 'I', text: 'Insatitute' }];
  thaiTitles: BeforeTitle[] = [
    {
      Title_Name: 'นาย'
      , Prefix_Name: 'นาย'
      , Suffix_Name: 'นาย'
    },
    {
      Title_Name: 'นาง'
      , Prefix_Name: 'นาง'
      , Suffix_Name: 'นาง'
    },
    {
      Title_Name: 'นส.'
      , Prefix_Name: 'นส.'
      , Suffix_Name: 'นส.'
    },
  ];

  engTitles: BeforeTitle[] = [
    {
      Title_Name: 'MR.'
      , Prefix_Name: 'MR.'
      , Suffix_Name: 'MR.'
    },
    {
      Title_Name: 'MRS.'
      , Prefix_Name: 'MRS.'
      , Suffix_Name: 'MRS.'
    },
    {
      Title_Name: 'MISS.'
      , Prefix_Name: 'MISS.'
      , Suffix_Name: 'MISS.'
    },
  ];

  // Customer fields
  thaiTitle: string;
  engTitle: string;

  constructor() { }

  ngOnInit() {
    console.log('Custeomer Detail  Inititial!!!');

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

      nationality: new FormControl(null, {
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
      ce_postCode: new FormControl(null, {
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
      mail_postcode: new FormControl(null, {
        validators: [Validators.required]
      }),
      mail_tel: new FormControl(null, null),
      mail_fax: new FormControl(null, null),
    });

    this.spinnerLoading = false;
  }

  ngOnDestroy() {
    console.log('Custeomer Detail  Destroy!!!');
  }

  onSubmit() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
  }

}
