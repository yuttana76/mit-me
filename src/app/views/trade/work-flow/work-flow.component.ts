import { Component, OnInit, PipeTransform, Pipe, OnDestroy } from '@angular/core';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { WorkFlowService } from '../services/workFlow.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkFlowActDialogComponent } from '../dialog/work-flow-act-dialog/work-flow-act-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ResultDialogComponent } from '../dialog/result-dialog/result-dialog.component';
import { Router } from '@angular/router';


@Pipe({name: 'wfStatusPipe'})
export class WfStatusPipe implements PipeTransform {
  transform(value: string): string {

    let newStr: string = '';
    if (value === 'Y') {
      newStr = 'APPROVED';
    } else if (value === 'R') {
      newStr = 'REJECTED';
    } else {
      newStr = 'N/A';
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

  displayedColumns: string[] = ['position', 'action', 'flow', 'status', 'create','comment'];
  dataSource ;


  // Dialog
  workFlowActDialogRef: MatDialogRef<WorkFlowActDialogComponent>;

  constructor(
    private workFlowService: WorkFlowService,
    public dialog: MatDialog,
    private router: Router) { }

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
  }

  searchWorkFlow() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    // Load customer(Account) info.
    this.workFlowService.getWorkFlow(this.form.value.refNo).subscribe(data => {
      this.spinnerLoading = false;
      this.dataSource = data;
    });

  }

  resetForm() {
    this.dataSource = null;
  }

  TestForm() {

    console.log('TestForm >>', this.form.value.refNo);
    console.log('RETURN FN()>>', this.workFlowService.workFLowGoNext(this.form.value.refNo));

  }

  // onAction(row) {
  //   console.log("Action >>", JSON.stringify(row));
  // }

  onAction(row) {

  this.workFlowActDialogRef = this.dialog.open(WorkFlowActDialogComponent, {
    width: '600px',
    data: row
  });

  this.workFlowActDialogRef.afterClosed().subscribe(result => {

    // console.log('Result Dialog>>', JSON.stringify(this.dataSource));

    // if ( result && result !== 'close' ) {
    //   // const saleObj = result;
    //   // this.customer.MktId = saleObj.Id;
    // }

  });
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
}

