import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-crm-personal-search',
  templateUrl: './crm-personal-search.component.html',
  styleUrls: ['./crm-personal-search.component.scss']
})
export class CrmPersonalSearchComponent implements OnInit {

  spinnerLoading = false;
  searchForm: FormGroup;

  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];

  cust_list=[{'Cust_Code':'123', 'FullName':'Mr. xxxx','Aliast':'นาย-A','RM':'HASUN','LastAct':'Open acc.','Action':''}
   ,{'Cust_Code':'456', 'FullName':'Mr. yyyy','Aliast':'นาย ข','RM':'Tananya','LastAct':'Order .','Action':''}
   ,{'Cust_Code':'789', 'FullName':'Mr. zzzz','Aliast':'นาย ง','RM':'Rosakorn','LastAct':'Offer bond','Action':''}
   ,{'Cust_Code':'000', 'FullName':'Mr. None','Aliast':'นาย จ','RM':'Supasiri','LastAct':'Call report','Action':''}
  
  ];

  cust_displayedColumns: string[] = ['Cust_Code', 'FullName','Aliast','RM','LastAct','Action'];
  cust_dataSource = new BehaviorSubject(this.cust_list);


  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      custId: new FormControl(null, {
        // validators: [Validators.required]
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
