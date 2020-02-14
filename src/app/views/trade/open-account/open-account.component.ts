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
import { MatDialogRef, MatDialog, MatStepper } from '@angular/material';
import { BankAccountDialogComponent } from '../dialog/bank-account-dialog/bank-account-dialog.component';
import { BankAccountModel } from '../model/bankAccount.model';
import { MatRadioChange } from '@angular/material';
import { OpenAccService } from '../services/openAcc.service';
import { JsonPipe } from '@angular/common';
import { rS } from '@angular/core/src/render3';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-open-account',
    templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss']
})
export class OpenAccountComponent implements OnInit {

  isLinear = true;
  reqNDID = false;
  spinnerLoading = false;

  SEQ_REG_ADDR = 1;
  SEQ_CURR_ADDR = 2;
  SEQ_WORK_ADDR = 3;
  SEQ_MAIL_ADDR = 4;

  CAN_ENTRY_OTP = true;
  opt_code;

  AS_RESIDENCE = 'Residence';
  AS_WORK = 'Work';

  MAS_INV = "INVObject";

  firstFormGroup: FormGroup;
  // fillFormGroup: FormGroup;
  indCustFormGroup: FormGroup;
  register_formGroup: FormGroup;
  work_formGroup: FormGroup;
  current_formGroup: FormGroup;
  mail_formGroup: FormGroup;
  redemption_formGroup: FormGroup;

  bankAccountDialogComponent: MatDialogRef<BankAccountDialogComponent>;

  public fcIndCustomer: fcIndCustomer = new fcIndCustomer();

  // public register_addrData: AddrCustModel = new AddrCustModel();
  // public work_addrData: AddrCustModel = new AddrCustModel();
  // public current_addrData: AddrCustModel = new AddrCustModel();
  // public mail_addrData: AddrCustModel = new AddrCustModel();

  occupationList: FCoccupation[];
  incomeSourceList: FCincomeSource[];
  businessTypeList: FCbusinessType[];
  incomeList: FCincomeLevel[];
  investObjectList: CodeLookup[];


  constructor(private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    public formService: OpenAccountFormService,
    private toastr: ToastrService,
    public authService: AuthService,
    private confirmationDialogService: ConfirmationDialogService,
    // private openAccService: OpenAccService,
    private masterDataService:MasterDataService,
    public shareDataService: ShareDataService,
    public openAccService : OpenAccService,

    ) {}

