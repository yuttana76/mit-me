import { Component, OnInit, Input } from '@angular/core';
import { fcIndCustomer } from '../model/fcIndCustomer.model';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { FcIndCustomer } from './fc-ind-customer.service';
import { Nation } from '../model/ref_nation.model';
import { ErrorStateMatcher } from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-fc-ind-customer',
  templateUrl: './fc-ind-customer.component.html',
  styleUrls: ['./fc-ind-customer.component.scss']
})
export class FcIndCustomerComponent implements OnInit  {

  @Input() fcIndCustomer: fcIndCustomer;
  @Input() indCustFormGroup: FormGroup;
  @Input() re_addrFormGroup: FormGroup;
  @Input() cu_addrFormGroup: FormGroup;
  @Input() wk_addrFormGroup: FormGroup;
  @Input() accountType ='IND';


  // matcher = new MyErrorStateMatcher();

  // indCustFormGroup:FormGroup;
  addr_formGroup: FormGroup;
  background_formGroup: FormGroup;


  isCollapsed = false;

  public nationList= [{"Nation_Code":"TH","Nation_Desc":"Thai"}
    ,{"Nation_Code":"JP","Nation_Desc":"Japanese"},
  ]

  public CardTypeList=[{"value":"PASSPORT","text":"PASSPORT"},{"value":"CITIZEN_CARD","text":"บัตรประชาชน"}]
  public GenderList=[{"value":"Male","text":"Male"},{"value":"Female","text":"Female"}]

  public TitleList=[{"value":"MR","text":"MR"}
  ,{"value":"MRS","text":"MRS"}
  ,{"value":"MRS","text":"MRS"}
  ,{"value":"MISS","text":"MISS"}
  ,{"value":"OTHER","text":"OTHER"}
];

public MaritalStatusList=[{"value":"Single","text":"Single"}
,{"value":"Married","text":"Married"}
,{"value":"Divorced","text":"Divorced"}
,{"value":"Widowhood","text":"Widowhood"}
]

  constructor(
    public formService: FcIndCustomer,
    // private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    // this.indCustFormGroup =new FormGroup({
    //   identificationCardType: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   cardNumber: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   cardExpiryDate: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   gender: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   title: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   thFirstName: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   thLastName: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   enFirstName: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   enLastName: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   mobileNumber: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   email: new FormControl(null, {
    //     validators: [Validators.required,
    //       Validators.email,]
    //   }),
    //   birthDate: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   nationality: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   maritalStatus: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    // });

    // this.addr_formGroup = new FormGroup({
    //   Addr_No: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Moo: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Place: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Floor: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Soi: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Road: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Tambon_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Amphur_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Province_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Country_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Country_oth: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),

    //   Zip_Code: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Tel: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Fax: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    // });

    // this.background_formGroup = new FormGroup({
    //   email: new FormControl(null, {
    //     validators: [Validators.required,
    //       Validators.email,]
    //   }),
    // });

    // this.FCAccountInd.re_addrData.Addr_Seq = 1;
    this.fcIndCustomer.re_addrData.Addr_Seq=1;
    this.fcIndCustomer.re_addrData.Addr_Seq=2;
    this.fcIndCustomer.re_addrData.Addr_Seq=3;
  }

}
