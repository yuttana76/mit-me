import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../model/customer.model';
import { Subscription, BehaviorSubject } from 'rxjs';
import { PageEvent, MatTableDataSource } from '@angular/material';
import { CustomerCond } from '../model/customerCond.model';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  customers: Customer[] = [];
  private postsSub: Subscription;
  spinnerLoading = false;
  form: FormGroup;
  conditions: CustomerCond;

  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  constructor(public customerService: CustomerService, private authService: AuthService) { }

  displayedColumns: string[] = ['Cust_Code', 'First_Name_T', 'Card_Type', 'Birth_Day'];

  //dataSource = new MatTableDataSource<Customer>(this.customers);
  dataSource = new BehaviorSubject([]);

  ngOnInit() {
    console.log('Custeomer Search  Inititial!!!');

    this.form = new FormGroup({
      custId: new FormControl(null, {
        validators: [Validators.required]
      }),
      // custType: new FormControl(null, {
      //   validators: [Validators.required]
      // }),
    });

    // this.spinnerLoading = true;
    // this.customerService.getCustomers(this.postsPerPage, this.currentPage);
    this.postsSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
      this.spinnerLoading = false;
      this.customers = customers;
  });

  }

  ngOnDestroy() {
    console.log('Custeomer Seach  Destroy!!!');
    this.postsSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.spinnerLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

    console.log('Condition>>', this.conditions);
    this.customerService.getCustomers(this.rowsPerPage, this.currentPage, this.conditions);
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
    this.spinnerLoading = false;

    // Assign conditions
    // console.log('searchInput>>', this.form.value.custId);
    this.conditions = {
      custId: this.form.value.custId,
      custType: null};

    this.customerService.getCustomers(this.rowsPerPage, 1, this.conditions);
    this.postsSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
          // this.spinnerLoading = false;
          this.customers = customers;
          console.log('RESULT>>', JSON.stringify(this.customers));
          this.dataSource.next(this.customers);
      });
  }

}
