import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customerDetail/customerDetail.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { TradeDashComponent } from './trade-dash/trade-dash.component';
import { P404Component } from '../error/404.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

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
      title: 'Application'
    },
    children: [
      {
        path: 'userList',
        component: UserListComponent,
        data: {
          title: 'Seach User'
        }
      },
      {
        path: 'userDetail',
        component: UserDetailComponent,
        data: {
          title: 'User Detail'
        }
      },

      {
        path: 'employeeList',
        component: EmployeeListComponent,
        data: {
          title: 'Seach Employee'
        }
      },
      {
        path: 'employeeDetail',
        component: EmployeeDetailComponent,
        data: {
          title: 'Employee Detail'
        }
      },
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
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule {}
