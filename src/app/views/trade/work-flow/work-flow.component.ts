import { Component, OnInit, PipeTransform, Pipe, OnDestroy } from '@angular/core';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { WorkFlowService } from '../services/workFlow.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkFlowActDialogComponent } from '../dialog/work-flow-act-dialog/work-flow-act-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ResultDialogComponent } from '../dialog/result-dialog/result-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../services/user.service';
import { WipCustomerService } from '../services/wipCustomer.service';


@Pipe({name: 'wfStatusPipe'})
export class WfStatusPipe implements PipeTransform {
  transform(value: string): string {

    let newStr = '';
    if (value === 'Y') {
      newStr = 'APPROVED';
    } else if (value === 'R') {
      newStr = 'REJECTED';
    } else {
      newStr = '';
    }

    return newStr;
  }
}

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss']
})
export class WorkFlowComponent implements OnInit, OnDestroy {


  form: FormGroup;

  spinnerLoading = false;
  private wfMsgListtener: Subscription;
  // WorkFlowTrans;
  // wfcomment = '';

  // displayedColumns: string[] = ['position', 'action', 'flow', 'status', 'create','comment'];
  displayedColumns: string[] = ['position', 'flow', 'status', 'create', 'comment'];
  dataSource ;
  isReject = false;
  userLevelDb;

  // Dialog
  workFlowActDialogRef: MatDialogRef<WorkFlowActDialogComponent>;

  constructor(
    private workFlowService: WorkFlowService,
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService,
    private wipCustomerService: WipCustomerService,
    private router: Router
    ) { }

  ngOnInit() {

    this.form = new FormGroup({
      refNo: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.wfMsgListtener = this.workFlowService.getWfMsgListener().subscribe(({msgType, msg}) => {
      // this.spinnerLoading = false;
      this.openDialog(msgType, 'Thank you',  msg );

    });

  }

  ngOnDestroy() {
    this.wfMsgListtener.unsubscribe();
    console.log('WF. ngOnDestroy() ');
  }

  // onRestoreWIP() {
  //   this.wipCustomerService.restoreWIPCustomer(this.form.value.refNo, this.authService.getUserData() || '123' ).subscribe(data => {
  //     console.log('restoreWIPCustomer(RS)>>', JSON.stringify(data));
  //   });
  // }

  searchWorkFlow() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    // Load customer(Account) info.
    this.workFlowService.getWorkFlow(this.form.value.refNo).subscribe(data => {

      console.log('WF. RS>>',data);

      this.spinnerLoading = false;
      this.dataSource = data;
    }, error => () => {
      console.log('Was error', error);
  }, () => {

    // Find Reject status
    if ( this.dataSource ) {
      const  workFlowTrans = this.dataSource.filter(function (i, n) {
          return i.WFStatus === 'R';
        })[0];
        this.isReject = workFlowTrans ? true : false;
    }

    this.CanApprove();

  });

  }

  resetForm() {
    this.dataSource = null;
  }

  onAction(row) {

  row.ActionBy = this.authService.getUserData();
  this.workFlowActDialogRef = this.dialog.open(WorkFlowActDialogComponent, {
    width: '600px',
    data: row
  });

  this.workFlowActDialogRef.afterClosed().subscribe(result => {

  });
}


onView(row) {
  console.log('VIEW>>', JSON.stringify(row));
}

  openDialog(alertTypeStr: string, alertHeaderStr: string, alertMsgStr: string): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '450px',
      // tslint:disable-next-line:max-line-length
      data: {alertType: alertTypeStr , alertHeader: alertHeaderStr , alertMsg: alertMsgStr}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
      // if (this.saveCustomerComplete) {
        this.router.navigate(['/']);
      // }

    });
  }

  CanApprove() {
    // Get current level
    if ( this.isReject ) {
       return null;
    }

    const _workFlowTrans = this.dataSource.filter(function (i, n) {
      return i.WFStatus === 'N';
    })[0];

    if ( this.authService.getUserData()) {

      // Get User Level by AppId
      if ( _workFlowTrans) {
        this.userService.getUserLevel( this.authService.getUserData(), _workFlowTrans.AppId ).subscribe(result => {
          this.userLevelDb = result[0];

          if ( this.userLevelDb.Level === _workFlowTrans.Level ) {
            _workFlowTrans.CanAction = true;
          }

        });

    }
  }
}

}
