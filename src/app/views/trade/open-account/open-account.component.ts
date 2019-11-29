import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Customer } from '../model/customer.model';
import { OpenAccount } from '../model/openAccount.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { AddrCustModel } from '../model/addrCust.model';
import { fcIndCustomer } from '../model/fcIndCustomer.model';
import { OnlineProcessService } from '../services/onlineProcess.service';

@Component({
    selector: 'app-open-account',
    templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss']
})
export class OpenAccountComponent implements OnInit {

  isLinear = true;
  // openAccount = new OpenAccount();
  public fcIndCustomer: fcIndCustomer = new fcIndCustomer();

  firstFormGroup: FormGroup;
  // fillFormGroup: FormGroup;
  indCustFormGroup: FormGroup;
  re_addrFormGroup: FormGroup;
  cu_addrFormGroup: FormGroup;
  wk_addrFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private onlineProcessService: OnlineProcessService,
    ) {}

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      identifier: ['', Validators.required]
    });

    this.indCustFormGroup =new FormGroup({
      identificationCardType: new FormControl(null, {
        validators: [Validators.required]
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
    });

    // this.fillFormGroup = this._formBuilder.group({
    //   identifier: ['', Validators.required],
    //   title: ['', Validators.required],
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   sex: ['', Validators.required],
    //   dob: ['', Validators.required],
    //   cardIssueDate: ['', Validators.required],
    //   cardExpDate: ['', Validators.required],
    //   nationality: ['', Validators.required],
    // });

    // this.fillFormGroup.controls['identifier'].disable();



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

}
