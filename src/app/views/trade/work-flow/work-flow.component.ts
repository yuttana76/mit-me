import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { WorkFlowService } from '../services/workFlow.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkFlowActDialogComponent } from '../dialog/work-flow-act-dialog/work-flow-act-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';


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
export class WorkFlowComponent implements OnInit {

  form: FormGroup;

  spinnerLoading = false;
  // WorkFlowTrans;
  // wfcomment = '';

  displayedColumns: string[] = ['position', 'action', 'flow', 'status', 'create','comment'];
  dataSource ;


  // Dialog
  workFlowActDialogRef: MatDialogRef<WorkFlowActDialogComponent>;

  constructor(
    private workFlowService: WorkFlowService,
    public dialog: MatDialog) { }

  ngOnInit() {

    this.form = new FormGroup({
      refNo: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

  }

  searchWorkFlow() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    console.log('RefNo>>', this.form.value.refNo);

    // Load customer(Account) info.
    this.workFlowService.getWorkFlow(this.form.value.refNo).subscribe(data => {
      this.spinnerLoading = false;
      console.log('WK RS >>' , JSON.stringify(data));
      this.dataSource = data;
    });

  }

  resetForm() {
    this.dataSource = null;
  }

  TestForm() {

    console.log('TestForm >>', this.form.value.refNo);

    this.workFlowService.workFLowGoNext(this.form.value.refNo);

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

    console.log('Result Dialog>>', JSON.stringify(this.dataSource));

    // if ( result && result !== 'close' ) {
    //   // const saleObj = result;
    //   // this.customer.MktId = saleObj.Id;
    // }
  });
}

  // onApprove(wfRef: string, SeqNo: string) {
  //   console.log('On Approve>>' + wfRef +  ' ;SeqNo:' + SeqNo  + ' ;Comment=' + this.wfcomment);

  //   this.workFlowService.upWorkFlow(this.form.value.refNo, SeqNo, 'Y', this.wfcomment, 'BOM');
  // }

  // onReject(wfRef: string, SeqNo: string) {
  //   console.log('On Reject>>' + wfRef +  ' ;SeqNo:' + SeqNo  + ' ;Comment=' + this.wfcomment);
  // }
}

