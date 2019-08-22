import { Component, OnInit } from '@angular/core';
import { FcdownloadAPI } from '../model/fcdownloadAPI.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'app-fcapp',
  templateUrl: './fcapp.component.html',
  styleUrls: ['./fcapp.component.scss']
})
export class FCAppComponent implements OnInit {

  spinnerLoading = false;
  fileTypeList =[
    {value: 'FundMapping', display: 'FundMapping'},
    {value: 'FundProfile', display: 'FundProfile'},
    {value: 'FundHoliday', display: 'FundHoliday'},
    {value: 'SwitchingMatrix', display: 'SwitchingMatrix'},
    {value: 'TradeCalendar', display: 'TradeCalendar'},
    {value: 'AccountProfile', display: 'AccountProfile'},
    {value: 'UnitholderMapping', display: 'UnitholderMapping'},
    {value: 'BankAccountUnitholder', display: 'BankAccountUnitholder'},
    {value: 'CustomerProfile', display: 'CustomerProfile'},
    {value: 'Nav', display: 'Nav'},
    {value: 'UnitholderBalance', display: 'UnitholderBalance'},
    {value: 'AllottedTransactions', display: 'AllottedTransactions'},
    {value: 'DividendNews', display: 'DividendNews'},
    {value: 'DividendTransactions', display: 'DividendTransactions'},
  ]

  downloadForm: FormGroup;
  fcdownloadAPI:FcdownloadAPI = new FcdownloadAPI();
  canExeBtn:false;

  constructor() { }

  ngOnInit() {

    this.downloadForm = new FormGroup({
      fileType: new FormControl(null, {
        validators: [Validators.required]
      }),

      businessDate: new FormControl(null, {
        validators: [Validators.required]
      }),

    });

  }

  onChangeDate(event: MatDatepickerInputEvent<Date>) {
    // this.fcdownloadAPI.businessDate = formatDate(event.value, 'yyyyMMdd', 'en');
    console.log(" onChangeDate()!!!" + JSON.stringify(this.fcdownloadAPI));
  }

  downloadExe(){
    console.log(" downloadExe()!!!" + JSON.stringify(this.fcdownloadAPI));

  }

}
