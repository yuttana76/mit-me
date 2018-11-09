import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Group } from '../model/group.model';
import { Authority } from '../model/authority.model';
import { GroupDetailFormService } from './groupDetail.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mit-group-detail',
  templateUrl: './mit-group-detail.component.html',
  styleUrls: ['./mit-group-detail.component.scss']
})
export class MitGroupDetailComponent implements OnInit {

  form: FormGroup;
  spinnerLoading = false;
  isNewGroup = true;
  formScreen = 'N';
  group: Group = new Group();

  groupAuthority: Authority[];


  authDisplayedColumns: string[] = ['index','application', 'status', 'expire','create','edit','delete','view','action'];
  authDataSource = new BehaviorSubject([]);

  groupList: Group[];
  private groupSub: Subscription;

  constructor(
    public formService: GroupDetailFormService,
    public route: ActivatedRoute,
    private location: Location
    ) { }



  ngOnInit() {

    this._buildForm();

    this._bindValue();

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {

    this.spinnerLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('source')) {
        console.log('SOURCE>>', paramMap.get('source'));
        this.formScreen = paramMap.get('source');

      }

      if (paramMap.has('GroupId')) {
        console.log('GroupId>>', paramMap.get('GroupId'));
      }
    });

  }

  private _bindValue() {
    // Set default value
  }

  private _buildForm() {
   // Initial Form fields
   this.form = new FormGroup({
    groupId: new FormControl(null, {
      validators: [Validators.required]
    }),
    groupName: new FormControl(null, {
      validators: [Validators.required]
    }),
  });
}

onSubmit() {
  console.log('SUBMITED ! ');
  if (this.form.invalid) {
    console.log('form.invalid() ' + this.form.invalid);
    return true;
  }

  const _mode = this.isNewGroup ? 'NEW' : 'EDIT';

  // this.userService.createUserEmp(this.user, _mode).subscribe((data: any ) => {
  //   console.log('CreateUserEmp return data >>', JSON.stringify(data));

  // }, error => () => {
  //   console.log('CreateUserEmp Was error', error);

  // }, () => {
  //  console.log('CreateUserEmp  complete');

  // });
  this.isNewGroup = false;

}

  addAuthority() {

  }

  goBack() {
    this.location.back();
  }

}
