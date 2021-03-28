import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAuthorityFormService } from './addAuthorityForm.service';
import { Application } from '../../model/application.model';
import { ApplicationService } from '../../services/application.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authority } from '../../model/authority.model';
import { AuthorityService } from '../../services/authority.service';

@Component({
  selector: 'app-add-authority-dialog',
  templateUrl: './add-authority-dialog.component.html',
  styleUrls: ['./add-authority-dialog.component.scss'],
  providers: [AddAuthorityDialogComponent , AddAuthorityFormService]
})
export class AddAuthorityDialogComponent implements OnInit, OnDestroy {


  form: FormGroup;
  groupId: string;
  authority: Authority = new Authority();

  applicationList: Application[];
  private applicationSub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AddAuthorityDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public grouptId: string,
    public formService: AddAuthorityFormService,
    private applicationService: ApplicationService,
    private authorityService: AuthorityService

  ) {
    this.groupId = grouptId;
  }

  ngOnInit() {

    this.form = new FormGroup({
      AppId: new FormControl(null, {
        validators: [Validators.required]
      }),
      mCreate: new FormControl(null, {
        // validators: [Validators.required]
      }),
      mEdit: new FormControl(null, {
        // validators: [Validators.required]
      }),
      mView: new FormControl(null, {
        // validators: [Validators.required]
      }),
      mDelete: new FormControl(null, {
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

      this.authority.GroupId = this.groupId;
      this.authority.Status = 'A';
      // addAuthrity
      this.authorityService.addAuthrity(this.authority).subscribe((data: any) => {
          this.dialogRef.close('save');
      });

  }

  onClose(): void {
    this.dialogRef.close('close');
  }

  OnAuthorityChange($event) {
    this.form.controls['mCreate'].setValue($event.checked);
    this.form.controls['mEdit'].setValue($event.checked);
    this.form.controls['mView'].setValue($event.checked);
    this.form.controls['mDelete'].setValue($event.checked);

  }
}
