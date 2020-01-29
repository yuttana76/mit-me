import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Customer } from '../model/customer.model';
import { OpenAccount } from '../model/openAccount.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { AddrCustModel } from '../model/addrCust.model';
import { fcIndCustomer } from '../model/fcIndCustomer.model';
import { OnlineProcessService } from '../services/onlineProcess.service';
import { OpenAccountFormService } from './open-account.service';
import { FCoccupation } from '../model/fcOccupation.model';
import { MasterDataService } from '../services/masterData.service';
import { ShareDataService } from '../services/shareData.service';
import { FCincomeSource } from '../model/fcIncomeSource.model';
import { FCbusinessType } from '../model/fcBusinessType.model';
import { FCincomeLevel } from '../model/fcIncomeLevel.model';
import { MatDialogRef, MatDialog } from '@angular/material';
import { BankAccountDialogComponent } from '../dialog/bank-account-dialog/bank-account-dialog.component';
import { BankAccountModel } from '../model/bankAccount.model';
import { MatRadioChange } from '@angular/material';

@Component({
    selector: 'app-open-account',
    templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss']
})
export class OpenAccountComponent implements OnInit {


  isLinear = true;
  reqNDID = false;
  SEQ_REG_ADDR = 1;
  SEQ_CURR_ADDR = 2;
  SEQ_WORK_ADDR = 3;
  SEQ_MAIL_ADDR = 4;

  // openAccount = new OpenAccount();
  public fcIndCustomer: fcIndCustomer = new fcIndCustomer();

  firstFormGroup: FormGroup;
  // fillFormGroup: FormGroup;
  indCustFormGroup: FormGroup;
  register_formGroup: FormGroup;
  work_formGroup: FormGroup;
  current_formGroup: FormGroup;
  mail_formGroup: FormGroup;
  redemption_formGroup: FormGroup;

  bankAccountDialogComponent: MatDialogRef<BankAccountDialogComponent>;

  public register_addrData: AddrCustModel = new AddrCustModel();
  public work_addrData: AddrCustModel = new AddrCustModel();
  public current_addrData: AddrCustModel = new AddrCustModel();
  public mail_addrData: AddrCustModel = new AddrCustModel();

  occupationList: FCoccupation[];
  incomeSourceList: FCincomeSource[];
  businessTypeList: FCbusinessType[];
  incomeList: FCincomeLevel[];
  investObjectList: CodeLookup[];


  constructor(private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    public formService: OpenAccountFormService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private onlineProcessService: OnlineProcessService,
    private masterDataService:MasterDataService,
    public shareDataService: ShareDataService,

    ) {}

  ngOnInit() {

    //Master data initial
    this.masterDataService.getFCoccupation().subscribe((data: any[]) => {
      this.occupationList = data;
    });
    this.masterDataService.getFCincomeSource().subscribe((data: any[]) => {
      this.incomeSourceList = data;
    });
    this.masterDataService.getFCbusinessType().subscribe((data: any[]) => {
      this.businessTypeList = data;
    });
    this.masterDataService.getFCincomeLevel().subscribe((data: any[]) => {
      this.incomeList = data;
    });

     // Initial data
     this.masterDataService.getCodeLookup("INVObject").subscribe((data: any[]) => {
      this.investObjectList = data;
    });

    // Form control initial
    this.firstFormGroup = this._formBuilder.group({
      identifier: ['', Validators.required]
    });

    this.indCustFormGroup =new FormGroup({
      identificationCardType: new FormControl(null, {
        validators: [Validators.required]
      }),
      passportCountry: new FormControl(null, {
        // validators: [Validators.required]
      }),
      cardNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
      cardExpiryDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      gender: new FormControl(null, {
        validators: [Validators.required]
      }),
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      titleOther: new FormControl(null, {
        // validators: [Validators.required]
      }),
      thFirstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      thLastName: new FormControl(null, {
        validators: [Validators.required]
      }),
      enFirstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      enLastName: new FormControl(null, {
        validators: [Validators.required]
      }),
      mobileNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required,
          Validators.email,]
      }),
      birthDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      nationality: new FormControl(null, {
        validators: [Validators.required]
      }),
      maritalStatus: new FormControl(null, {
        validators: [Validators.required]
      }),

