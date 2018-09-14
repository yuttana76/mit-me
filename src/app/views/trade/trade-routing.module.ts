import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryRepComponent,
    data: {
      title: 'Summary Report'
    },
    children: [
      {
        path: 'SummaryRepport',
        component: SummaryRepComponent,
        data: {
          title: 'Summary Repport'
        }
      }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule {}
