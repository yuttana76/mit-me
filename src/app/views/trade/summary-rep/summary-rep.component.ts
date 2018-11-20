import { Component, OnInit, OnDestroy } from '@angular/core';

import { Fund } from '../model/fund.model';
import { FundService } from '../services/fund.service';

import { Amc } from '../model/amc.model';
import { AmcService } from '../services/amc.service';

import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorityService } from '../services/authority.service';
import { AuthService } from '../../services/auth.service';
import { Authority } from '../model/authority.model';


@Component({
  selector: 'app-summary-rep',
  templateUrl: './summary-rep.component.html',
  styleUrls: ['./summary-rep.component.scss']
})

export class SummaryRepComponent implements OnInit, OnDestroy {

  spinnerLoading = false;
  form: FormGroup;
  public authority: Authority = new Authority();
  private appId = 'sumRep';
  public YES_VAL = 'Y';

  funds: Fund[] = [];
  amcs: Amc[] = [];

  private fundsSub: Subscription;

  constructor(
    private fundService: FundService,
    private amcService: AmcService,
    private authorityService: AuthorityService,
    private authService: AuthService,
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
    // this.fundService.getFunds(1, 5);
    // this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
    //   this.funds = funds;
    //   console.log('Final Fund>>' + JSON.stringify(this.funds) );
    // });

    this.amcService.getAmc();
    this.fundsSub = this.amcService.getAmcUpdateListener().subscribe((amc: Amc[]) => {
      this.amcs = amc;
      // console.log('AMC>>' + JSON.stringify(this.amcs) );
      this.spinnerLoading = false;
    });
  }

  ngOnDestroy(): void {
    try {
      this.fundsSub.unsubscribe();
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
    console.log( 'NEXT FORM VALUES>>' + this.form.value.amc);
  }

  reset() {
    console.log('Reset()');

  }
}