      // Spouce
      spCardType: new FormControl(null, {
        // validators: [Validators.required]
      }),
      spCardNumber: new FormControl(null, {
        // validators: [Validators.required]
      }),

      spPassportCountry: new FormControl(null, {
        // validators: [Validators.required]
      }),

      spCardExpDate: new FormControl(null, {
        // validators: [Validators.required]
      }),

      spCardNotExp: new FormControl(null, {
        // validators: [Validators.required]
      }),

      spTitle: new FormControl(null, {
        // validators: [Validators.required]
      }),
      spTitleOther: new FormControl(null, {
        // validators: [Validators.required]
      }),
      spFirstName: new FormControl(null, {
        // validators: [Validators.required]
      }),
      spLastName: new FormControl(null, {
        // validators: [Validators.required]
      }),
      spTelephone: new FormControl(null, {
        // validators: [Validators.required]
      }),

      occupation: new FormControl(null, {
        validators: [Validators.required]
      }),
      occupationOth: new FormControl(null, {
        // validators: [Validators.required]
      }),
      incomeSource: new FormControl(null, {
        validators: [Validators.required]
      }),
      incomeSourceOth: new FormControl(null, {
        // validators: [Validators.required]
      }),
      typeBusiness: new FormControl(null, {
        validators: [Validators.required]
      }),
      typeBusinessOth: new FormControl(null, {
        // validators: [Validators.required]
      }),
      monthlyIncomeLevel: new FormControl(null, {
        validators: [Validators.required]
      }),
      moneyLaundaring: new FormControl(null, {
        validators: [Validators.required]
      }),
      politicalRelate: new FormControl(null, {
        validators: [Validators.required]
      }),
      rejectFinancial: new FormControl(null, {
        validators: [Validators.required]
      }),

    });


  //  Initial register_formGroup
  this.register_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),

    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),


    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    }),

    work_addrData: new FormControl(null, {
      validators: [Validators.required]
    }),
    cur_addrData: new FormControl(null, {
      validators: [Validators.required]
    }),
  });

  this.work_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),

    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    }),
  });

  this.current_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),

    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    }),
  });

  this.mail_formGroup = new FormGroup({
    MailSameAs: new FormControl(null, {
      validators: [Validators.required]
    }),
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),

    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    })
  });


    this.redemption_formGroup = new FormGroup({
    redemptionkAccountsSameAs: new FormControl(null, {
      validators: [Validators.required]
    }),
  });


  }

  onFillFormClick(){
    const controls = this.indCustFormGroup.controls;
    for (const name in controls) {
      console.log(" Controls >>" + name);
        if (controls[name].invalid) {
            console.log(" *** Invalid >>" + name);

        }
    }
  }

  onSubmit(){

    console.log('**SUBMITED >>');
    console.log('**indCustFormGroup.invalid >>' + this.indCustFormGroup.invalid);

    this.onlineProcessService.saveAccount(this.fcIndCustomer).subscribe(
      (rs: any) => {
      console.log('Result saveAccount() >>' + JSON.stringify(rs));
    });

    // this.confirmationDialogService.confirm('Confirmation', ` Please confirm your data before submit. `)
    // .then((confirmed) => {
    //   console.log('Confirm >>' + confirmed);

    //   if ( confirmed ) {

    //     console.log(' fcIndCustomer >>' + JSON.stringify(this.fcIndCustomer));

    //     this.toastr.success("Open account was successful." , "Successful", {
    //       timeOut: 3000,
    //       closeButton: true,
    //       positionClass: "toast-top-center"
    //     });

    //   }
    // });
  }

  onClose(){
    console.log('**onClose >>');
  }

  ndidDone(currentAcc){
    console.log("NDID DATA>>" + JSON.stringify(currentAcc));

  }


  workAddrOnChange(val){
    if(val ==='1'){
      this.work_addrData = Object.assign({}, this.register_addrData);
      this.register_formGroup.removeControl('work_formGroup');

    }else { // Other
      this.work_addrData = new AddrCustModel();
      this.register_formGroup.addControl('work_formGroup', this.work_formGroup);
      this.work_formGroup.setParent(this.register_formGroup);
    }
    this.work_addrData.Addr_Seq = this.SEQ_WORK_ADDR;
    this.work_addrData.SameAs = val;
    this.work_addrData.Country_Id=0;

    // Check which components are in validation
    if (this.work_formGroup.invalid) {
      this.work_formGroup.enable();
      const controls = this.work_formGroup.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.work_formGroup.controls[name].markAsTouched();
          }
      }
    }
  }


  currAddrOnChange(val){
    if(val ==='1'){
      this.current_addrData = Object.assign({}, this.register_addrData);
      this.register_formGroup.removeControl('current_formGroup');
    } else if ( val === '3'){
      this.current_addrData = Object.assign({}, this.work_addrData);
      this.register_formGroup.removeControl('current_formGroup');

    } else { // Other
      this.current_addrData = new AddrCustModel();
      this.register_formGroup.addControl('current_formGroup', this.current_formGroup);
      this.current_formGroup.setParent(this.register_formGroup);

    }

    this.current_addrData.SameAs = val;
    this.current_addrData.Addr_Seq = this.SEQ_CURR_ADDR;
    this.current_addrData.Country_Id=0;

    // Check which components are in validation
    if (this.current_formGroup.invalid) {
      this.current_formGroup.enable();
      const controls = this.current_formGroup.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.current_formGroup.controls[name].markAsTouched();
          }
      }
    }
  }


  mailAddrOnChange(val){

    if(val === 'email'){

    } else if(val === 'reg'){
      this.mail_addrData = Object.assign({}, this.register_addrData);
      this.register_formGroup.removeControl('mail_formGroup');
    } else if ( val === 'work'){
      this.mail_addrData = Object.assign({}, this.work_addrData);
      this.register_formGroup.removeControl('mail_formGroup');
    } else if ( val === 'curr'){
      this.mail_addrData = Object.assign({}, this.current_addrData);
      this.register_formGroup.removeControl('mail_formGroup');
    } else { // 9:Other
      this.mail_addrData = new AddrCustModel();

      this.register_formGroup.addControl('mail_formGroup', this.mail_formGroup);
      this.mail_formGroup.setParent(this.register_formGroup);

      // Default value
      this.mail_addrData.Country_Id=0;

    }

    this.fcIndCustomer.MailSameAs = val;
    this.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;

    if(val === 'email'){
      this.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;
      // Check which components are in validation
      if (this.mail_formGroup.invalid) {
        this.mail_formGroup.enable();
        const controls = this.mail_formGroup.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                this.mail_formGroup.controls[name].markAsTouched();
            }
        }
      }
    }
  }

  isOccupationOther(){
    if(this.fcIndCustomer.occupationId ===  this.shareDataService.OCCUPATION_FC_OTHER){
      this.indCustFormGroup.controls["occupationOth"].setValidators(Validators.required);
      this.indCustFormGroup.controls["occupationOth"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["occupationOth"].clearValidators();
      this.indCustFormGroup.controls["occupationOth"].updateValueAndValidity();
      this.fcIndCustomer.occupationOther = "";
      return false;
    }
   }

   isIncomeSource(){

    if(this.fcIndCustomer.incomeSource.includes(this.shareDataService.INCOMESOURCE_FC_OTHER)){
      this.indCustFormGroup.controls["incomeSourceOth"].setValidators(Validators.required);
      this.indCustFormGroup.controls["incomeSourceOth"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["incomeSourceOth"].clearValidators();
      this.indCustFormGroup.controls["incomeSourceOth"].updateValueAndValidity();
      this.fcIndCustomer.incomeSourceOther = "";
      return false;
    }
   }

   isinvestmentObjective(){

    if(this.fcIndCustomer.investmentObjective.includes(this.shareDataService.investmentObjective_FC_OTHER)){
      // this.indCustFormGroup.controls["incomeSourceOth"].setValidators(Validators.required);
      // this.indCustFormGroup.controls["incomeSourceOth"].updateValueAndValidity();
      return true;
    }else{
      // this.indCustFormGroup.controls["incomeSourceOth"].clearValidators();
      // this.indCustFormGroup.controls["incomeSourceOth"].updateValueAndValidity();
      this.fcIndCustomer.investmentObjectiveOther = "";
      return false;
    }
   }

   isBusinessTypeOther(){
    if(this.fcIndCustomer.businessTypeId === this.shareDataService.BUSINESSTYPE_FC_OTHER){
      this.indCustFormGroup.controls["typeBusinessOth"].setValidators(Validators.required);
      this.indCustFormGroup.controls["typeBusinessOth"].updateValueAndValidity();
      return true;
    }else{
      this.indCustFormGroup.controls["typeBusinessOth"].clearValidators();
      this.indCustFormGroup.controls["typeBusinessOth"].updateValueAndValidity();
      this.fcIndCustomer.businessTypeOther = "";
      return false;
    }
 }


 addSubscriptionAccounts() {

  this.bankAccountDialogComponent = this.dialog.open(BankAccountDialogComponent, {
    width: '600px',
    data: new BankAccountModel()
  });

  this.bankAccountDialogComponent.afterClosed().subscribe(result => {
    if(result){
      this.fcIndCustomer.subscriptionBankAccounts.push(result);
    }
  });
}


editSubscriptionAccounts(i) {

  this.bankAccountDialogComponent = this.dialog.open(BankAccountDialogComponent, {
    width: '600px',
    data: this.fcIndCustomer.subscriptionBankAccounts[i]
  });

  this.bankAccountDialogComponent.afterClosed().subscribe(data => {
    if(data){
      // this.fcIndCustomer.subscriptionBankAccounts.push(result);
      this.fcIndCustomer.subscriptionBankAccounts[i]=data;
    }
  });
}

addRedemptionAccount() {

  this.bankAccountDialogComponent = this.dialog.open(BankAccountDialogComponent, {
    width: '600px',
    data: new BankAccountModel()
  });

  this.bankAccountDialogComponent.afterClosed().subscribe(result => {
    if(result){
      this.fcIndCustomer.redemptionBankAccounts.push(result);
    }
  });
}


redempAccountAs($event: MatRadioChange){
  console.log('redempAccountAs()'+$event.value);

  if($event.value ==='SUB'){
    // this.fcIndCustomer.redemptionBankAccounts = Object.assign({}, this.fcIndCustomer.subscriptionBankAccounts);
    this.fcIndCustomer.redemptionBankAccounts = this.fcIndCustomer.subscriptionBankAccounts.map(x => Object.assign({}, x));
    // this.fcIndCustomer.subscriptionBankAccounts;
  }else{
    this.fcIndCustomer.redemptionBankAccounts = [];
  }

}

subAccount(i){
  this.confirmationDialogService.confirm('ยืนยัน Confirmation', `โปรดยืนยันการลบ บัญชี Subscription Please confirm delete data ?`)
  .then((confirmed) => {
    if ( confirmed ) {
      this.fcIndCustomer.subscriptionBankAccounts.splice(i,1);
    }
  }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
}

redeamAccount(i){
  this.confirmationDialogService.confirm('ยืนยัน Confirmation', `โปรดยืนยันการลบ บัญชี Redemption Please confirm delete data ?`)
  .then((confirmed) => {
    if ( confirmed ) {
      this.fcIndCustomer.redemptionBankAccounts.splice(i,1);
    }
  }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
}

}
