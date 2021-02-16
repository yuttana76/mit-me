import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CrmPersonModel } from '../model/crmPersonal.model';
import { CrmService } from '../services/crmPersonal.service';

@Component({
  selector: 'app-crm-personal-search',
  templateUrl: './crm-personal-search.component.html',
  styleUrls: ['./crm-personal-search.component.scss']
})
export class CrmPersonalSearchComponent implements OnInit {

  spinnerLoading = false;
  searchForm: FormGroup;

  crmPersonList: CrmPersonModel[] = [];

  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  cust_dataSource = new BehaviorSubject([]);
  private custSub: Subscription;
  cust_displayedColumns: string[] = ['Cust_Code', 'FullName','Aliast','RM','Action'];
  // cust_displayedColumns: string[] = ['Cust_Code', 'FullName','Aliast','RM','LastAct','Action'];

  constructor(
    private crmPersonalService: CrmService,
    public route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      CustCode: new FormControl(null, {
        // validators: [Validators.required]
      }),
      idCard: new FormControl(null, {
        // validators: [Validators.required]
      }),
      firstName: new FormControl(null, {
        // validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        // validators: [Validators.required]
      }),
      CustomerAlias: new FormControl(null, {
        // validators: [Validators.required]
      }),
      Mobile: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });

    this.custSub = this.crmPersonalService.getPersonalListsListener().subscribe((data: CrmPersonModel[]) => {
      this.spinnerLoading = false;
      this.crmPersonList = data;
  });


  }

  ngOnDestroy() {
    this.custSub.unsubscribe();
  }


  onSerachCust() {

    // console.log('onSerachCust ! ');
    if (this.searchForm.invalid) {
      // console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    // this.spinnerLoading = true;
    const idCard = this.searchForm.get('idCard').value
    const firstName = this.searchForm.get('firstName').value
    const lastName = this.searchForm.get('lastName').value
    const CustomerAlias = this.searchForm.get('CustomerAlias').value
    const Mobile= this.searchForm.get('Mobile').value

    this.crmPersonalService.getPersonalLists(this.rowsPerPage, 1, idCard,firstName,lastName,CustomerAlias,Mobile);

    this.custSub = this.crmPersonalService.getPersonalListsListener().subscribe((data: CrmPersonModel[]) => {
        // console.log('Result->' + JSON.stringify(data));
      // this.spinnerLoading = false;
          this.crmPersonList = data;
          this.cust_dataSource.next(this.crmPersonList);
      });


  }

  onReset(){
    // this.customers = [];

    // subject.onNext([]);
    // this.dataSource.next([]);
  }


  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    // this.spinnerLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

    // console.log('Condition>>', this.conditions);
    // this.customerService.getCustomers(this.rowsPerPage, this.currentPage, this.conditions);
    // this.postsSub = this.customerService.getCustomerUpdateListener().subscribe((customers: Customer[]) => {
    //       this.spinnerLoading = false;
    //       this.customers = customers;
    //       this.dataSource.next(this.customers);
    //   });
  }

}
