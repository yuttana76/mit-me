import { Component, OnInit } from '@angular/core';
import { SuitFormService } from './suit.service';

import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
// import { Question, Choice } from '../suit-tree-view/questionBAK';
import { SuitTreeViewComponent } from '../suit-tree-view/suit-tree-view.component';
import { UserService } from '../services/user.service';
import { VerifyService } from '../services/suit.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SurveyModel } from '../model/survey.model';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/finally';
import { Customer } from '../model/customer.model';
import { Question } from '../model/question.model';

@Component({
  selector: 'app-suit',
  templateUrl: './suit.component.html',
  styleUrls: ['./suit.component.scss'],
})
export class SuitComponent implements OnInit {

  form: FormGroup;

  spinnerLoading = false;
  canDoSurvey = false;
  ADD_NEW = false;
  INTERNAL_USER = false;

  suitScore = 0;
  suitLevel = '';
  suitLevelDesc = '';

  public customer : Customer = new Customer();

  public survey : SurveyModel = new SurveyModel();

  private token: string;

  questions: Array<Question>;

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private verifyService: VerifyService,
    public authService: AuthService
  ) {

    // console.log('*** getUserData>>' + this.authService.getUserData());
    // console.log('*** getUserId>>' + this.authService.getUserId());
    // console.log('*** getFullName>>' + this.authService.getFullName());
    // console.log('*** getDepCode>>' + this.authService.getDepCode());

    if(this.authService.getUserId()!=null && this.authService.getDepCode() != null ){
      this.ADD_NEW = true;
      this.INTERNAL_USER = true;
    }

  }

  ngOnInit() {
    this.spinnerLoading = true;

    this.loadQuestions();
    this._buildForm();

    this.activatedRoute.queryParams.subscribe(params => {

      this.token = params['has'];

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
    this.questions = [this.formService.q1, this.formService.q2, this.formService.q3, this.formService.q4, this.formService.q5, this.formService.q6, this.formService.q7, this.formService.q8, this.formService.q9, this.formService.q10, this.formService.s11, this.formService.s12];

  }

  public verify() {

    this.canDoSurvey = false;
    this.customer = new Customer();

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);

      this.toastr.error('Invalid require data', 'warning', {
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-center'
      });

      return false;
    }

    this.spinnerLoading = true;

    this.verifyService.verifyExtLink(this.survey.pid , this.token)
    .finally(() => {
      // Execute after graceful or exceptionally termination
      console.log('Handle logging logic...');
      this.spinnerLoading = false;
    })
    .subscribe((data: any ) => {

      // console.log('HTTP return :' + JSON.stringify(data));

      this.customer.First_Name_T = data.USERDATA.First_Name_T;
      this.customer.Last_Name_T = data.USERDATA.Last_Name_T;

      this.toastr.success(`Welcome ${this.customer.First_Name_T} ${this.customer.Last_Name_T}` , 'success', {
        timeOut: 3000,
        closeButton: true,
        positionClass: 'toast-top-center'
      });

      this.canDoSurvey = true;

    }, error => () => {

      console.log('Verify Was error', error);
    }, () => {
      console.log('Verify  complete');
    });

  }

  public searchCust() {
    this.canDoSurvey = !this.canDoSurvey;
  }


  onSubmit() {
    console.log('ON SUBMIT !');
    if (this.form.invalid) {
      return false;
    }

    // CONVERT VALUES
    // if ( this.customer.Birth_Day) {
    //   const d = new Date(this.customer.Birth_Day);
    //   this.customer.Birth_Day = this.datePipe.transform(d, this.TRADE_FORMAT_DATE);
    // }
    // this.customer.Create_By = this.authService.getUserData() || 'NONE';

  }

  onAddNew(){
    this.canDoSurvey = false;
  }


  calSuit() {
    console.log('ON calSuit !');
    this.suitScore = 0;

    if (this.form.invalid) {
      return false;
    }

    for (let i = 0; i < this.questions.length; i++) {

      if (this.questions[i].multilchoice ) {
        console.log(`multil `);
        let _score = 0;
        for (let y = 0; y < this.questions[i].choices.length - 1; y++) {
          if (this.questions[i].choices[y].answer) {
            console.log(`** ${this.questions[i].id} : ${this.questions[i].choices[y].score}`);
            _score += this.questions[i].choices[y].score;
          }
        }

        if(_score<=0 && this.questions[i].require){
          console.log(' *** Suit not complete !!');

          this.toastr.warning(this.formService.SUIT_ANS_INCOMPLETE, 'warning', {
            timeOut: 5000,
            closeButton: true,
            positionClass: 'toast-top-center'
          });

          break

        }
        this.suitScore +=_score;

      } else {
        console.log(`* ${this.questions[i].id} : ${this.questions[i].answer}`);

        if(!this.questions[i].answer && this.questions[i].require){

          this.toastr.warning(this.formService.SUIT_ANS_INCOMPLETE, 'warning', {
            timeOut: 5000,
            closeButton: true,
            positionClass: 'toast-top-center'
          });

          break

        }else{
          this.suitScore += Number(this.questions[i].answer);
        }

      }
    }

    console.log(`*** Suit score : ${this.suitScore}`);

    this.verifyService.evaluateRiskLevel(this.survey.pid ,this.suitScore, this.questions)
    .finally(() => {
      // Execute after graceful or exceptionally termination
      console.log('Handle logging logic...');
      this.spinnerLoading = false;
    })
    .subscribe((data: any ) => {

      console.log('HTTP return  evaluateRiskLevel :' + JSON.stringify(data));


    }, error => () => {

      console.log('Verify Was error', error);
    }, () => {
      console.log('Verify  complete');
    });


    // console.log(JSON.stringify(this.questions));
  }
}
