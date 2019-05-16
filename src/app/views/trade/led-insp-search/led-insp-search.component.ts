import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


class InspSearch {
  custId: string;
  firstName: string;
  lastName: string;
  fromSource: string;
  led_code: string;
}

@Component({
  selector: 'app-led-insp-search',
  templateUrl: './led-insp-search.component.html',
  styleUrls: ['./led-insp-search.component.scss']
})
export class LedInspSearchComponent implements OnInit {

  spinnerLoading = false;
  form: FormGroup;
  inspSearch: InspSearch = new InspSearch() ;

  private custSub: Subscription;

  fromSourceList = [
    {value: 'ALL', viewValue: 'ALL'},
    {value: 'MFTS', viewValue: 'MFTS'},
    {value: 'SWAN', viewValue: 'SWAN'},
  ];


  constructor() { }

   ngOnInit() {
    this.inspSearch.fromSource='ALL';

    this.form = new FormGroup({

      custId: new FormControl(null, {
        // validators: [Validators.required]
      }),

      firstName: new FormControl(null, {
        // validators: [Validators.required]
      }),

      lastName: new FormControl(null, {
        // validators: [Validators.required]
      }),

      fromSource: new FormControl(null, {
        // validators: [Validators.required]
      }),

    });

  //   // this.spinnerLoading = true;
  //   this.custSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
  //     this.spinnerLoading = false;
  //     this.customers = customers;
  // });

  }

  ngOnDestroy() {
    console.log('ngOnDestroy!!!');
    // this.custSub.unsubscribe();
  }

  onSerach() {
    // console.log('onSerachCust ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    this.spinnerLoading = false;
  }

}
