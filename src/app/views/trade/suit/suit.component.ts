import { Component, OnInit } from '@angular/core';
import { SuitFormService } from './suit.service';

import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Question, Choice } from '../suit-tree-view/question';
import { SuitTreeViewComponent } from '../suit-tree-view/suit-tree-view.component';
import { UserService } from '../services/user.service';
import { VerifyService } from '../services/verify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SurveyModel } from '../model/survey.model';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-suit',
  templateUrl: './suit.component.html',
  styleUrls: ['./suit.component.scss'],
})
export class SuitComponent implements OnInit {

  form: FormGroup;

  spinnerLoading = false;
  canDoSurvey = false;

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

  ngOnChanges(){
    console.log('Key press**********');
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

    this.spinnerLoading = true;

    this.verifyService.verifyExtLink(this.survey.pid , this.token)
    .finally(() => {
      // Execute after graceful or exceptionally termination
      console.log('Handle logging logic...');
      this.spinnerLoading = false;
    })
    .subscribe((data: any ) => {
      console.log('HTTP return :' + JSON.stringify(data));

      this.canDoSurvey = !this.canDoSurvey;

    }, error => () => {
      console.log('Verify Was error', error);
    }, () => {
      console.log('Verify  complete');
    });



  }


}
