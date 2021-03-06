import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TradeRoutingModule } from './trade-routing.module';

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
    })
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
    // EmployeeListComponent,
    // EmployeeDetailComponent,
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
    // MasterDataComponent,
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
    AnoucementDialogComponent
  ],
})
export class TradeModule {

}

