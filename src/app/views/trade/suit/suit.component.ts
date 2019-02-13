import { Component, OnInit } from '@angular/core';
import { SuitFormService } from './suit.service';

import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Question, Choice } from '../suit-tree-view/question';
import { SuitTreeViewComponent } from '../suit-tree-view/suit-tree-view.component';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-suit',
  templateUrl: './suit.component.html',
  styleUrls: ['./suit.component.scss'],
})
export class SuitComponent implements OnInit {

  spinnerLoading = false;
  canDoSuit = false;

  private _hasData: string;

  questions: Array<Question>;

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this._hasData = params['has'];
      console.log('**has>>' + this._hasData); // Print the parameter to the console.

      // this.spinnerLoading = false;
    });

    this.loadQuestions();
  }

  ngOnInit() {
    // this.spinnerLoading = true;
  }


  loadQuestions() {


    this.questions = [this.formService.q1, this.formService.q2, this.formService.q3, this.formService.q4, this.formService.q5, this.formService.q6, this.formService.q7, this.formService.q8, this.formService.q9, this.formService.q10, this.formService.s11, this.formService.s12];

  }

  public verify() {

    // this.userService.verifyExtLink('41121225');
    this.canDoSuit = !this.canDoSuit;
  }


}
