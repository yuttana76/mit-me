import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './views/services/auth/auth.guard';
import { SuitComponent } from './views/trade/suit/suit.component';
import { OpenAccountComponent } from './views/trade/open-account/open-account.component';
import { SetRegistrationComponent } from './views/trade/set-registration/set-registration.component';
import { SetRegis2Component } from './views/trade/set-regis2/set-regis2.component';
import { SetWelcomeComponent } from './views/trade/set-welcome/set-welcome.component';
import { SuitSurveyComponent } from './views/trade/suit-survey/suit-survey.component';
import { SurveySearchComponent } from './views/trade/survey-search/survey-search.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'trade/TradeDash',
    // redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  // Survey KYC,FATCA,Suitability
  {
    path: 'suit',
    component: SuitComponent,
    data: {
      title: 'Custom survey'
    }
  },
  // Survey only Suitability
  // {
  //   path: 'suit',
  //   component: SuitSurvey,
  //   data: {
  //     title: 'Suitability survey'
  //   }
  // },

  {
    path: 'suitSurvey',
    component: SuitSurveyComponent,
    data: {
      title: 'Suitability survey'
    }
  },
  {
    path: 'openAcc',
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
    path: 'set-regis2',
    component: SetRegis2Component,
    data: {
      title: 'Streaming For Fund registration V.2'
    }
  },
  {
    path: 'set-welcome',
    component: SetWelcomeComponent,
    data: {
      title: 'Welcome Streaming For Fund 1'
    }
  },
  // For devement; Delete on PROD
  {
    path: 'surveySearch',
    component: SurveySearchComponent,
    data: {
      title: 'Welcome Servey Search'
    }
  },

// For devement; Delete on PROD
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: './views/base/base.module#BaseModule'
      },
      {
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'trade',
        loadChildren: './views/trade/trade.module#TradeModule'
      },
    ]
  },
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
