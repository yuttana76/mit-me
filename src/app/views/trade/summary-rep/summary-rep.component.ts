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
  funds: Fund[] = [];
  amcs: Amc[] = [];


  private fundsSub: Subscription;
  private amcSub: Subscription;


  constructor(
    private fundService: FundService,
    private amcService: AmcService,
    private authorityService: AuthorityService,
    private authService: AuthService,
    private reportsService: ReportsService
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
        validators: [Validators.required]
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
      this.funds = funds;
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

  onGetFund() {

    this.fundService.getFunds(1, 5);
    this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
      this.funds = funds;
    });
  }

  onExecute() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    // console.log( 'NEXT FORM VALUES>>' + this.form.value.amc);
    // const result = this.reportsService.getSummaryReport('2018-02-01', '2018-03-30', 'TMBAM', 'TMBPIPF-X');

    const result = this.reportsService.getSummaryReport(
        this.reportGeneral.startDate,
        this.reportGeneral.endDate,
        this.reportGeneral.amc,
        this.reportGeneral.fund);

    result.subscribe(fileData => {
        fileSaver.saveAs(fileData, 'summaryReport.pdf');  // Save file to download folder
    },
      err => {
          alert('Server error while downloading file.');
      }
  );
  }

  reset() {
    console.log('Reset()');

  }

}
