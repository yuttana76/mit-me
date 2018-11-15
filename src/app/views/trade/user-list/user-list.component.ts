import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Department } from '../model/department.model';
import { DepartmentService } from '../services/department.service';
import { UserCond } from '../model/userCond.model';
import { PageEvent } from '@angular/material';
import { UserListFormService } from './userListForm.service';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],

})
export class UserListComponent implements OnInit , OnDestroy {


  spinnerLoading = false;
  form: FormGroup;
  searchCondition: UserCond;
  displayedColumns: string[] = ['index', 'First_Name', 'Last_Name', 'Department', 'Position', 'Email', 'Action'];
  dataSource = new BehaviorSubject([]);
  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];

  departmentList: Department[];

  userList: User[] = [];
  private userSub: Subscription;

  constructor(
    public userListFormService: UserListFormService,
    public userService: UserService,
    private departmentService: DepartmentService
    ) { }

  ngOnInit() {

    this._buildForm();

    this.departmentService.getDepartment().subscribe((data: any[]) => {
      this.departmentList = data;
    });

    this.userSub = this.userService.getUserUpdateListener().subscribe((userList: User[]) => {
      this.spinnerLoading = false;
      this.userList = userList;
  });

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  _buildForm() {
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        // validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
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

  onSerach() {
    console.log('onSerach ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    this.spinnerLoading = true;

    // Assign conditions
    // console.log('searchInput>>', this.form.value.custId);
    this.searchCondition = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      department: this.form.value.department,
    };

    this.userService.getSearchUser(this.rowsPerPage, 1, this.searchCondition);
    this.userSub = this.userService.getUserUpdateListener().subscribe((userList: User[]) => {
          this.spinnerLoading = false;
          this.userList = userList;

          // console.log('Search User List >>' , JSON.stringify(this.userList));
          this.dataSource.next(this.userList);
      });
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.spinnerLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

    this.userService.getSearchUser(this.rowsPerPage, 1, this.searchCondition);
    this.userSub = this.userService.getUserUpdateListener().subscribe((userList: User[]) => {
          this.spinnerLoading = false;
          this.userList = userList;

          this.dataSource.next(this.userList);
      });
  }
}
