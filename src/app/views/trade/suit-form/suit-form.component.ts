import { Component, OnInit, Input } from '@angular/core';
import { SuitFormService } from '../suit/suit.service';
import { FormGroup } from '@angular/forms';
import { Question } from '../model/question.model';
import { ToastrService } from 'ngx-toastr';
import { SuiteService } from '../services/suit.service';
import { SurveyModel } from '../model/survey.model';

@Component({
  selector: 'app-suit-form',
  templateUrl: './suit-form.component.html',
  styleUrls: ['./suit-form.component.scss']
})
export class SuitFormComponent implements OnInit {

  @Input() survey: SurveyModel;
  @Input() suitFormGroup: FormGroup;
  @Input() suitQuestions: Array<Question>;

  canDoSuit = true; // Default =true
  canSaveSuit = false;
  onSuitCalculate = false;

  // suitScore = 0;
  // riskLevel = 0;
  // riskLevelTxt = "";
  // riskLevelDesc = "";

  cust_RiskScore=0;
  cust_RiskLevel=0;
  cust_RiskLevelTxt='';
  cust_RiskTypeInvestor='';
  cust_RiskDate;

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    private suiteService: SuiteService,
  ) { }

  ngOnInit() {
  }


  calSuit() {

    // console.log('ON calSuit !');
    this.survey.suitScore = 0;

    // if (this.form.invalid) {
    //   return false;
    // }

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
        this.survey.suitScore += _score;
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
          this.survey.suitScore += Number(this.suitQuestions[i].answer);
        }
      }
    }

     console.log(`*** Suit score : ${this.survey.suitScore}`);

    if (this.survey.suitScore > 0) {
      this.riskEvaluate();

    }

    scroll(0,0);
    // console.log(JSON.stringify(this.questions));
  }

  riskEvaluate() {

    this.onSuitCalculate = true;
    this.canSaveSuit = false;

    this.suiteService
      .suitEvaluate(
        this.survey.pid,
        this.formService.suitSerieId,
        this.survey.suitScore
      )
      .finally(() => {
        // Execute after graceful or exceptionally termination
        console.log("riskEvaluate logging logic...");
        // this.spinnerLoading = false;
        this.onSuitCalculate = false;
      })
      .subscribe((data: any) => {
          // console.log("HTTP return  evaluateRiskLevel :" + JSON.stringify(data));
          if (data) {
            this.survey.riskLevel = data.DATA.RiskLevel;
            this.survey.riskLevelTxt = data.DATA.RiskLevelTxt;
            this.survey.riskLevelDesc = data.DATA.Type_Investor;

            this.canSaveSuit = true;
            this.canDoSuit = false;

            this.cust_RiskDate =  new Date();
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


  checkSuit_FormInvalid(_Form:FormGroup){

    let alertMSG = "";

    if(!this.cust_RiskDate  ){
      alertMSG = this.formService.NO_SUIT_MSG; // `No suitability data. Please do suitability survey.`;
    } else {

      // Add dition on 02/05
      this.cust_RiskLevel = this.survey.riskLevel;
      this.cust_RiskLevelTxt = this.survey.riskLevelTxt;
      this.cust_RiskTypeInvestor = this.survey.riskLevelDesc;
      this.cust_RiskDate =  new Date();

      this.canDoSuit = false;
      this.canSaveSuit = true;

      this.suitFormGroup.controls["cust_RiskLevel"].setValue(this.cust_RiskLevel);

      // Add dition on 02/05

        let _riskDate =  new Date(this.cust_RiskDate);
        let diff = Math.abs(new Date().getTime() - _riskDate.getTime());
        let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

        console.log("diffDays="+diffDays);

        if(diffDays > this.formService.SUIT_EXP_DAY){
              alertMSG = this.formService.EXP_SUIT_MSG;//`Suitability evaluate data near expired(2 year.). Please do suitability survey.`;
        }
    }

    if(alertMSG.length>0){

      // this.cddFormGroup.controls["titleOth"].setValidators(Validators.required);
      this.suitFormGroup.controls["cust_RiskLevel"].setValue(null);
      this.suitFormGroup.controls["cust_RiskLevel"].updateValueAndValidity();

      this.toastr.warning(
        alertMSG ,
        this.formService.DATA_INCOMPLETE,
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
      );
    }


    // this.suitFormGroup.controls["titleOth"].setValidators(Validators.required);
    // this.suitFormGroup.controls["titleOth"].updateValueAndValidity();

    // if(_Form.invalid){
    //   const invalid = [];
    //   const controls = _Form.controls;
    //   for (const name in controls) {
    //       if (controls[name].invalid) {
    //           invalid.push(name);
    //       }
    //   }
    //   if ( invalid.length > 0 ){

    //     this.toastr.warning(
    //       this.formService.DO_SUIT_MSG,
    //       this.formService.DATA_INCOMPLETE,
    //       {
    //         timeOut: 5000,
    //         closeButton: true,
    //         positionClass: "toast-top-center"
    //       }
    //     );

    //   }
    // }
   }

}
