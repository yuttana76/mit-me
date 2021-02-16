import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CrmTask } from '../model/crmTask.model';

@Component({
  selector: 'app-crm-task-search',
  templateUrl: './crm-task-search.component.html',
  styleUrls: ['./crm-task-search.component.scss']
})
export class CrmTaskSearchComponent implements OnInit {

  spinnerLoading = false;
  searchForm: FormGroup;
  crmTaskList: CrmTask[] = [];
  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  dataSource = new BehaviorSubject([]);

  private taskSub: Subscription;
  displayedColumns: string[] = ['ID','PERSON','TYPE', 'RESPONSE','Title','Feedback','ACT'];

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      task_id: new FormControl(null, {
        // validators: [Validators.required]
      }),
      custCode: new FormControl(null, {
        // validators: [Validators.required]
      }),
      response: new FormControl(null, {
        // validators: [Validators.required]
      }),
      schType: new FormControl(null, {
        // validators: [Validators.required]
      }),
      schStartDate: new FormControl(null, {
        // validators: [Validators.required]
      }),

    });

    // this.taskSub = this.crmPersonalService.getPersonalListsListener().subscribe((data: CrmTask[]) => {
    //   this.spinnerLoading = false;
    //   this.crmTaskList = data;
    // });

  }

  ngAfterViewInit() {

  }

  onSerach(){

  }

  onReset(){

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
