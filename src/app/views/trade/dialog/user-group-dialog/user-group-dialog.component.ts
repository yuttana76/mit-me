import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserGroup } from '../../model/userGroup.model';
import { ShareDataService } from '../../services/shareData.service';
import { UserGroupDialogFormService } from './userGroup.service';
import { Group } from '../../model/group.model';
import { Subscription } from 'rxjs';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-user-group-dialog',
  templateUrl: './user-group-dialog.component.html',
  styleUrls: ['./user-group-dialog.component.scss']
})
export class UserGroupDialogComponent implements OnInit {

  form: FormGroup;
  userGroup: UserGroup = new UserGroup();

  groupList: Group[];
  private groupSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<UserGroupDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public userId: string,
    private authService: AuthService,
    private userService: UserService,
    public shareDataService: ShareDataService,
    public formService: UserGroupDialogFormService,
    private groupService: GroupService,
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      GroupId: new FormControl(null, {
        validators: [Validators.required]
      }),
      Remark: new FormControl(null, {
        // validators: [Validators.required]
      }),
      STATUS: new FormControl(null, {
        // validators: [Validators.required]
      }),
      EXPIRE_DATE: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });

    this.groupService.getGroup();
    this.groupSub = this.groupService.getGroupListener().subscribe((data: Group[]) => {
      this.groupList = data;
    });

  }

  onSave() {

    this.dialogRef.close('save');

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return false;
    }

    this.userGroup.UserId = this.userId;
    this.userGroup.createBy = this.authService.getUserData();

    this.userService.addUserGroup(this.userGroup).subscribe((data: any) => {
            this.dialogRef.close('save');
        });
  }

  onClose(): void {
    this.dialogRef.close('close');
  }
}
