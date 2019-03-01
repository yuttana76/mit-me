import { Component, OnInit } from "@angular/core";
import { SuitFormService } from "./suit.service";

import { ToastrService } from "ngx-toastr";
import { MatDialog, MatRadioChange } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { SuiteService } from "../services/suit.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { SurveyModel } from "../model/survey.model";
import { AuthService } from "../../services/auth.service";
import "rxjs/add/operator/finally";
import { Customer } from "../model/customer.model";
import { Question } from "../model/question.model";
import { CddService } from "../services/cdd.service";
import { AddrCustModel } from "../model/addrCust.model";
// import { CDDModel } from "../model/cdd.model";



@Component({
  selector: "app-suit",
  templateUrl: "./suit.component.html",
  styleUrls: ["./suit.component.scss"]
})
export class SuitComponent implements OnInit {

  riskData = [
    {id: 1, name: "เสี่ยงต่ำ"},
    {id: 2, name: "เสี่ยงปานกลางค่อนข้างต่ำ"},
    {id: 3, name: "เสี่ยงปานกลางค่อนข้างต่ำ"},
    {id: 4, name: "เสี่ยงสูง"},
    {id: 5, name: "เสี่ยงสูงมาก"}
  ];

  form: FormGroup;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  register_formGroup: FormGroup;
  work_formGroup: FormGroup;
  current_formGroup: FormGroup;

  spinnerLoading = false;

  needVerify = false;
  verifyFLag = false;
  canDoSuit = false;
  canSaveSuit = false;
  canDoFATCA = false;
  showOtpEntry = false;

  ADD_NEW = false;
  INTERNAL_USER = false;

  suitScore = 0;
  riskLevel = 0;
  riskLevelTxt = "";
  riskLevelDesc = "";

  public customer: Customer = new Customer();

  public re_addrData: AddrCustModel = new AddrCustModel();
  public cur_addrData: AddrCustModel = new AddrCustModel();
  public work_addrData: AddrCustModel = new AddrCustModel();
  showWorkAddrAs = '';
  showCurrAddrAs = '';


  cust_RiskScore=0;
  cust_RiskLevel=0;
  cust_RiskLevelTxt='';
  cust_RiskDate;
  verifyBy;
  verifyDOB_val;
  otpToken_Date;
  otpToken_Period;
  verifyOTP_val = ""

  public survey: SurveyModel = new SurveyModel();

  private token: string;

