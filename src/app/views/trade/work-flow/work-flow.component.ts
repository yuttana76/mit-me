import { Component, OnInit } from '@angular/core';
import { WorkFlowTrans } from '../model/workFlowTrans.model';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss']
})
export class WorkFlowComponent implements OnInit {

  spinnerLoading = false;

  constructor() { }

  ngOnInit() {
  }

}

