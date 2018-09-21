import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../services/customer.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  customers: Customer[] = [];
  private postsSub: Subscription;
  spinnerLoading = false;
  showResult = false;
  form: FormGroup;

  currentPage = 1;
  rowsPerPage = 5;
  totalRecords = 10;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(public customerService: CustomerService, private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      searchInput: new FormControl(null, {
        validators: [Validators.required]
      })
    });

  //   this.spinnerLoading = true;
  //   this.customerService.getCustomers(this.postsPerPage, this.currentPage);
  //   this.postsSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
  //     this.spinnerLoading = false;
  //     this.customers = customers;
  // });

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.spinnerLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;
    this.customerService.getCustomers(this.rowsPerPage, this.currentPage);
    this.postsSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
          this.spinnerLoading = false;
          this.customers = customers;
      });
  }

  onSerachCust() {
    console.log('onSerachCust ! ');

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    console.log('searchInput>>', this.form.value.searchInput);
    this.customerService.getCustomers(this.rowsPerPage, 1);
    this.postsSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
          this.spinnerLoading = false;
          this.customers = customers;
      });
  }

}