  suitQuestions: Array<Question>;
  fatcaQuestions: Array<Question>;

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private suiteService: SuiteService,
    public authService: AuthService,
    private _formBuilder: FormBuilder,
    private cddService: CddService
  ) {
    // console.log('*** getUserData>>' + this.authService.getUserData());
    // console.log('*** getUserId>>' + this.authService.getUserId());
    // console.log('*** getFullName>>' + this.authService.getFullName());
    // console.log('*** getDepCode>>' + this.authService.getDepCode());

    if (
      this.authService.getUserId() != null &&
      this.authService.getDepCode() != null
    ) {
      this.ADD_NEW = true;
      this.INTERNAL_USER = true;
    }
  }

  ngOnInit() {

    this.re_addrData.Addr_Seq = 1;
    if(!this.re_addrData.Country_Id){
      this.re_addrData.Country_Id = 0;
    }

    this.cur_addrData.Addr_Seq = 2;
    if(!this.cur_addrData.Country_Id){
      this.cur_addrData.Country_Id = 0;
    }

    this.work_addrData.Addr_Seq = 3;
    if(!this.work_addrData.Country_Id){
      this.work_addrData.Country_Id = 0;
    }

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });

    this.spinnerLoading = true;

    this.loadQuestions();
    this._buildForm();

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params["has"];

      // Set token in authentication environment
      this.authService.setUserExtlink(this.token);

      this.spinnerLoading = false;
    });
  }

  private _buildForm() {
    // Initial Form fields
    this.form = new FormGroup({
      pid: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  loadQuestions() {
    // tslint:disable-next-line:max-line-length
    this.suitQuestions = [
      this.formService.suit_q1,
      this.formService.suit_q2,
      this.formService.suit_q3,
      this.formService.suit_q4,
      this.formService.suit_q5,
      this.formService.suit_q6,
      this.formService.suit_q7,
      this.formService.suit_q8,
      this.formService.suit_q9,
      this.formService.suit_q10,
      this.formService.suit_s11,
      this.formService.suit_s12
    ];

    this.fatcaQuestions = [
      this.formService.fatca_q1,
      this.formService.fatca_q2,
      this.formService.fatca_q3,
      this.formService.fatca_q4,
      this.formService.fatca_q5,
      this.formService.fatca_q6,
      this.formService.fatca_q7,
      this.formService.fatca_q8,
      this.formService.fatca_q9
    ];
  }

  public getCustomerData() {
    // this.canDoSuit = false;
    // this.canDoFATCA = false;

    this.customer = new Customer();

    if (this.form.invalid) {
      console.log("form.invalid() " + this.form.invalid);

      this.toastr.error("Invalid require data", "warning", {
        timeOut: 5000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

      return false;
    }

    this.spinnerLoading = true;

    this.suiteService
      .verifyExtLink(this.survey.pid, this.token)
      .finally(() => {
        // Execute after graceful or exceptionally termination
        console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          console.log("HTTP return :" + JSON.stringify(data));

          this.needVerify = true;
          this.verifyFLag = false;

          this.customer.Title_Name_T = data.USERDATA.Title_Name_T;
          this.customer.First_Name_T = data.USERDATA.First_Name_T;
          this.customer.Last_Name_T = data.USERDATA.Last_Name_T;
          this.customer.Birth_Day = data.USERDATA.DOB;
          this.customer.Mobile = data.USERDATA.Mobile;

          this.cust_RiskScore = data.USERDATA.Suit_Score;
          this.cust_RiskLevel = data.USERDATA.Risk_Level;
          this.cust_RiskLevelTxt = data.USERDATA.Risk_Level_Txt;
          this.cust_RiskDate = data.USERDATA.Risk_Date;

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
  }

  public requestOTP() {
    this.spinnerLoading = true;
    this.suiteService.verifyRequestOTP(this.survey.pid)
      .finally(() => {
        console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          console.log("HTTP return : verifyRequestOTP()" + JSON.stringify(data));

          this.showOtpEntry =true;
          this.otpToken_Date = data.TOKEN_DATE;
          this.otpToken_Period = data.TOKEN_PEROID;

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
  }

  public verifyConfirmOTP() {
    this.spinnerLoading = true;
    this.suiteService.verifyConfirmOTP(this.survey.pid,this.verifyOTP_val)
      .finally(() => {
        console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          console.log("HTTP return verifyConfirmOTP():" + JSON.stringify(data));

          // Load CDD

          this.verifyFLag =true;
          this.needVerify = false;


          this.toastr.success(` ${this.customer.First_Name_T} ${this.customer.Last_Name_T }`,
            "Welcome",
            {
              timeOut: 3000,
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


  public verifyDOB() {

      if(this.customer.Birth_Day.replace(/[-]/g, "").toLowerCase() === this.verifyDOB_val){
        this.verifyFLag = true;
        this.needVerify = false;
        this.verifyDOB_val='';

        // //Load CDD
        //   this.cddService.getCustCDDInfo(this.survey.pid).subscribe(data => {
        //     console.log('CDD >>' +JSON.stringify(data));

        //   }, error => () => {
        //       console.log('Was error', error);
        //   }, () => {
        //     console.log('Loading complete');

        //   });

        this.toastr.success(` ${this.customer.First_Name_T} ${this.customer.Last_Name_T}`,
            "Welcome",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: "toast-top-center"
            }
          );


      } else {
        this.verifyDOB_val='';
        this.toastr.warning(` Incorrect data. `,
              "Fail",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
      }


  }

  public searchCust() {
    this.canDoSuit = !this.canDoSuit;
  }

  onAddNew() {
    this.canDoSuit = false;
  }

  calSuit() {
    // console.log('ON calSuit !');
    this.suitScore = 0;

    if (this.form.invalid) {
      return false;
    }

    for (let i = 0; i < this.suitQuestions.length; i++) {
      // This for choose multi choices
      if (
        this.suitQuestions[i].multilchoice &&
        this.suitQuestions[i].calculate
      ) {
        // console.log(`multil `);
        let _score = 0;
        for (let y = 0; y < this.suitQuestions[i].choices.length; y++) {
          // console.log(`** check:  ${this.questions[i].choices[y].answer} `);
          if (this.suitQuestions[i].choices[y].answer) {
            // console.log(`** SCORE:  ${this.questions[i].choices[y].score} : ${_score}`);
            // Choose bigger score
            if (this.suitQuestions[i].choices[y].score > _score) {
              _score = this.suitQuestions[i].choices[y].score;
            }
          }
        }

        // console.log('*** Multi Score is >>' + _score);
        if (_score <= 0 && this.suitQuestions[i].require) {
          // console.log(' *** Suit not complete !!');

          this.toastr.warning(this.formService.SUIT_ANS_INCOMPLETE, "warning", {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          });

          return null;
        }
        this.suitScore += _score;
      } else if (this.suitQuestions[i].calculate) {
        // For single choose
        // console.log(`* ${this.suitQuestions[i].id} : ${this.suitQuestions[i].answer}`);

        if (!this.suitQuestions[i].answer && this.suitQuestions[i].require) {
          this.toastr.warning(this.formService.SUIT_ANS_INCOMPLETE, "warning", {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          });

          return null;
        } else {
          this.suitScore += Number(this.suitQuestions[i].answer);
        }
      }
    }

    // console.log(`*** Suit score : ${this.suitScore}`);

    if (this.suitScore > 0) {
      this.riskEvaluate();
    }
    // console.log(JSON.stringify(this.questions));
  }

  riskEvaluate() {
    this.canSaveSuit = false;
    this.spinnerLoading = true;

    this.suiteService
      .suitEvaluate(
        this.survey.pid,
        this.formService.suitSerieId,
        this.suitScore
      )
      .finally(() => {
        // Execute after graceful or exceptionally termination
        console.log("riskEvaluate logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe((data: any) => {
          console.log(
            "HTTP return  evaluateRiskLevel :" + JSON.stringify(data)
          );

          if (data) {
            this.riskLevel = data.DATA.RiskLevel;
            this.riskLevelTxt = data.DATA.RiskLevelTxt;
            this.riskLevelDesc = data.DATA.Type_Investor;

            this.canSaveSuit = true;
          }
        },
        error => () => {
          console.log("riskEvaluate Was error", error);
        },
        () => {
          console.log("riskEvaluate  complete");
        }
      );
  }

  saveSuit() {

  this.cust_RiskLevel= this.riskLevel
  this.cust_RiskLevelTxt= this.riskLevelTxt;
  this.cust_RiskDate =  new Date();

    this.suiteService
      .saveSuitabilityByPID(
        this.survey.pid,
        this.survey.pid,
        this.formService.suitSerieId,
        this.suitScore,
        this.riskLevel,
        this.riskLevelTxt,
        this.riskLevelDesc,
        this.suitQuestions
      )
      .finally(() => {
        // Execute after graceful or exceptionally termination
        this.canDoSuit =false;
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          console.log("HTTP return  saveSuit :" + JSON.stringify(data));

          if (data.code === "000") {
            this.toastr.success(data.msg, this.formService.SUIT_SAVE_COMPLETE, {
              timeOut: 5000,
              closeButton: true,
              positionClass: "toast-top-center"
            });
          } else {
            this.toastr.warning(
              data.msg,
              this.formService.SUIT_SAVE_INCOMPLETE,
              {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
          }

        },
        error => () => {
          console.log("saveSuit Was error", error);
        },
        () => {
          console.log("saveSuit  complete");
        }
      );

  }

  suiteFormRESET() {
    console.log("Suite survey RESET !");

    this.suitScore = 0;
    this.riskLevel = 0;
    this.riskLevelTxt = "";
    this.riskLevelDesc = "";
    this.canSaveSuit = false;
  }

  public fatcaFormRESET(){
    console.log('*** FATCA RESET ');
  }


  public saveFATCA(){
    this.suiteService
    .saveFATCA(
      this.survey.pid,
      this.survey.pid,
      this.fatcaQuestions
    )
    .finally(() => {
      // Execute after graceful or exceptionally termination
      console.log("saveFATCA logging logic...");
      this.spinnerLoading = false;
    })
    .subscribe(
      (data: any) => {
        console.log("HTTP return  saveFATCA :" + JSON.stringify(data));
        if (data.code === "000") {
          this.toastr.success(data.msg, this.formService.FATCA_SAVE_COMPLETE, {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          });
        } else {
          this.toastr.warning(
            data.msg,
            this.formService.FATCA_SAVE_INCOMPLETE,
            {
              timeOut: 5000,
              closeButton: true,
              positionClass: "toast-top-center"
              }
            );
        }
      },
      error => () => {
        console.log("saveFATCA Was error", error);
      },
      () => {
        console.log("saveFATCA  complete");
      }
    );
  }


  verifyByChange(event: MatRadioChange) {
    // console.log( 'verifyByChange()>>' + event.value);
    this.verifyDOB_val = '';
    this.verifyOTP_val = '';
    this.showOtpEntry =false;
  }


  saveAddrAll(){
  console.log('savePersonInfo()');
     // if (this.register_formGroup.invalid) {
    //   console.log('form.invalid() ' + this.register_formGroup.invalid);
    //   return false;
    // }

    console.log(` Saving re_addrData>>${JSON.stringify(this.re_addrData)} ` );
    console.log(` Saving work_addrData>>  -${JSON.stringify(this.work_addrData)} ` );
    console.log(` Saving cur_addrData>>  -${JSON.stringify(this.cur_addrData)} ` );


  // this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.re_addrData,this.work_addrData,this.cur_addrData)
  /*
    this.re_addrData,
    this.work_addrData,
    this.cur_addrData
   */

  this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.re_addrData)
  .subscribe((data: any ) => {
   console.log('Successful', JSON.stringify(data));
  //  if (data.code === "000") {
  //    this.toastr.success(data.msg, this.formService.SAVE_COMPLETE, {
  //      timeOut: 5000,
  //      closeButton: true,
  //      positionClass: "toast-top-center"
  //    });
  //  } else {
  //    this.toastr.warning(
  //      data.msg,
  //      this.formService.SAVE_INCOMPLETE,
  //      {
  //        timeOut: 5000,
  //        closeButton: true,
  //        positionClass: "toast-top-center"
  //      }
  //    );
  //  }

 }, error => () => {
     console.log('Was error', error);
 }, () => {
    console.log('Finish Addr register #1');
// **************************
    this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.work_addrData)
    .subscribe((data: any ) => {
     console.log('Successful', JSON.stringify(data));
    //  if (data.code === "000") {
    //    this.toastr.success(data.msg, this.formService.SAVE_COMPLETE, {
    //      timeOut: 5000,
    //      closeButton: true,
    //      positionClass: "toast-top-center"
    //    });
    //  }
    //  else {
    //    this.toastr.warning(
    //      data.msg,
    //      this.formService.SAVE_INCOMPLETE,
    //      {
    //        timeOut: 5000,
    //        closeButton: true,
    //        positionClass: "toast-top-center"
    //      }
    //    );
    //  }

   }, error => () => {
       console.log('Was error', error);
   }, () => {
      console.log('Finish Addr register #2');
      // **************************
            this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.cur_addrData)
            .subscribe((data: any ) => {
            console.log('Successful', JSON.stringify(data));
            if (data.code === "000") {
              this.toastr.success(data.msg, this.formService.SAVE_COMPLETE, {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              });
            } else {
              this.toastr.warning(
                data.msg,
                this.formService.SAVE_INCOMPLETE,
                {
                  timeOut: 5000,
                  closeButton: true,
                  positionClass: "toast-top-center"
                }
              );
            }

            }, error => () => {
              console.log('Was error', error);
            }, () => {
              console.log('Finish Addr register #3');
            // **************************

            // **************************
            });
      // **************************

   });
// **************************
 });



}



  workAddrOnChange(val){
    console.log('workAddrOnChange >> ' + val);

    if(val ==='R'){
      console.log('Same register ***');
      this.work_addrData = Object.assign({}, this.re_addrData);

    }else { // Other
      console.log('Other addr. *** ');
    }

    this.work_addrData.Addr_Seq = 3;
  }

  cuurAddrOnChange(val){
    console.log('currAddrOnChange >> ' + val);

    if(val ==='R'){
      console.log('Same register ***');
      this.cur_addrData = Object.assign({}, this.re_addrData);

    }else if(val ==='W'){
      console.log('Same work ***');
      this.cur_addrData = Object.assign({}, this.work_addrData);

    }else { // Other
      console.log('Other addr. *** ');
    }

    this.cur_addrData.Addr_Seq = 2;
  }


}
