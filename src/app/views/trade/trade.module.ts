import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TradeRoutingModule } from './trade-routing.module';

import { SummaryRepComponent } from './summary-rep/summary-rep.component';
import { AngularMaterialModule } from '../../angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TradeRoutingModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ SummaryRepComponent ]
})
export class TradeModule {}

