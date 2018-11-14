import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { AddAuthorityDialogComponent } from '../dialog/add-authority-dialog/add-authority-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-mit-group-detail',
  templateUrl: './mit-group-detail.component.html',
  styleUrls: ['./mit-group-detail.component.scss'],
  providers: [ConfirmationDialogService]
})
export class MitGroupDetailComponent implements OnInit, OnDestroy {

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
  private authorityListSub: Subscription;

  addAuthorityDialogComponent: MatDialogRef<AddAuthorityDialogComponent>;

  constructor(
    public formService: GroupDetailFormService,
    public route: ActivatedRoute,
    private location: Location,
    private groupService: GroupService,
    private authorityService: AuthorityService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService
    ) { }

  ngOnInit() {

    this._buildForm();

    // Get parameter from link
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('source')) {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('GroupId')) {

        this.groupId = paramMap.get('GroupId');

      // Get data Group data & Authority data
      this.groupService.getGroupById(this.groupId).subscribe(groupData => {

        this.groupData = groupData[0];

        this.isNewGroup = false;
        this.form.controls['groupId'].disable();

      }
      );

      // Get Authority
      this.authorityService.getAuthorityByGroupId(this.groupId);
      }
    });

    this.authorityListSub = this.authorityService.getAuthorityListener().subscribe((authData: Authority[]) => {
      this.spinnerLoading = false;
      this.groupAuthority = authData;
      this.authDataSource.next(this.groupAuthority);
    }
    );
  }

  ngOnDestroy() {

    this.authorityListSub.unsubscribe();

  }

  // tslint:disable-next-line:use-life-cycle-interface
  // ngAfterViewInit() {

  //   this.spinnerLoading = true;

  //   // Get parameter from link
  //   this.route.paramMap.subscribe((paramMap: ParamMap) => {
  //     if (paramMap.has('source')) {
  //       this.formScreen = paramMap.get('source');
  //     }

  //     if (paramMap.has('GroupId')) {

  //       this.groupId = paramMap.get('GroupId');

  //     // Get data Group data & Authority data
  //     this.groupService.getGroupById(this.groupId).subscribe(groupData => {

  //       this.groupData = groupData[0];

  //       this.isNewGroup = false;
  //       this.form.controls['groupId'].disable();

  //     }
  //     );

  //     // Get Authority
  //     this.authorityService.getAuthorityByGroupId(this.groupId);
  //     this.authorityListSub = this.authorityService.getAuthorityListener().subscribe((authData: Authority[]) => {

  //       this.spinnerLoading = false;
  //       this.groupAuthority = authData;
  //       this.authDataSource.next(this.groupAuthority);
  //     }
  //     );

  //     }
  //   });
  // }


  private _buildForm() {
   // Initial Form fields
   this.form = new FormGroup({
    groupId: new FormControl(null, {
      validators: [Validators.required]
    }),
    groupName: new FormControl(null, {
      validators: [Validators.required]
    }),
    status: new FormControl(null, {
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

  if (this.isNewGroup) {
    // Add new group
    this.groupService.addGroup(this.groupData.GroupId, this.groupData.GroupName).subscribe( (data: any) => {
      this.toastr.success( 'Add group successful' , 'Successful', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });

      this.isNewGroup = false;
    }, error => () => {
      console.log('Create Group  Was error', error);
    }, () => {
     console.log('Create Group   complete');
    });

  } else {
    // Update group info
    this.groupService.updateGroup(this.groupData.GroupId, this.groupData.GroupName, this.groupData.status).subscribe( (data: any) => {
      this.toastr.success( 'Update group info successful' , 'Successful', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });

      this.isNewGroup = false;
    }, error => () => {
      console.log('Was error', error);
    }, () => {
     console.log(' complete');
    });

  }
}

onDelAuthority(appId: string, appName: string ) {
  console.log('Deleting Authority' + this.groupId + ' ;App ID:' + appId + ' ;App Name:' + appName);

  this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete authority for ${appName} ?`)
  .then((confirmed) => {
    if ( confirmed ) {
      this.authorityService.deleteAuthrity(this.groupId, appId).subscribe(response => {

        this.toastr.success( 'Delete group successful' , 'Delete Successful', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
      });
    }
  }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));


}

  addAuthority() {

    console.log('addAuthority for>> ' + this.groupId);

    this.addAuthorityDialogComponent = this.dialog.open(AddAuthorityDialogComponent, {
      width: '600px',
      data: this.groupId
    });

    this.addAuthorityDialogComponent.afterClosed().subscribe(result => {
        console.log('Dialog result => ', result);
    });
  }

  goBack() {
    this.location.back();
  }

}
