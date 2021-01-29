import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CrmPersonModel } from '../model/crmPersonal.model';

@Component({
  selector: 'app-crm-portfolio',
  templateUrl: './crm-portfolio.component.html',
  styleUrls: ['./crm-portfolio.component.scss']
})
export class CrmPortfolioComponent implements OnInit {

  // @Input() custCode: string;
  @Input() personal: CrmPersonModel;


  lbdu_list=[{'Code':'KF-RMF','Val':'100,000.00'}
  ,{'Code':'KFGTECHRMF', 'Val':'144,059.82'}
  ,{'Code':'KF-SSF', 'Val':'20,569.98'}
  ,{'Code':'TISCO-SSF', 'Val':'50,123.98'}
  ,{'Code':'KBANK-SSF', 'Val':'5123.98'}
 ];

 lbdu_displayedColumns: string[] = ['Code', 'Val'];
 lbdu_dataSource = new BehaviorSubject(this.lbdu_list);

 private_list=[{'Code':'PF001', 'Val':'20,000,000'}
  ,{'Code':'PF002', 'Val':'50,000,000'}

 ];

 private_displayedColumns: string[] = ['Code', 'Val'];
 private_dataSource = new BehaviorSubject(this.private_list);

 bond_list=[{'Code':'CHAIYO', 'Val':'1,000,000'}
  ,{'Code':'SANSIRI', 'Val':'2,000,000'}
  ,{'Code':'MAGNOLIA', 'Val':'10,000,000'}

 ];

 bond_displayedColumns: string[] = ['Code', 'Val'];
 bond_dataSource = new BehaviorSubject(this.bond_list);

  constructor() { }

  ngOnInit() {
  }

}
