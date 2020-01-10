import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customerDetail/customerDetail.component';
import { WorkFlowComponent } from './work-flow/work-flow.component';
import { TradeDashComponent } from './trade-dash/trade-dash.component';
import { P404Component } from '../error/404.component';
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
import { FCAppComponent } from './fcapp/fcapp.component';
import { SetRegis2Component } from './set-regis2/set-regis2.component';
import { SetWelcomeComponent } from './set-welcome/set-welcome.component';
import { SurveySearchComponent } from './survey-search/survey-search.component';

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
        path: 'suit',
        component: SuitComponent,
        data: {
          title: 'Suitability'
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
        path: 'set-regis',
        component: SetRegistrationComponent,
        data: {
          title: 'Streaming For Fund registration'
        }
      },

      {
        path: 'FCApp',
        component: FCAppComponent,
        data: {
          title: 'FundConnext Applications'
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
    ]
  },
  // {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class TradeRoutingModule {}
