import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserLevel } from '../model/userLevel.model';
import { UserService } from '../services/user.service';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog } from '@angular/material';
import { UserLevelDialogComponent } from '../dialog/user-level-dialog/user-level-dialog.component';
import { UserLevelFormService } from './userLevel.service';

@Component({
  selector: 'app-user-level',
  templateUrl: './user-level.component.html',
  styleUrls: ['./user-level.component.scss'],
  providers: [ConfirmationDialogService]
})
export class UserLevelComponent implements OnInit, OnDestroy {

  @Input() userId: string;

  displayedColumns: string[] = ['index', 'Application', 'Level', 'Status', 'Expire', 'Action'];
  dataSource = new BehaviorSubject([]);
  userLevelList: UserLevel[] = [];
  private userLevelSub: Subscription;

  userLevelDialogComponent: MatDialogRef<UserLevelDialogComponent>;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    public formService: UserLevelFormService,
  ) { }

  ngOnInit() {

    this.userService.getUserLevelByUserId(this.userId);
    this.userLevelSub = this.userService.getUserLevelUpdated().subscribe((data: UserLevel[]) =>{

      this.userLevelList = data;
      this.dataSource.next(this.userLevelList);
    });

  }

  ngOnDestroy() {
    this.userLevelSub.unsubscribe();
  }

  onDeleteLevel(_appId, _appName) {
    console.log(`onDeleteLevel ..  ${_appId} - ${_appName}`);

      this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete level for ${_appName} ?`)
      .then((confirmed) => {

        if ( confirmed ) {
          this.userService.deleteUserLevelByAppId(this.userId, _appId).subscribe(response => {

            this.toastr.success( 'Delete  successful' , 'Delete Successful', {
              timeOut: 5000,
              positionClass: 'toast-top-center',
            });

          });
        }
      }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  addUserLevel() {
    this.userLevelDialogComponent = this.dialog.open(UserLevelDialogComponent, {
      width: '600px',
      data: this.userId
    });

    this.userLevelDialogComponent.afterClosed().subscribe(result => {
        // console.log('Dialog result => ', result);
    });
  }

}
