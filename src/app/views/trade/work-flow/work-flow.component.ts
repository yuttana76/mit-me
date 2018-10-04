import { Component, OnInit } from '@angular/core';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { WorkFlowService } from '../services/workFlow.service';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss']
})
export class WorkFlowComponent implements OnInit {

  spinnerLoading = false;
  WorkFlowTrans;

  constructor(private workFlowService: WorkFlowService) { }

  ngOnInit() {

    // Load customer(Account) info.
    this.workFlowService.getWorkFlow('0105541011867').subscribe(data => {
      this.spinnerLoading = false;
      console.log('WK init >>' , JSON.stringify(data));
      this.WorkFlowTrans = data;
    });
  }

}

