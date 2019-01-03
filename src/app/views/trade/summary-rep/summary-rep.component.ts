import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { Fund } from '../model/fund.model';
import { FundService } from '../services/fund.service';

import { Amc } from '../model/amc.model';
import { AmcService } from '../services/amc.service';

import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorityService } from '../services/authority.service';
import { AuthService } from '../../services/auth.service';
import { Authority } from '../model/authority.model';

import { ReportsService } from '../services/reports.service';
import fileSaver from 'file-saver';
import { ReportGeneral } from '../model/reportGeneral.model';
import * as moment from 'moment';
import { ShareDataService } from '../services/shareData.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-summary-rep',
  templateUrl: './summary-rep.component.html',
  styleUrls: ['./summary-rep.component.scss']
})

export class SummaryRepComponent implements OnInit, OnDestroy {

  @ViewChild('repContent') content: ElementRef;

  spinnerLoading = false;
  form: FormGroup;
  public authority: Authority = new Authority();
  private appId = 'sumRep';
  public YES_VAL = 'Y';

  reportGeneral: ReportGeneral = new ReportGeneral();
  amcs: Amc[] = [];
  fundsMaster: Fund[] = [];
  funds: Fund[] = [];
  all_FundItem = new Fund('0', 'All', 'All', '0');

  private fundsSub: Subscription;
  private amcSub: Subscription;


  constructor(
    private fundService: FundService,
    private amcService: AmcService,
    private authorityService: AuthorityService,
    private authService: AuthService,
    private reportsService: ReportsService,
    private shareDataService: ShareDataService,
    private toastr: ToastrService,
    ) { }


  ngOnInit() {

    // Permission
    this.authorityService.getPermissionByAppId(this.authService.getUserData(), this.appId).subscribe( (auth: Authority[]) => {

      auth.forEach( (element) => {
        this.authority = element;
      });

    });

    this.spinnerLoading = true;
    this.form = new FormGroup({
      startDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      endDate: new FormControl(null, {
        // validators: [Validators.required]
      }),
      amc: new FormControl(null, {
        validators: [Validators.required]
      }),
      fund: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
/*
    Initial Fund
*/
    this.fundService.getFunds(1, 5);
    this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
      this.fundsMaster = funds;
      // console.log('Final Fund>>' + JSON.stringify(this.funds) );
    });

    this.amcService.getAmc();
    this.amcSub = this.amcService.getAmcUpdateListener().subscribe((amc: Amc[]) => {
      this.amcs = amc;
      // console.log('AMC>>' + JSON.stringify(this.amcs) );
      this.spinnerLoading = false;
    });

  }

  ngOnDestroy(): void {
    try {

      this.fundsSub.unsubscribe();
      this.amcSub.unsubscribe();

    } catch (error) {
      console.log(error);
    }
  }

  // onGetFund() {
  //   this.fundService.getFunds(1, 5);
  //   this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
  //     this.fundsMaster = funds;
  //   });
  // }

  onExecute() {

    if (this.form.invalid) {
      // console.log('endDate>> ' + this.reportGeneral.endDate);
      return true;
    }

    const start_dateValue  = moment(this.reportGeneral.startDate).format(this.shareDataService.DB_DATE_FORMAT);
    let end_dateValue ;
    if ( this.reportGeneral.endDate ) {
      end_dateValue  = moment(this.reportGeneral.endDate).format(this.shareDataService.DB_DATE_FORMAT);
    }

    const _amcs: Amc[] = this.amcs.filter(element => element.amcid === this.reportGeneral.amc);
    const result = this.reportsService.getSummaryReport(
      start_dateValue,
      end_dateValue,
      _amcs[0].amcCode,
        this.reportGeneral.fund);

    result.subscribe(fileData => {

        if ( fileData) {
          fileSaver.saveAs(fileData, 'summaryReport.pdf');  // Save file to download folder
        } else {
          this.toastr.error( `Not found data for summary report`, 'Not found data', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
        }
    }, err => {
          // alert('Server error while downloading file.');
          this.toastr.error( `Server error while downloading file`, err, {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
      }
  );
  }

  reset() {
    console.log('Reset()');

  }

  amcChange(event: MatSelectChange) {

    // this.funds = this.fundsMaster.filter(element => element.Amc_Id === event.value);
    this.funds = this.fundsMaster.filter(element => element.Amc_Id === event.value);
    this.funds.unshift(this.all_FundItem);  // Add all description item to the beginning of an array
    this.reportGeneral.fund = '0';
    // console.log('FUND >>' + JSON.stringify(this.funds));
  }

}
