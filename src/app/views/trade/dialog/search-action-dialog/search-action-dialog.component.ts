import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SuiteService } from '../../services/suit.service';
import { ToastrService } from 'ngx-toastr';
import { SearchActionDialogService } from './SearchActionDialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-search-action-dialog',
  templateUrl: './search-action-dialog.component.html',
  styleUrls: ['./search-action-dialog.component.scss']
})
export class SearchActionDialogComponent implements OnInit {

  spinnerLoading = false;

  uploadAPIForm: FormGroup;

public identificationCardType="CITIZEN_CARD";
public passportCountry;
public suitabilityRiskLevel ="5";
public suitabilityEvaluationDate='20200101';
public fatca;
public fatcaDeclarationDate='20200201';
public cddScore ="2";
public cddDate='20200110';
public referralPerson;


  constructor(
    private authService: AuthService,
    public formService: SearchActionDialogService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SearchActionDialogComponent> ,
    @Optional() @Inject(MAT_DIALOG_DATA) public custCode: any,
    private suiteService: SuiteService,
  ) { }

  ngOnInit() {

    this.uploadAPIForm = new FormGroup({
        id: new FormControl(null, {
          // validators: [Validators.required]
        }),
      suitLevel: new FormControl(null, {
        validators: [Validators.required]
      }),
      cddScore: new FormControl(null, {
        validators: [Validators.required]
      }),
      fatca: new FormControl(null, {
        validators: [Validators.required]
      }),
    });


    this.getCustIndPartial();
  }

  onClose(){
    this.dialogRef.close('Close');
  }

  getCustIndPartial(){

    this.spinnerLoading = true;

    this.suiteService.getCustIndPartial(this.custCode)
    .finally(() => {
      console.log("Handle logging logic...");
      this.spinnerLoading = false;
    })
    .subscribe((data: any) => {

      console.log("**getCustIndPartial()>"+JSON.stringify(data));

      if(data.result){

        this.identificationCardType=data.result[0].identificationCardType;
        this.passportCountry=data.result[0].passportCountry;
        this.suitabilityRiskLevel =data.result[0].suitabilityRiskLevel;
        this.suitabilityEvaluationDate=data.result[0].suitabilityEvaluationDate;
        this.fatca=data.result[0].fatca;
        this.fatcaDeclarationDate=data.result[0].fatcaDeclarationDate;
        this.cddScore =data.result[0].cddScore;
        this.cddDate=data.result[0].cddDate;

        if(this.fatca){
          this.fatca=this.fatca.trim();
        }

      }

      });
  }

  onUploadAPI(){
    this.spinnerLoading = true;

    this.referralPerson='Tester';
    if(this.authService.getFullName()){
      this.referralPerson =this.authService.getFullName();
    }

    this.suiteService.uploadCustInd(this.identificationCardType,this.custCode,this.referralPerson,this.suitabilityRiskLevel,this.suitabilityEvaluationDate,this.fatca,this.fatcaDeclarationDate,this.cddScore,this.cddDate,this.authService.getUserId())
         .finally(() => {
          this.spinnerLoading = false;
        })
        .subscribe((data: any) => {
            console.log("onUploadAPI RS:" + JSON.stringify(data));
            this.spinnerLoading = false;

            if (data.code === "000") {
              this.toastr.success(data.msg, this.formService.SAVE_COMPLETE, {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              });
            } else {
              this.toastr.warning(
                data.message,
                this.formService.SAVE_INCOMPLETE,
                {
                  timeOut: 5000,
                  closeButton: true,
                  positionClass: "toast-top-center"
                }
              );
            }

          },
          error => () => {
            this.spinnerLoading = false;
            console.log("saveSuit Was error", error);
          },
          () => {
            console.log("saveSuit  complete");
            this.spinnerLoading = false;
          }
        );
    }



    onSendKYCSurvey(){
    this.spinnerLoading = true;

    this.referralPerson='Yuttana';
    if(this.authService.getFullName()){
      this.referralPerson =this.authService.getFullName();
    }

    this.suiteService.sendKYCToCustomer(this.custCode)
         .finally(() => {
          this.spinnerLoading = false;
        })
        .subscribe((data: any) => {
            console.log("onUploadAPI RS:" + JSON.stringify(data));
            this.spinnerLoading = false;

            if (data.code === "000") {
              this.toastr.success(data.msg, this.formService._COMPLETE, {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              });
            } else {
              this.toastr.warning(
                data.message,
                this.formService._INCOMPLETE,
                {
                  timeOut: 5000,
                  closeButton: true,
                  positionClass: "toast-top-center"
                }
              );
            }

          },
          error => () => {
            this.spinnerLoading = false;
            console.log("saveSuit Was error", error);
          },
          () => {
            console.log("saveSuit  complete");
            this.spinnerLoading = false;
          }
        );
    }

}

