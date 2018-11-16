import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserLevel } from '../model/userLevel.model';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material';
import { UserGroup } from '../model/userGroup.model';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { UserGroupDialogComponent } from '../dialog/user-group-dialog/user-group-dialog.component';
import { UserGroupFormService } from './userGroup.service';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss'],
  providers: [ConfirmationDialogService]
})
export class UserGroupComponent implements OnInit, OnDestroy {


  @Input() userId: string;

  displayedColumns: string[] = ['index', 'Group', 'Status', 'Expire', 'Action'];
  dataSource = new BehaviorSubject([]);
  userGroupList: UserGroup[] = [];
  private userGroupSub: Subscription;

  userGroupDialogComponent: MatDialogRef<UserGroupDialogComponent>;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    public formService: UserGroupFormService,
  ) { }

  ngOnInit() {
    this.userService.getUserGroupByUserId(this.userId);
    this.userGroupSub = this.userService.getUserGroupUpdated().subscribe((data: UserGroup[]) => {
      this.userGroupList = data;
      this.dataSource.next(this.userGroupList);
      }
    );
  }

  ngOnDestroy() {
    this.userGroupSub.unsubscribe();
  }

  onDeleteGroup(_groupId, _groupName) {
    console.log(`onDeleteGroup ..  ${this.userId} - ${_groupId}`);

    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete group for ${_groupName} ?`)
    .then((confirmed) => {

      if ( confirmed ) {
        this.userService.deleteUserGroupByAppId(this.userId, _groupId).subscribe(response => {

          this.toastr.success( 'Delete  successful' , 'Delete Successful', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });

        });
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  addUserGroup() {

    this.userGroupDialogComponent = this.dialog.open(UserGroupDialogComponent, {
      width: '600px',
      data: this.userId
    });

    this.userGroupDialogComponent.afterClosed().subscribe(result => {
        // console.log('Dialog result => ', result);
    });

  }

}
