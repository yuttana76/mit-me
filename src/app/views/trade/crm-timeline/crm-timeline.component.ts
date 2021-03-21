import { Component, Input, OnInit } from '@angular/core';
import { CrmPersonModel } from '../model/crmPersonal.model';

@Component({
  selector: 'app-crm-timeline',
  templateUrl: './crm-timeline.component.html',
  styleUrls: ['./crm-timeline.component.scss']
})
export class CrmTimelineComponent implements OnInit {
  @Input() personal: CrmPersonModel;
  constructor() { }

  ngOnInit() {
  }

}
