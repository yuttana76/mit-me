import { Component, OnInit } from '@angular/core';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { WorkFlowService } from '../services/workFlow.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss']
})
export class WorkFlowComponent implements OnInit {

  form: FormGroup;

  spinnerLoading = false;
  WorkFlowTrans;
  wfcomment = '';

  constructor(private workFlowService: WorkFlowService) { }

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
      this.WorkFlowTrans = data;
    });

  }

  resetForm() {
    this.WorkFlowTrans = null;
  }

  onApprove(wfRef: string, SeqNo: string) {
    console.log('On Approve>>' + wfRef +  ' ;SeqNo:' + SeqNo  + ' ;Comment=' + this.wfcomment);

    this.workFlowService.upWorkFlow(this.form.value.refNo, SeqNo, 'Y', this.wfcomment, 'BOM');
  }

  onReject(wfRef: string, SeqNo: string) {
    console.log('On Reject>>' + wfRef +  ' ;SeqNo:' + SeqNo  + ' ;Comment=' + this.wfcomment);
  }
}

