import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Department } from '../model/department.model';
import { DepartmentService } from '../services/department.service';
import { UserCond } from '../model/usrCond.model';
import { PageEvent } from '@angular/material';
import { UserListFormService } from './userListForm.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],

})
export class UserListComponent implements OnInit {


  spinnerLoading = false;
  form: FormGroup;
  searchCondition: UserCond;
  displayedColumns: string[] = ['empID', 'First_Name', 'Last_Name', 'officeEmail', 'Position', 'Department', 'Action'];
  dataSource = new BehaviorSubject([]);
  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];

  departmentList: Department[];
  constructor(
    public userListFormService: UserListFormService,
    private departmentService: DepartmentService
    ) { }

  ngOnInit() {

    this._buildForm();

    this.departmentService.getDepartment().subscribe((data: any[]) => {
      this.departmentList = data;
    });

  }

  _buildForm() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        // validators: [Validators.required]
      }),
      email: new FormControl(null, {
        // validators: [Validators.required]
      }),
      department: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });
  }

  onSerachCust() {

  }

  onChangedPage(pageData: PageEvent) {

  }

  onSerach() {
    console.log('onSerach ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
  }
}
