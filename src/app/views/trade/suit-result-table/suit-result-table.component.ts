import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-suit-result-table',
  templateUrl: './suit-result-table.component.html',
  styleUrls: ['./suit-result-table.component.scss']
})
export class SuitResultTableComponent implements OnInit {

  @Input() riskLevel: string;

  constructor() { }

  ngOnInit() {
  }

}
