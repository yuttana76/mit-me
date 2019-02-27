import { Component, OnInit } from "@angular/core";
import { SuitFormService } from "./suit.service";

import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogService } from "../dialog/confirmation-dialog/confirmation-dialog.service";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
// import { Question, Choice } from '../suit-tree-view/questionBAK';
import { SuitTreeViewComponent } from "../suit-tree-view/suit-tree-view.component";
import { UserService } from "../services/user.service";
import { SuiteService } from "../services/suit.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SurveyModel } from "../model/survey.model";
import { AuthService } from "../../services/auth.service";
import "rxjs/add/operator/finally";
import { Customer } from "../model/customer.model";
import { Question } from "../model/question.model";

@Component({
  selector: "app-suit",
  templateUrl: "./suit.component.html",
  styleUrls: ["./suit.component.scss"]
})
export class SuitComponent implements OnInit {
  form: FormGroup;

  spinnerLoading = false;
  canDoSuit = false;
  canSaveSuit = false;

  canDoFATCA = false;



  ADD_NEW = false;
  INTERNAL_USER = false;

  suitScore = 0;

  riskLevel = 0;
  riskLevelTxt = "";
  riskLevelDesc = "";

  // at-slider
  disabled = true;
  invert = false;
  max = 5;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;

  public customer: Customer = new Customer();

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
    public authService: AuthService
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

  public verify() {
    this.canDoSuit = false;
    this.canDoFATCA = false;

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

          this.customer.Title_Name_T = data.USERDATA.Title_Name_T;
          this.customer.First_Name_T = data.USERDATA.First_Name_T;
          this.customer.Last_Name_T = data.USERDATA.Last_Name_T;

          this.toastr.success(
            `Welcome ${this.customer.First_Name_T} ${
              this.customer.Last_Name_T
            }`,
            "success",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: "toast-top-center"
            }
          );

          this.canDoSuit = true;
          this.canDoFATCA = true;
        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
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

    console.log(`*** Suit score : ${this.suitScore}`);

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
      .subscribe(
        (data: any) => {
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
        console.log("saveSuit logging logic...");
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

}
