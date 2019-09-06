import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RegisterModel } from '../model/sitRegister.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { StreamingService } from '../services/streaming.service';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-set-regis2',
  templateUrl: './set-regis2.component.html',
  styleUrls: ['./set-regis2.component.scss']
})
export class SetRegis2Component implements OnInit {

  register = new RegisterModel();
  regisFail=0;

  firstFormGroup: FormGroup;
  verifyFormGroup: FormGroup;
  myRecaptcha = new FormControl(false);

  isStepperLinear = true;
  spinnerLoading = false;

  public ST_TermCondition = [
    ' GENERAL. This SALES ORDER CONTRACT (“SALES CONTRACT”) sets forth the terms and conditions pursuant to which the purchaser identified on the front page hereof ("Pur¬chaser") will purchase and Star Automation, Inc. ("Seller") will sell the product, and any accessories and attach¬ments (collectively, ¬the "Product") described on the front page of this SALES CONTRACT. These Terms and Con¬ditions shall govern and apply to the sale of the Product to Purchaser, regardless of any terms and conditions appearing on any purchase order or other forms submitted by Purchaser to Seller.',
    'CANCELLATION. This CONTRACT can be cancelled by either party, subject to the following restrictions: (1) if the Products sold hereunder are specially manufactured, or nonstandard goods, then this contract may not be cancelled by Purchaser unless agreed to by a signed agreement between the parties; and (2) in the event that the Purchaser cancels this SALES CONTRACT, it agrees to reimburse Seller in an amount equal to either: (a) 10% of the SALES CONTRACT if Purchaser cancels at a time after this SALES CONTRACT is executed, but prior to shipment of Products sold hereunder, or (b) 25% of the SALES CONTRACT if Purchaser cancels at a time both after this SALES CONTRACT is executed and after Products are tendered to the Shipper.',
    'PRICE. All prices set forth in this SALES CONTRACT are F.O.B. Seller’s place of business, unless otherwise agreed. All prices are exclusive of any and all taxes, including, but not limited to, excise, sales, use, property or transportation taxes related to the sale or use of the Product, now or hereafter imposed, together with all penalties and expenses. Purchaser shall be responsible for collecting and/or paying any and all such taxes, whether or not they are stated in any invoice for the Product. Purchaser shall indemnify and hold Seller free and harmless from and against the imposition and payment of such taxes. Seller, at its option, may at any time separately bill the Purchaser for any taxes not included in Seller\'s invoice and Purchaser shall pay said taxes, or in lieu thereof, shall provide Seller with a tax exemption certificate acceptable to taxing authorities. Unless otherwise specified herein, all prices are exclusive of inland transportation, freight, insurance and other costs and expenses relating to the shipment of the Product from the F.O.B. point to Purchaser\'s facility¬. Any prepayment by Seller of freight insurance and other costs shall be for the account of Purchaser and shall be repaid to Seller.',
    'PAYMENT, DELINQUENCY CHARGE. Payment shall be made in accordance with the terms of this SALES CONTRACT, unless otherwise agreed: (1) Purchaser shall pay Seller 25% prior to shipment and the remaining 75% net 30 days after ship date. Seller reserves the right to charge interest at the rate of 1.5% per month (but not more than the maximum percentage permitted by law) on all balances not paid by Purchaser within the designated net terms. Seller reserves the right at any time to revoke any credit extended to Purchaser because of Purchaser\'s failure to pay for any goods when due or for any other reason deemed to be good and sufficient by Seller. Seller shall have no obligation to make sale or shipment of any products to Purchaser, in any manner, if at any time the Seller has reason to believe that the financial responsibility of Purchaser is impaired or unsatis¬factory to Seller, or if at the time of such sale or shipment, Purchaser is delinquent in the payment of any account to Seller. In the event Purchaser shall be in default of any terms and conditions hereof, or becomes insolvent or proceedings are instituted to declare Purchaser bankrupt, or a receiver is appointed for Purchaser in any court, Seller may at its option terminate this SALES CONTRACT and/or declare any and all claims or demands against Purchaser held by Seller immediate¬ly due and payable, together with any and all attorneys’ fees and costs incurred by Seller in enforcing its rights hereunder, all of which Seller may sue for and recover from Purchaser.'
  ];

  constructor(private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private streamingService:StreamingService
    ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      idCard: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required]
    });


  }


  onRegister(stepper:MatStepper){


    if(this.firstFormGroup.valid){

      // this.spinnerLoading = true; //Not work in stepper

      this.streamingService.addRegister(this.register) .subscribe(data =>{

        // this.toastr.success("Register successful." , "Successful", {
        //   timeOut: 3000,
        //   closeButton: true,
        //   positionClass: "toast-top-center"
        // });

        this.regisFail = 0;
        stepper.next();

      } , error => {

        console.log("Regis ERROR>" + JSON.stringify(error));
        this.spinnerLoading = false;
        this.regisFail++;

        this.toastr.error("Register incomplete  Regis fail: " +  this.regisFail, "Error", {
          timeOut: 6000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      }, () => {
        this.spinnerLoading = false;
      });

    }

  }

  onProcData(stepper:MatStepper){
    if(this.firstFormGroup.valid){

      this.streamingService.regisAccept(this.register) .subscribe(data =>{

        console.log('onProcData() result' + JSON.stringify(data));
        let _dataObj = JSON.parse(JSON.stringify(data));

        if(_dataObj.code==='000'){
          stepper.next();
        }else{
          this.toastr.error("Stremaing registration process was error. " + _dataObj.msg, "Error", {
            timeOut: 6000,
            closeButton: true,
            positionClass: "toast-top-center"
          });
        }


      } , error => {
        console.log("Stremaing registration process was error." + JSON.stringify(error));
        this.toastr.error("Stremaing registration process was error. ", "Error", {
          timeOut: 6000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      });
    }

  }

  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!')
}

  onScriptError() {
      console.log('Something went long when loading the Google reCAPTCHA')
  }

  OnConditionChange() {

    // if(this.register.acceptFlag){
    //   // Auto  request OTP
    // }

}

requestOTP(){
  if(this.register.acceptFlag){

    // console.log("Call requestOTP");

    this.streamingService.requestOTP(this.register) .subscribe(data =>{
      this.toastr.success("Already send OTP" , "Successful", {
        timeOut: 3000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

    }, error => {
      console.log("WAS ERR>>" + JSON.stringify(error) );

      this.spinnerLoading = false;
      this.toastr.error("Send OTP error "   , "Error", {
        timeOut: 6000,
        closeButton: true,
        positionClass: "toast-top-center"
      });
    },
    () => {
     this.spinnerLoading = false;
    });
  }

  }
}
