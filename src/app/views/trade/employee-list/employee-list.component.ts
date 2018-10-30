import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { EmpCond } from '../model/empCond.model';
import { BehaviorSubject } from 'rxjs';
import { Department } from '../model/department.model';
import { DepartmentService } from '../services/department.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  spinnerLoading = false;
  form: FormGroup;
  employeeCond: EmpCond;
  displayedColumns: string[] = ['empID', 'First_Name', 'Last_Name', 'officeEmail', 'Position', 'Department', 'Action'];
  dataSource = new BehaviorSubject([]);
  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];

  departmentList: Department[];

  constructor(private departmentService: DepartmentService) { }

  ngOnInit() {
    this.form = new FormGroup({
      employeeName: new FormControl(null, {
        // validators: [Validators.required]
      }),

      department: new FormControl(null, {
        // validators: [Validators.required]
      }),
      // custType: new FormControl(null, {
      //   validators: [Validators.required]
      // }),
    });

    this.departmentService.getDepartment().subscribe((data: any[]) => {
      this.departmentList = data;
    });

  }

  onSerachCust() {

  }

  onChangedPage(pageData: PageEvent) {

  }
}
