import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkFlowTrans } from '../../model/workFlowTrans.model';
import { WorkFlowService } from '../../services/workFlow.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-work-flow-act-dialog',
  templateUrl: './work-flow-act-dialog.component.html',
  styleUrls: ['./work-flow-act-dialog.component.scss']
})
export class WorkFlowActDialogComponent implements OnInit {

  workFlowTrans: WorkFlowTrans;
  constructor(
    private workFlowService: WorkFlowService,
    // private authService: AuthService,
    public dialogRef: MatDialogRef<WorkFlowActDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: WorkFlowTrans
  ) {
    this.workFlowTrans = data;
   }

  ngOnInit() {
  }

  onSave(): void {
    // this.workFlowTrans.ActionBy = this.authService.getUserData();
    this.workFlowService.updateWorkFlow(this.workFlowTrans);

    this.dialogRef.close('save');
  }

  onClose(): void {
    this.dialogRef.close('close');
  }
}
