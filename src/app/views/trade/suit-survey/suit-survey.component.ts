import { Component, OnInit } from '@angular/core';
import { SuitFormService } from '../suit/suit.service';
import { ToastrService } from 'ngx-toastr';
import { SuiteService } from '../services/suit.service';
import { Customer } from '../model/customer.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SurveyModel } from '../model/survey.model';
import { Question } from '../model/question.model';

@Component({
  selector: 'app-suit-survey',
  templateUrl: './suit-survey.component.html',
  styleUrls: ['./suit-survey.component.scss']
})
export class SuitSurveyComponent implements OnInit {

  public customer: Customer = new Customer();
  public survey: SurveyModel = new SurveyModel();
  public suitQuestions: Array<Question>;

  public EXIST_Risk_Level="";

  form: FormGroup;
  public spinnerLoading = false;
  private token: string;
  public _mobile_hint;
  public verifyOTP_val = "";
  public OTP_ERR_MSG="";

  correctCust = false;
  verifyFLag = false;

  isLinear = false;

  suitFormGroup: FormGroup;

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    private suiteService: SuiteService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.loadQuestions();

    // Initial Form fields
    this.form = new FormGroup({
      pid: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    this.suitFormGroup = new FormGroup({
      cust_RiskLevel: new FormControl(null, {
        // validators: [Validators.required, Validators.minLength(1)]
      }),

    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params["has"];
      this.authService.setUserExtlink(this.token);// Set token in authentication environment
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


  }


  public getCustomerData() {

    this.customer = new Customer();

    if (this.form.invalid) {
      // console.log("form.invalid() " + this.form.invalid);

      this.toastr.error("Invalid require data", "warning", {
        timeOut: 5000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

      return false;
    }

    // this.spinnerLoading = true;
    this.suiteService
      .verifyExtLink(this.survey.pid, this.token)
      .finally(() => {
        // console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {

           console.log("getCustomerData :" + JSON.stringify(data));

           this.correctCust = true;

          // this.customer.Title_Name_T = data.USERDATA.Title_Name_T;
          this.customer.First_Name_T = data.USERDATA.First_Name_T;
          this.customer.Last_Name_T = data.USERDATA.Last_Name_T;
          this.customer.First_Name_E = data.USERDATA.First_Name_E;
          this.customer.Last_Name_E = data.USERDATA.Last_Name_E;
          this.customer.Birth_Day = data.USERDATA.DOB;
          this.customer.Mobile = data.USERDATA.Mobile;

          // console.log("RISK >> "+data.USERDATA.Risk_Level);
          this.EXIST_Risk_Level = data.USERDATA.Risk_Level;


          if(data.USERDATA.Mobile.length==10){
            this._mobile_hint="";
            for(let i=0;i<6;i++){
              this._mobile_hint += data.USERDATA.Mobile[i];
            }
            this._mobile_hint +="-xxxx"

            this._mobile_hint = `Send OTP to  ${this._mobile_hint} `;
          }


          // this.cust_RiskScore = data.USERDATA.Suit_Score;
          // this.cust_RiskLevel = data.USERDATA.Risk_Level;
          // this.cust_RiskLevelTxt = data.USERDATA.Risk_Level_Txt;
          // this.cust_RiskTypeInvestor = data.USERDATA.Type_Investor;
          // this.cust_RiskDate = data.USERDATA.Risk_Date;

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          // console.log("Verify  complete");
        }
      );
  }


  public verifyConfirmOTP() {
    this.spinnerLoading = true;
    this.suiteService.verifyConfirmOTP(this.survey.pid,this.verifyOTP_val,this.customer.Mobile)
      .finally(() => {
        this.spinnerLoading = false;
      })
      .subscribe((otpReturn: any) => {
          //OTP ID
          this.customer.OTP_ID=otpReturn.otp_id
          this.verifyFLag = true;
          this.OTP_ERR_MSG="";

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

  public requestOTP() {
    this.spinnerLoading = true;
    const _mobile = this.customer.Mobile;
    this.suiteService.verifyRequestOTP(this.survey.pid,_mobile)
      .finally(() => {
        console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {

          console.log('requestOTP()' + JSON.stringify(data));

          // this.showOtpEntry =true;
          // this.otpToken_Date = data.TOKEN_DATE;
          // this.otpToken_Period = data.TOKEN_PEROID;

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
  }

  public saveSuit() {

    // this.cust_RiskLevel = this.riskLevel;
    // this.cust_RiskLevelTxt = this.riskLevelTxt;
    // this.cust_RiskTypeInvestor = this.riskLevelDesc;

    // this.cust_RiskDate =  new Date();

      this.suiteService
        .saveSuitabilityByPID(
          this.survey.pid,
          this.survey.pid,
          this.formService.suitSerieId,
          this.survey.suitScore,
          this.survey.riskLevel,
          this.survey.riskLevelTxt,
          this.survey.riskLevelDesc,
          this.suitQuestions
        )
        .finally(() => {
          // Execute after graceful or exceptionally termination
          // this.canDoSuit =false;
          this.spinnerLoading = false;
        })
        .subscribe(
          (data: any) => {
            // console.log("HTTP return  saveSuit :" + JSON.stringify(data));

            if (data.code === "000") {

              this.toastr.success(data.msg, this.formService.SUIT_SAVE_COMPLETE, {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              });

              // Mail to customer

              this.suiteService.surveySuitThankCust(this.survey.pid)
              .finally(() => {
                // Execute after graceful or exceptionally termination
              })
              .subscribe((data: any) => {
                  console.log("Send maill finalSaveAll:" + JSON.stringify(data));

                },
                error => () => {
                  console.log("Send maill finalSaveAll was error", error);
                },
                () => {
                  // console.log("saveFATCA  complete");
                }
              );

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



}
