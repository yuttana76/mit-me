import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import { ToastrModule } from 'ngx-toastr';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { TabsModule } from 'ngx-bootstrap/tabs';
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthInterceptor } from './views/services/auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { CustomErrorComponent } from './views/error/customError.component';
import { AngularMaterialModule } from './angular-material.module';
import { SuitComponent } from './views/trade/suit/suit.component';
import { SuitTreeViewComponent } from './views/trade/suit-tree-view/suit-tree-view.component';
import { TradeModule } from './views/trade/trade.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { RecaptchaModule } from 'angular-google-recaptcha';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
// import { GraphQLModule } from './graphql.module';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    // TabsModule.forRoot(),
    ToastrModule.forRoot({
      // timeOut: 0,
      // tapToDismiss: false,
      // positionClass: 'toast-top-center',
      // positionClass: 'toast-top-right',
      // preventDuplicates: true,
    }), // ToastrModule added
    // ChartsModule,
    HttpClientModule,
    FormsModule,

    HttpClientModule,
    AngularMaterialModule,
    TradeModule,
    AccordionModule.forRoot(),
    CollapseModule.forRoot(),
    // GraphQLModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    CustomErrorComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [CustomErrorComponent]
})
export class AppModule {

}
