import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { CrmTask } from '../model/crmTask.model';
import { CrmService } from '../services/crmPersonal.service';

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

  taskTypeList

  constructor(
    private crmPersonalService: CrmService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      task_id: new FormControl(null, {
        // validators: [Validators.required]
      }),
      task_title: new FormControl(null, {
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
      schEndDate: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });

    this.taskSub = this.crmPersonalService.getTaskListsListener().subscribe((data: CrmTask[]) => {
      this.spinnerLoading = false;
      this.crmTaskList = data;
    });

  }

  ngAfterViewInit() {

    var fnArray=[];
    fnArray.push(this.crmPersonalService.getMastert("taskType"));

    forkJoin(fnArray)
       .subscribe((dataRs:any) => {
        this.taskTypeList=dataRs[0].recordset;

       });

  }

  onSerach(){

    // console.log('onSerachCust ! ');
    if (this.searchForm.invalid) {
      // console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    // this.spinnerLoading = true;
    const task_id = this.searchForm.get('task_id').value
    const task_title = this.searchForm.get('task_title').value
    const custCode = this.searchForm.get('custCode').value
    const response = this.searchForm.get('response').value
    const schType = this.searchForm.get('schType').value

    let schStartDate = this.searchForm.get('schStartDate').value
    let schEndDate = this.searchForm.get('schEndDate').value

    if (schStartDate) {
      schStartDate = this.datepipe.transform(schStartDate, 'dd/MM/yyyy');
    }

    if (schEndDate) {
      schEndDate = this.datepipe.transform(schEndDate, 'dd/MM/yyyy');
    }

    this.crmPersonalService.getTaskLists(this.rowsPerPage, 1, task_id,task_title,custCode,response,schType,schStartDate,schEndDate);

    this.taskSub = this.crmPersonalService.getTaskListsListener().subscribe((data: CrmTask[]) => {
        // console.log('Result->' + JSON.stringify(data));
      // this.spinnerLoading = false;
          this.crmTaskList = data;
          this.dataSource.next(this.crmTaskList);
      });
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
