import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../model/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserFormService } from './userForm.service';
import { DatePipe, Location } from '@angular/common';
// import { DISABLED } from '@angular/forms/src/model';
import { Department } from '../model/department.model';
import { DepartmentService } from '../services/department.service';
import { UserService } from '../services/user.service';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  validationMessages: any;
  user: User = new User();
  userId: string = '';
  formScreen: string;
  // isNewUser = true;

  form: FormGroup;
  formChangeSub: Subscription;

  // private mode = this.userFormService.MODE_CREATE;

  public statusList = this.userFormService.statusList;
  departmentList: Department[] = [];

  constructor(
    public userService: UserService,
    private employeeService: EmployeeService,
    public userFormService: UserFormService,
    private departmentService: DepartmentService,
    private location: Location,
    public route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this._buildForm();

    this.departmentService.getDepartment().subscribe((data: any[]) => {
      this.departmentList = data;
    });

    this._bindValue();
  }

  goBack() {
    this.location.back();
  }

  private _bindValue() {
    // Set default value
    // this.user.STATUS = 'A';

    // Get parameter from link

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('source')) {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('userid')) {

        this.userId = paramMap.get('userid');

        this.employeeService.getEmployeebyUserId(this.userId).subscribe((data: any) => {

          // console.log('RTN EMP>>' , JSON.stringify(data));
          this.user = data[0];
        })
      }
    });


  }

  private _buildForm() {
   // Initial Form fields
   this.form = new FormGroup({
    loginName: new FormControl(null, {
      validators: [Validators.required]
    }),
    email: new FormControl(null, {
      validators: [Validators.required]
    }),
    status: new FormControl(null, {
      validators: [Validators.required]
    }),
    empDate: new FormControl(null, {
      // validators: [Validators.required]
    }),
    expDate: new FormControl(null, {
      // validators: [Validators.required]
    }),
    firstName: new FormControl(null, {
      validators: [Validators.required]
    }),
    lastName: new FormControl(null, {
      validators: [Validators.required]
    }),
    dobDate: new FormControl(null, {
      // validators: [Validators.required
        //  , Validators.pattern(DATE_REGEX)
      // ]
    }),
    department: new FormControl(null, {
      validators: [Validators.required]
    }),
    position: new FormControl(null, {
      validators: [Validators.required]
    }),
    officePhone: new FormControl(null, {
      // validators: [Validators.required]
    }),
    mobPhone: new FormControl(null, {
      // validators: [Validators.required]
    }),
    othEmail: new FormControl(null, {
      // validators: [Validators.required]
    }),

   });

    // Subscribe to form value changes
    this.formChangeSub = this.form
    .valueChanges
    .subscribe(data => this._onValueChanged());

    // this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.form) { return; }
  }

  ngOnDestroy() {
    this.formChangeSub.unsubscribe();
  }

  onSubmit() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    // console.log('empID>>', this.user.empID );
    if ( !this.user.empID || this.user.empID === '') {
      this.user.empID = this.user.LoginName;
    }

    this.user.USERID = this.user.LoginName;
    this.user.PASSWD = this.user.LoginName;
    this.user.EMP_STATUS = this.user.STATUS;
    this.user.MIT_GROUP = this.userFormService.MIT_GROUP;

    // const _mode = this.isNewUser ? 'NEW' : 'EDIT';

    let _mode = this.userFormService.MODE_NEW;
    if (this.userId !== '' ) {
      _mode =  this.userFormService.MODE_EDIT;
    }

    this.userService.execUserEmp(this.user, _mode).subscribe((data: any ) => {
      // console.log('execUserEmp return data >>', JSON.stringify(data));
      this.userId = this.user.LoginName;

      this.toastr.success( `Add user ${this.user.First_Name} ${this.user.Last_Name} successful`, 'Successful', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });


    }, error => () => {
      console.log('CreateUserEmp Was error', error);
    }, () => {
      console.log('CreateUserEmp  complete');
    });


  }

}
