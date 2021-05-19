import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customerDetail/customerDetail.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { TradeDashComponent } from './trade-dash/trade-dash.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MitApplicationComponent } from './mit-application/mit-application.component';
import { MitGroupComponent } from './mit-group/mit-group.component';
import { AuthorityComponent } from './authority/authority.component';
import { MitGroupDetailComponent } from './mit-group-detail/mit-group-detail.component';
import { ConnextCalendarComponent } from './connext-calendar/connext-calendar.component';
import { AnoucementComponent } from './anoucement/anoucement.component';
import { SuitComponent } from './suit/suit.component';
import { LedInspDashComponent } from './led-insp-dash/led-insp-dash.component';
import { LedInspDetailComponent } from './led-insp-detail/led-insp-detail.component';
import { LedInspSearchComponent } from './led-insp-search/led-insp-search.component';
import { LedMasSearchComponent } from './led-mas-search/led-mas-search.component';
import { LedDetailComponent } from './led-detail/led-detail.component';
import { LedInspResultComponent } from './led-insp-result/led-insp-result.component';
import { LedInspCustDetailComponent } from './dialog/led-insp-cust-detail/led-insp-cust-detail.component';
import { OpenAccountComponent } from './open-account/open-account.component';
import { SetRegistrationComponent } from './set-registration/set-registration.component';
import { SetRegis2Component } from './set-regis2/set-regis2.component';
import { SetWelcomeComponent } from './set-welcome/set-welcome.component';
import { SurveySearchComponent } from './survey-search/survey-search.component';
import { FCUtilityComponent } from './fcutility/fcutility.component';
import { OpenAccountFirstComponent } from './open-account-first/open-account-first.component';
import { CrmPersonalDataComponent } from './crm-personal-data/crm-personal-data.component';
import { CrmPersonalSearchComponent } from './crm-personal-search/crm-personal-search.component';
import { CrmActivityComponent } from './crm-activity/crm-activity.component';
import { CrmActDashboardComponent } from './crm-act-dashboard/crm-act-dashboard.component';
import { CrmMarketManagerComponent } from './crm-market-manager/crm-market-manager.component';
import { CrmTaskComponent } from './crm-task/crm-task.component';
import { CrmTaskSearchComponent } from './crm-task-search/crm-task-search.component';
import { SttOpenSearchAppComponent } from './stt-open-search-app/stt-open-search-app.component';
import { SttOpenDetailComponent } from './stt-open-detail/stt-open-detail.component';

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
        path: 'userEdit/:userid/:source',
        component: UserDetailComponent,
        data: {
          title: 'Edit User '
        }
      },
      {
        path: 'mitApplication',
        component: MitApplicationComponent,
        data: {
          title: 'Mit Applications'
        }
      },
      {
        path: 'mitGroup',
        component: MitGroupComponent,
        data: {
          title: 'Groups'
        }
      },
      {
        path: 'newGroup',
        component: MitGroupDetailComponent,
        data: {
          title: 'New Group'
        }
      },
      {
        path: 'editGroup/:GroupId/:source',
        component: MitGroupDetailComponent,
        data: {
          title: 'Group Detail'
        }
      },
      // {
      //   path: 'authority',
      //   component: AuthorityComponent,
      //   data: {
      //     title: 'Authority'
      //   }
      // },
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
      {
        path: 'connextCalendar',
        component: ConnextCalendarComponent,
        data: {
          title: 'Fund Connext Calendar'
        }
      },
      {
        path: 'anoucementr',
        component: AnoucementComponent,
        data: {
          title: 'Anoucement'
        }
      },
      {
        path: 'suit/:id/:source',
        component: SuitComponent,
        data: {
          title: 'Internal Suitability'
        }
      },
