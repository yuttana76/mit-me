import { NgModule } from '@angular/core';

import { TradeRoutingModule } from './trade-routing.module';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';

@NgModule({
  imports: [
    TradeRoutingModule,
  ],
  declarations: [ SummaryRepComponent ]
})
export class TradeModule {}

