import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customerDetail/customerDetail.component';

const routes: Routes = [
  {
    path: '',
    // component: SummaryRepComponent,
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
  },
  {
    path: '',
    data: {
      title: 'Account Management'
    },
    children: [
      {
        path: 'customerList',
        component: CustomerListComponent,
        data: {
          title: 'Customer Information !'
        }
      },
      {
        path: 'customerDetail',
        component: CustomerDetailComponent,
        data: {
          title: 'Customer Detail !'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule {}
