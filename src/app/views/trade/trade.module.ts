import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TradeRoutingModule } from './trade-routing.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerDetailComponent } from './customerDetail/customerDetail.component';
import { CustomerListComponent, GroupCodeStrPipe, CustomerFullnamePipe } from './customer-list/customer-list.component';
import { SaleDialogComponent } from './dialog/sale-dialog/sale-dialog.component';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ResultDialogComponent } from './dialog/result-dialog/result-dialog.component';
import { WorkFlowComponent, WfStatusPipe } from './work-flow/work-flow.component';
import { WorkFlowActDialogComponent } from './dialog/work-flow-act-dialog/work-flow-act-dialog.component';
import { TradeDashComponent } from './trade-dash/trade-dash.component';
// import { EmployeeListComponent } from './employee-list/employee-list.component';
// import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AuthorityComponent } from './authority/authority.component';
import { MitGroupComponent, StatusTransform } from './mit-group/mit-group.component';
import { MitApplicationComponent } from './mit-application/mit-application.component';
import { MitGroupDetailComponent, AuthorityFlagPipe } from './mit-group-detail/mit-group-detail.component';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AddAuthorityDialogComponent } from './dialog/add-authority-dialog/add-authority-dialog.component';
import { UserLevelComponent } from './user-level/user-level.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserLevelDialogComponent } from './dialog/user-level-dialog/user-level-dialog.component';
import { UserGroupDialogComponent } from './dialog/user-group-dialog/user-group-dialog.component';
import { ApplicationDialogComponent } from './dialog/application-dialog/application-dialog.component';
import { ConnextCalendarComponent } from './connext-calendar/connext-calendar.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AnoucementComponent } from './anoucement/anoucement.component';
import { AnoucementDialogComponent } from './dialog/anoucement-dialog/anoucement-dialog.component';
import { SuitTreeViewComponent } from './suit-tree-view/suit-tree-view.component';
import { SuitComponent } from './suit/suit.component';
import { CustCDDComponent } from './cust-cdd/cust-cdd.component';
import { CustAddrComponent } from './cust-addr/cust-addr.component';
import { SuitChartComponent } from './suit-chart/suit-chart.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ChildrenDialogComponent } from './dialog/children-dialog/children-dialog.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SuitResultTableComponent } from './suit-result-table/suit-result-table.component';
import { LedInspDashComponent } from './led-insp-dash/led-insp-dash.component';
import { LedInspDetailComponent } from './led-insp-detail/led-insp-detail.component';
import { LedInspSearchComponent } from './led-insp-search/led-insp-search.component';
import { LedMasSearchComponent } from './led-mas-search/led-mas-search.component';
import { LedDetailComponent } from './led-detail/led-detail.component';
import { LedInspResultComponent } from './led-insp-result/led-insp-result.component';
import { LedInspHistoryComponent } from './led-insp-history/led-insp-history.component';
import { LedInspResourceComponent } from './led-insp-resource/led-insp-resource.component';
import { LedInspCustDetailComponent } from './dialog/led-insp-cust-detail/led-insp-cust-detail.component';
import { LedMasDetailComponent } from './dialog/led-mas-detail/led-mas-detail.component';

import { OpenAccountComponent } from './open-account/open-account.component';
import { SetRegistrationComponent } from './set-registration/set-registration.component';
import { RecaptchaModule } from 'angular-google-recaptcha';
import { NdidProxyComponent } from './ndid-proxy/ndid-proxy.component';
import { SetRegis2Component } from './set-regis2/set-regis2.component';
import { SetWelcomeComponent } from './set-welcome/set-welcome.component';
import { FcIndCustomerComponent } from './fc-ind-customer/fc-ind-customer.component';
import { SuitSurveyComponent } from './suit-survey/suit-survey.component';
import { SuitFormComponent } from './suit-form/suit-form.component';
import { NewMobileDialogComponent } from './dialog/new-mobile-dialog/new-mobile-dialog.component';
import { SurveySearchComponent } from './survey-search/survey-search.component';
import { dateDBFormatPipe } from './pipe/dateFormatPipe';
import { KycDetailDialogComponent } from './dialog/kyc-detail-dialog/kyc-detail-dialog.component';
import { SurveySearchActionDialogComponent } from './dialog/surveySearch-action-dialog/surveySearch-action-dialog.component';

