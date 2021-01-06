import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crm-personal-search',
  templateUrl: './crm-personal-search.component.html',
  styleUrls: ['./crm-personal-search.component.scss']
})
export class CrmPersonalSearchComponent implements OnInit {

  spinnerLoading = false;
  searchForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      custId: new FormControl(null, {
        validators: [Validators.required]
      }),
      // custType: new FormControl(null, {
      //   validators: [Validators.required]
      // }),
    });
  }


  onSerachCust() {

    // console.log('onSerachCust ! ');
    if (this.searchForm.invalid) {
      // console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    this.spinnerLoading = true;
  }

  onReset(){
    // this.customers = [];

    // subject.onNext([]);
    // this.dataSource.next([]);
  }
}