// LED
      {
        path: 'led-insp-dash',
        component: LedInspDashComponent,
        data: {
          title: 'LED Dashboard'
        }
      },

      {
        path: 'led-insp-result',
        component: LedInspResultComponent,
        data: {
          title: 'LED Result'
        }
      },
      {
        path: 'led-insp-detail/:key/:source',
        component: LedInspDetailComponent,
        data: {
          title: 'LED Inspecton Detail'
        }
      },
      {
        path: 'led-insp-search',
        component: LedInspSearchComponent,
        data: {
          title: 'LED Inspection Search'
        }
      },
      {
        path: 'led-insp-search/:formScreen/:chooseDate/:led_state',
        component: LedInspSearchComponent,
        data: {
          title: 'LED Inspection Search (Dash) '
        }
      },
      {
        path: 'led-mas-search',
        component: LedMasSearchComponent,
        data: {
          title: 'LED Search'
        }
      },
      {
        path: 'led-detail',
        component: LedDetailComponent,
        data: {
          title: 'LED detail'
        }
      },
      {
        path: 'led-insp-result',
        component: LedInspResultComponent,
        data: {
          title: 'LED Result'
        }
      },
      {
        path: 'led-insp-cust-detail',
        component: LedInspCustDetailComponent,
        data: {
          title: 'Inspection detail'
        }
      },
      {
        path: 'open-account',
        component: OpenAccountComponent,
        data: {
          title: 'Open account'
        }
      },
      {
        path: 'open-account-first',
        component: OpenAccountFirstComponent,
        data: {
          title: 'Open account first step'
        }
      },
      {
        path: 'set-regis',
        component: SetRegistrationComponent,
        data: {
          title: 'Streaming For Fund registration'
        }
      },
      {
        path: 'FCUtility',
        component: FCUtilityComponent,
        data: {
          title: 'FundConnext Utilities'
        }
      },

      {
        path: 'set-regis2',
        component: SetRegis2Component,
        data: {
          title: 'Streaming For Fund registration(V.2)'
        }
      },
      {
        path: 'set-welcome',
        component: SetWelcomeComponent,
        data: {
          title: 'Welcome Streaming For Fund'
        }
      },
      {
        path: 'surveySearch',
        component: SurveySearchComponent,
        data: {
          title: 'Welcome Servey Search'
        }
      },

      {
        path: 'CRM-Personal-Data/:cust_Code/:source',
        component: CrmPersonalDataComponent,
        data: {
          title: 'Welcome CRM Personal Data'
        }
      },
      {
        path: 'CRM-Personal-Search',
        component: CrmPersonalSearchComponent,
        data: {
          title: 'Welcome CRM Personal Search'
        }
      },
      {
        path: 'CRM-Activity',
        component: CrmActivityComponent,
        data: {
          title: 'Welcome CRM Activity'
        }
      },
      {
        path: 'CRM-ActDash',
        component: CrmActDashboardComponent,
        data: {
          title: 'Welcome CRM Activity Dashboard'
        }
      },
      {
        path: 'CRM-Market-Manager',
        component: CrmMarketManagerComponent,
        data: {
          title: 'Welcome CRM Marketing Manage'
        }
      },
      {
        // path: 'CRM-Task',
        path: 'CRM-Task/:taskId/:source/:CustCode',
        component: CrmTaskComponent,
        data: {
          title: 'Welcome CRM Task'
        }
      },
      {
        // path: 'CRM-Task',
        path: 'CRM-Task-Search',
        component: CrmTaskSearchComponent,
        data: {
          title: 'Welcome CRM Task Search'
        }
      },
      {
        // path: 'CRM-Task',
        path: 'STT-Eopen-Search',
        component: SttOpenSearchAppComponent,
        data: {
          title: 'Welcome STT E-Open search'
        }
      },
      {
        // path: 'CRM-Task',
        path: 'STT-Eopen-Detail/:appId/:source',
        component: SttOpenDetailComponent,
        data: {
          title: 'Welcome STT E-Open detail'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class TradeRoutingModule {}