import { NgxFloatButtonModule } from 'ngx-float-button';
import { BankAccountDialogComponent } from './dialog/bank-account-dialog/bank-account-dialog.component';
import { FCUtilityComponent } from './fcutility/fcutility.component';
import { FcInvesCompDialogComponent } from './dialog/fc-inves-comp-dialog/fc-inves-comp-dialog.component';
import { TestGraphQLComponent } from './test-graph-ql/test-graph-ql.component';
import { OpenAccountFirstComponent } from './open-account-first/open-account-first.component';

// Pipe
import { LedReqStatusPipeComponent } from './pipe/led-req-status-pipe/led-req-status-pipe.component';
import { genderTransform } from './pipe/personalPipe';
import { CrmPersonalComponent } from './crm-personal/crm-personal.component';
import { CrmPersonalSearchComponent } from './crm-personal-search/crm-personal-search.component';
import { CrmPersonalDataComponent } from './crm-personal-data/crm-personal-data.component';
import { CrmActivityComponent } from './crm-activity/crm-activity.component';
import { CrmActDashboardComponent } from './crm-act-dashboard/crm-act-dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    TradeRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ChartsModule,
    TabsModule.forRoot(),
    ReactiveFormsModule,
    RecaptchaModule.forRoot({
        siteKey: '6LeupK8UAAAAAECl56nM-7H1Q1L_q1kF6rEN-yxy',
    }),
    BsDropdownModule.forRoot(),
    NgxFloatButtonModule,

  ],
  declarations: [
    SummaryRepComponent,
    CustomerDetailComponent,

    CustomerListComponent,
    SaleDialogComponent,
    ResultDialogComponent,
    GroupCodeStrPipe,
    AuthorityFlagPipe,
    CustomerFullnamePipe,
    StatusTransform,
    WorkFlowComponent,
    WorkFlowActDialogComponent,
    WfStatusPipe,
    TradeDashComponent,
    UserListComponent,
    UserDetailComponent,
    AuthorityComponent,
    MitGroupComponent,
    MitApplicationComponent,
    MitGroupDetailComponent,
    ConfirmationDialogComponent,
    AddAuthorityDialogComponent,
    UserLevelComponent,
    UserGroupComponent,
    UserLevelDialogComponent,
    UserGroupDialogComponent,
    ApplicationDialogComponent,
    ConnextCalendarComponent,
    AnoucementComponent,
    AnoucementDialogComponent,

    SuitComponent,
    SuitTreeViewComponent,
    CustCDDComponent,
    CustAddrComponent,
    SuitChartComponent,
    PersonalInfoComponent,
    ChildrenDialogComponent,
    SuitResultTableComponent,
    LedInspDashComponent,
    LedInspDetailComponent,
    LedInspSearchComponent,
    LedMasSearchComponent,
    LedDetailComponent,
    LedInspResultComponent,
    LedInspHistoryComponent,
    LedInspResourceComponent,
    LedInspCustDetailComponent,
    LedMasDetailComponent,
    LedReqStatusPipeComponent,
    OpenAccountComponent,
    SetRegistrationComponent,
    NdidProxyComponent,
    SetRegis2Component,
    SetWelcomeComponent,
    FcIndCustomerComponent,
    SuitSurveyComponent,
    SuitFormComponent,
    NewMobileDialogComponent,
    SurveySearchComponent,
    dateDBFormatPipe,
    KycDetailDialogComponent,
    SurveySearchActionDialogComponent,
    BankAccountDialogComponent,
    FCUtilityComponent,
    FcInvesCompDialogComponent,
    TestGraphQLComponent,
    OpenAccountFirstComponent,
    genderTransform,
    CrmPersonalComponent,
    CrmPersonalSearchComponent,
    CrmPersonalDataComponent,
    CrmActivityComponent,
    CrmActDashboardComponent,
  ],
  providers: [DatePipe],
  entryComponents: [
    SaleDialogComponent,
    ResultDialogComponent,
    WorkFlowActDialogComponent,
    ConfirmationDialogComponent,
    AddAuthorityDialogComponent,
    UserLevelDialogComponent,
    UserGroupDialogComponent,
    ApplicationDialogComponent,
    AnoucementDialogComponent,
    ChildrenDialogComponent,
    LedInspCustDetailComponent,
    LedMasDetailComponent,
    NewMobileDialogComponent,
    KycDetailDialogComponent,
    SurveySearchActionDialogComponent,
    BankAccountDialogComponent,
    FcInvesCompDialogComponent
  ],
})
export class TradeModule {

}

