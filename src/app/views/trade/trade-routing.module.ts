import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customerDetail/customerDetail.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { TradeDashComponent } from './trade-dash/trade-dash.component';
import { P404Component } from '../error/404.component';

const routes: Routes = [

  {
    path: '',
    // component: SummaryRepComponent,
    data: {
      title: 'Trade Dashboard'
    },
    children: [
      {
        path: 'TradeDash',
        component: TradeDashComponent,
        data: {
          title: 'Trade Dashboard'
        }
      }]
  },
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
      {
        path: 'customerEdit/:cust_Code/:source',
        component: CustomerDetailComponent,
        data: {
          title: 'Edit Customer '
        }
      },
      {
        path: 'workflow',
        component: WorkFlowComponent,
        data: {
          title: 'Work flow '
        }
      },
    ]
  },
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule {}
