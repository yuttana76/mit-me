import { Component, OnInit, Input } from '@angular/core';
import { fcIndCustomer } from '../model/fcIndCustomer.model';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { FcIndCustomer } from './fc-ind-customer.service';
import { Nation } from '../model/ref_nation.model';
import { ErrorStateMatcher, MatDialogRef, MatDialog } from '@angular/material';
import { ChildrenDialogComponent } from '../dialog/children-dialog/children-dialog.component';
import { PersonModel } from '../model/person.model';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';

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

  matcher = new MyErrorStateMatcher();

  childrenDialogComponent: MatDialogRef<ChildrenDialogComponent>;

  // indCustFormGroup:FormGroup;
  addr_formGroup: FormGroup;
  background_formGroup: FormGroup;


  isCollapsed = false;

  public nationList= [{"Nation_Code":"TH","Nation_Desc":"Thai"}
    ,{"Nation_Code":"JP","Nation_Desc":"Japanese"},
  ]


  public CountryList=[{"value":"TH","text":"Thailand "},{"value":"US","text":"United States of America (the)"},{"value":"JP","text":"Japan)"}]

  public CardTypeList=[
          {"value":"PASSPORT","text":"PASSPORT"},{"value":"CITIZEN_CARD","text":"บัตรประชาชน"}
                    ]
  // public CardTypeList=[{"value":"CITIZEN_CARD","text":"บัตรประชาชน"}
  //                     ,{"value":"PASSPORT","text":"PASSPORT"}
  //                   ]

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
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit() {
    this.fcIndCustomer.spouse.cardType = "CITIZEN_CARD";

    this.fcIndCustomer.re_addrData.Addr_Seq=1;
    this.fcIndCustomer.re_addrData.Addr_Seq=2;
    this.fcIndCustomer.re_addrData.Addr_Seq=3;

  }

  ngAfterViewInit(){
  }

  isPassport(){
    if(this.fcIndCustomer.identificationCardType === 'PASSPORT'){
      this.indCustFormGroup.controls["passportCountry"].setValidators(Validators.required);
      this.indCustFormGroup.controls["passportCountry"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["passportCountry"].clearValidators();
      this.indCustFormGroup.controls["passportCountry"].updateValueAndValidity();
      this.fcIndCustomer.passportCountry = "";
        return false;
    }
   }

  isTitleOther(){
    if(this.fcIndCustomer.title === 'OTHER'){
      this.indCustFormGroup.controls["titleOther"].setValidators(Validators.required);
      this.indCustFormGroup.controls["titleOther"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["titleOther"].clearValidators();
      this.indCustFormGroup.controls["titleOther"].updateValueAndValidity();
      this.fcIndCustomer.titleOther = "";
        return false;
    }
   }

   isSpoucePassport(){
    if(this.fcIndCustomer.spouse.cardType === 'PASSPORT'){
      this.indCustFormGroup.controls["spPassportCountry"].setValidators(Validators.required);
      this.indCustFormGroup.controls["spPassportCountry"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["spPassportCountry"].clearValidators();
      this.indCustFormGroup.controls["spPassportCountry"].updateValueAndValidity();
      this.fcIndCustomer.spouse.cardType = "";
        return false;
    }
   }

   isSpouceTitleOther(){
    if(this.fcIndCustomer.spouse.title === 'OTHER'){
      this.indCustFormGroup.controls["spTitleOther"].setValidators(Validators.required);
      this.indCustFormGroup.controls["spTitleOther"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["spTitleOther"].clearValidators();
      this.indCustFormGroup.controls["spTitleOther"].updateValueAndValidity();
      this.fcIndCustomer.spouse.titleOther = "";
        return false;
    }
   }

 OnCardNotExpChange($event){
  console.log(`***event.checked>>${$event.checked}`);
  if($event.checked){
    this.indCustFormGroup.controls["cardExpiryDate"].clearValidators();
    this.indCustFormGroup.controls["cardExpiryDate"].updateValueAndValidity();
    this.indCustFormGroup.controls["cardExpiryDate"].disabled;
    this.fcIndCustomer.cardExpiryDate = 'N/A';

   }else{
    this.indCustFormGroup.controls["cardExpiryDate"].enabled;
    this.indCustFormGroup.controls["cardExpiryDate"].setValidators(Validators.required);
    this.indCustFormGroup.controls["cardExpiryDate"].updateValueAndValidity();
    this.fcIndCustomer.cardExpiryDate  = "";
   }
  }


  OnSPCardNotExpChange($event){

    if($event.checked){
      this.fcIndCustomer.spouse.cardNotExp  = "Y";
      this.fcIndCustomer.spouse.cardExpDate = '';

      this.indCustFormGroup.controls["spCardExpDate"].clearValidators();
      this.indCustFormGroup.controls["spCardExpDate"].updateValueAndValidity();

     }else{
      this.indCustFormGroup.controls["spCardExpDate"].setValidators(Validators.required);
      this.indCustFormGroup.controls["spCardExpDate"].updateValueAndValidity();

      this.fcIndCustomer.spouse.cardNotExp = "N";
     }
  }

  addChildren() {

    this.childrenDialogComponent = this.dialog.open(ChildrenDialogComponent, {
      width: '600px',
      data: new PersonModel()
    });

    this.childrenDialogComponent.afterClosed().subscribe(result => {

      if(result){

        this.fcIndCustomer.children.push(result);

        // this.cddFormGroup.controls["numberChildren"].clearValidators();
        // this.cddFormGroup.controls["numberChildren"].updateValueAndValidity();
        // this.cddData.numChildren = String(this.fcIndCustomer.children.length) ;
      }

    });
  }

  removeChild(i){

    this.confirmationDialogService.confirm('ยืนยัน Confirmation', `โปรดยืนยันการลบ ข้อมูลบุตร  Please confirm delete data ?`)
    .then((confirmed) => {
      if ( confirmed ) {
        this.fcIndCustomer.children.splice(i,1);

      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

}
