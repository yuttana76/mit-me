import { Component, OnInit, OnDestroy } from '@angular/core';
import { FundService } from '../services/fund.service';
import { Fund } from '../services/fund.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary-rep',
  templateUrl: './summary-rep.component.html',
  styleUrls: ['./summary-rep.component.scss']
})

export class SummaryRepComponent implements OnInit, OnDestroy {

  funds: Fund[] = [];
  private fundsSub: Subscription;

  constructor(
    private fundService: FundService
    ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    try {
      this.fundsSub.unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }

  onGetFund() {

    this.fundService.getFunds(1, 5);

    this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
      this.funds = funds;
      console.log('Final Fund>>' + JSON.stringify(this.funds) );
    });

  }

}
