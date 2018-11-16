import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserLevel } from '../../model/userLevel.model';
import { Application } from '../../model/application.model';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserLevelDialogFormService } from './userlevelDialog.service';
import { ShareDataService } from '../../services/shareData.service';

@Component({
  selector: 'app-user-level-dialog',
  templateUrl: './user-level-dialog.component.html',
  styleUrls: ['./user-level-dialog.component.scss']
})
export class UserLevelDialogComponent implements OnInit, OnDestroy {


  form: FormGroup;
  userLevel: UserLevel = new UserLevel();

  applicationList: Application[];
  private applicationSub: Subscription;

  levelList = [
    {
    level: '1',
    desc: 'Level 1'
    },
    {
      level: '2',
      desc: 'Level 2'
      },
      {
        level: '3',
        desc: 'Level 3'
        },
  ];



  constructor(
    public dialogRef: MatDialogRef<UserLevelDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public userId: string,
    private authService: AuthService,
    private userService: UserService,
    private applicationService: ApplicationService,
    public formService: UserLevelDialogFormService,
    public shareDataService: ShareDataService,
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      AppId: new FormControl(null, {
        validators: [Validators.required]
      }),
      Level: new FormControl(null, {
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

        // Initial Application data
        this.applicationService.getApplication();
        this.applicationSub = this.applicationService.getApplicationListener().subscribe((data: Application[]) => {
          // this.spinnerLoading = false;
          this.applicationList = data;
          // this.dataSource.next(this.applicationList);
          }
        );
  }

  ngOnDestroy() {
    this.applicationSub.unsubscribe();
  }

  onSave() {


    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return false;
    }

    this.userLevel.UserId = this.userId;
    this.userLevel.createBy = this.authService.getUserData();

    this.userService.addUserLevel(this.userLevel).subscribe((data: any) => {
            this.dialogRef.close('save');
        });
  }

  onClose(): void {
    this.dialogRef.close('close');
  }

}
