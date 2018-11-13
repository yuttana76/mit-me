import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Group } from '../model/group.model';
import { Authority } from '../model/authority.model';
import { GroupDetailFormService } from './groupDetail.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { GroupService } from '../services/group.service';
import { AuthorityService } from '../services/authority.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mit-group-detail',
  templateUrl: './mit-group-detail.component.html',
  styleUrls: ['./mit-group-detail.component.scss']
})
export class MitGroupDetailComponent implements OnInit {

  form: FormGroup;
  spinnerLoading = false;
  public isNewGroup = true;
  formScreen = 'N';
  public groupId: string;
  groupData: Group = new Group();

  groupAuthority: Authority[];


  authDisplayedColumns: string[] = ['index','application', 'status', 'expire','create','edit','delete','view','action'];
  authDataSource = new BehaviorSubject([]);

  // groupList: Group[];
  private groupSub: Subscription;

  constructor(
    public formService: GroupDetailFormService,
    public route: ActivatedRoute,
    private location: Location,
    private groupService: GroupService,
    private authorityService: AuthorityService,
    private toastr: ToastrService
    ) { }

  ngOnInit() {
    this._buildForm();
    this._bindValue();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {

    this.spinnerLoading = true;

    // Get parameter from link
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('source')) {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('GroupId')) {

        this.groupId = paramMap.get('GroupId');
        this.isNewGroup = false;

      // Get data Group data & Authority data
      this.groupService.getGroupById(this.groupId).subscribe(groupData => {
        this.groupData = groupData[0];
      }
      );

      this.authorityService.getAuthorityByGroupId(this.groupId).subscribe(authData => {
        console.log( 'RTN authData>>' , authData);

        this.groupAuthority = authData;
        this.authDataSource.next(this.groupAuthority);

      });

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

onAddUser() {
  console.log('SUBMITED ! ');
  if (this.form.invalid) {
    console.log('form.invalid() ' + this.form.invalid);
    return true;
  }

  const _mode = this.isNewGroup ? 'NEW' : 'EDIT';

  this.groupService.addGroup(this.groupData.GroupId, this.groupData.GroupName).subscribe( (data: any) => {
    console.log('Create Group >>', JSON.stringify(data));

    this.toastr.success( 'Add group successful' , 'Successful', {
      timeOut: 0,
      positionClass: 'toast-top-center',
    });

  }, error => () => {
    console.log('Create Group  Was error', error);
  }, () => {
   console.log('Create Group   complete');
  });

  this.isNewGroup = false;

}

  addAuthority() {

  }

  goBack() {
    this.location.back();
  }

}
