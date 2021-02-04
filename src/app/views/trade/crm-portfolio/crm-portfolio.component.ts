import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { CrmPersonModel } from '../model/crmPersonal.model';
import { CrmPersonalService } from '../services/crmPerson.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-crm-portfolio',
  templateUrl: './crm-portfolio.component.html',
  styleUrls: ['./crm-portfolio.component.scss']
})
export class CrmPortfolioComponent implements OnInit {

  @Input() custCode: string;
  // @Input() personal: CrmPersonModel;


// LBDU
/*
  lbdu_list=[{'Code':'KF-RMF','Val':'100,000.00'}
  ,{'Code':'KFGTECHRMF', 'Val':'144,059.82'}
  ,{'Code':'KF-SSF', 'Val':'20,569.98'}
  ,{'Code':'TISCO-SSF', 'Val':'50,123.98'}
  ,{'Code':'KBANK-SSF', 'Val':'5123.98'}
 ];
*/
 lbdu_list=[];
 lbdu_displayedColumns: string[] = ['Code', 'Val','UPL'];
 lbdu_dataSource = new BehaviorSubject(this.lbdu_list);

//  PRIVATE

//  private_list=[{'Code':'PF001', 'Val':'20,000,000'}
//   ,{'Code':'PF002', 'Val':'50,000,000'}
//  ];

private_list=[];
private_displayedColumns: string[] = ['Code', 'Val'];
private_dataSource = new BehaviorSubject(this.private_list);

//  BOND
/*
 bond_list=[{'Code':'CHAIYO', 'Val':'1,000,000'}
  ,{'Code':'SANSIRI', 'Val':'2,000,000'}
  ,{'Code':'MAGNOLIA', 'Val':'10,000,000'}
 ];
*/

bond_list=[];
bond_displayedColumns: string[] = ['Code', 'Val'];
bond_dataSource = new BehaviorSubject(this.bond_list);

  constructor(
    private crmPersonalService: CrmPersonalService,
    private toastr: ToastrService,
  ) {
    console.log("***CrmPortfolioComponent()>> constructor custCode:" + this.custCode);
  }

  ngOnInit() {
    console.log("***CrmPortfolioComponent()>> ngOnInit custCode:" + this.custCode);
  }

  getPortfolio(){
    // console.log("***getPortfolio()" + this.custCode);
    var fnArray=[];
    fnArray.push(this.crmPersonalService.getPortfolio(this.custCode));

    forkJoin(fnArray)
    //  .subscribe(([call1Response, call2Response]) => {
     .subscribe((dataRs:any) => {

      console.log( " getPortfolio>>" +JSON.stringify(dataRs[0].lbdu))

      this.lbdu_list = dataRs[0].lbdu[0]
      // let private_data = dataRs[0].private
      // let bond_data = dataRs[0].bond

          // this.lbdu_list = dataRs[0].lbdu;
          this.lbdu_dataSource.next(this.lbdu_list);

      // console.log( " *** lbdu_data>>" +JSON.stringify(this.lbdu_list))
      // console.log( " *** private_data>>" +JSON.stringify(private_data))
      // console.log( " *** bond_data>>" +JSON.stringify(bond_data))

     });

  }
}
