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

@NgModule({
  imports: [
    CommonModule,
    TradeRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot()
  ],
  declarations: [
    SummaryRepComponent,
    CustomerDetailComponent,
    CustomerListComponent,
    SaleDialogComponent,
    ResultDialogComponent,
    GroupCodeStrPipe,
    CustomerFullnamePipe,
    WorkFlowComponent,
    WorkFlowActDialogComponent,
    WfStatusPipe,
    // MasterDataComponent,
  ],
  providers: [DatePipe],
  entryComponents: [  SaleDialogComponent, ResultDialogComponent, WorkFlowActDialogComponent],
})
export class TradeModule {}