  ngOnInit() {



    //Master data initial
    // this.masterDataService.getFCoccupation().subscribe((data: any[]) => {
    //   // this.occupationList = data;
    // });
    // this.masterDataService.getFCincomeSource().subscribe((data: any[]) => {
    //   this.incomeSourceList = data;
    // });
    // this.masterDataService.getFCbusinessType().subscribe((data: any[]) => {
    //   this.businessTypeList = data;
    // });
    // this.masterDataService.getFCincomeLevel().subscribe((data: any[]) => {
    //   this.incomeList = data;
    // });

    //  // Initial data
    //  this.masterDataService.getCodeLookup("INVObject").subscribe((data: any[]) => {
    //   this.investObjectList = data;
    // });



    // Form control initial
    // this.firstFormGroup = this._formBuilder.group({
    //   identificationCardType: ['', Validators.required],
    //   identifier: ['', Validators.required],
    //   mobileNumber: [''],
    //   opt_code: [''],
    // });


    this.firstFormGroup =new FormGroup({
      identificationCardType: new FormControl(null, {
        validators: [Validators.required]
      }),
      identifier: new FormControl(null, {
        validators: [Validators.required]
      }),
      mobileNumber: new FormControl(null, {
        // validators: [Validators.required]
      }),
      opt_code: new FormControl(null, {
        // validators: [Validators.required]
      }),
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
    mailSameAs: new FormControl(null, {
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

   if(this.authService.isExternalUser){
      this.firstFormGroup.controls["mobileNumber"].setValidators(Validators.required);
      this.firstFormGroup.controls["mobileNumber"].updateValueAndValidity();
    }

    this.openAccService.getMasterData(this.MAS_INV).subscribe(res => {
      this.occupationList = res[0].result;
      this.incomeSourceList = res[1].result;
      this.businessTypeList = res[2].result;
      this.incomeList = res[3].result;
      this.investObjectList= res[4].result;
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

  openAccountSubmit(){

    var create_By = this.authService.getUserData() || 'NONE';


    // Check work address
    if(this.fcIndCustomer.workAddressSameAsFlag === this.AS_RESIDENCE){
      this.fcIndCustomer.work = Object.assign({}, this.fcIndCustomer.residence);
    }

    // Check current address
    if(this.fcIndCustomer.currentAddressSameAsFlag === this.AS_RESIDENCE ){
      this.fcIndCustomer.current = Object.assign({}, this.fcIndCustomer.residence);
    }else if(this.fcIndCustomer.currentAddressSameAsFlag === this.AS_WORK ){
      this.fcIndCustomer.current = Object.assign({}, this.fcIndCustomer.work);
    }

    this.openAccService.openAccount(this.fcIndCustomer,create_By).subscribe(
      (res: any) => {
      // console.log('Result saveAccount() >>' + JSON.stringify(res));

      if(res && res["code"]==='0'){
        this.toastr.success("Save account information", "Complete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

      }else{
        this.toastr.warning(res.message, "Incomplete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      }

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

    this.fcIndCustomer.workAddressSameAsFlag = '';

    if(val ==='1'){
      this.fcIndCustomer.work = Object.assign({}, this.fcIndCustomer.residence);
      this.register_formGroup.removeControl('work_formGroup');

      this.fcIndCustomer.workAddressSameAsFlag = this.AS_RESIDENCE;

    }else { // Other
      this.fcIndCustomer.work = new AddrCustModel();
      this.register_formGroup.addControl('work_formGroup', this.work_formGroup);
      this.work_formGroup.setParent(this.register_formGroup);
    }

    this.fcIndCustomer.work.Addr_Seq = this.SEQ_WORK_ADDR;
    this.fcIndCustomer.work.SameAs = val;
    this.fcIndCustomer.work.Country_Id=0;

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
    this.fcIndCustomer.currentAddressSameAsFlag = "";
    if(val ==='1'){
      this.fcIndCustomer.current = Object.assign({}, this.fcIndCustomer.residence);
      this.register_formGroup.removeControl('current_formGroup');

      this.fcIndCustomer.currentAddressSameAsFlag = this.AS_RESIDENCE;
    } else if ( val === '3'){
      this.fcIndCustomer.current = Object.assign({}, this.fcIndCustomer.work);
      this.register_formGroup.removeControl('current_formGroup');

      this.fcIndCustomer.currentAddressSameAsFlag = this.AS_WORK;
    } else { // Other
      this.fcIndCustomer.current = new AddrCustModel();
      this.register_formGroup.addControl('current_formGroup', this.current_formGroup);
      this.current_formGroup.setParent(this.register_formGroup);

    }

    this.fcIndCustomer.current.SameAs = val;
    this.fcIndCustomer.current.Addr_Seq = this.SEQ_CURR_ADDR;
    this.fcIndCustomer.current.Country_Id=0;

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
      this.fcIndCustomer.mail_addrData = Object.assign({}, this.fcIndCustomer.residence);
      this.register_formGroup.removeControl('mail_formGroup');
    } else if ( val === 'work'){
      this.fcIndCustomer.mail_addrData = Object.assign({}, this.fcIndCustomer.work);
      this.register_formGroup.removeControl('mail_formGroup');
    } else if ( val === 'curr'){
      this.fcIndCustomer.mail_addrData = Object.assign({}, this.fcIndCustomer.current);
      this.register_formGroup.removeControl('mail_formGroup');
    } else { // 9:Other
      this.fcIndCustomer.mail_addrData = new AddrCustModel();

      this.register_formGroup.addControl('mail_formGroup', this.mail_formGroup);
      this.mail_formGroup.setParent(this.register_formGroup);

      // Default value
      this.fcIndCustomer.mail_addrData.Country_Id=0;

    }

    this.fcIndCustomer.mailSameAs = val;
    this.fcIndCustomer.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;

    if(val === 'email'){
      this.fcIndCustomer.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;
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

requestOTP(){



  console.log("Welcome requestOTP()");
  this.spinnerLoading = true;
  this.CAN_ENTRY_OTP=false;

    this.openAccService.verifyRequestOTP(this.fcIndCustomer.cardNumber,this.fcIndCustomer.mobileNumber)
      .finally(() => {
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          console.log('OTP data>>' + JSON.stringify(data));
          this.CAN_ENTRY_OTP = true;
          this.toastr.success(``,
          `Already send to ${this.fcIndCustomer.mobileNumber}; Please check`,
          {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          }
        );
        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
}

verifyOTP(stepper: MatStepper){
  stepper.next();
}

}
