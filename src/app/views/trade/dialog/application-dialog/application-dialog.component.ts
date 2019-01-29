import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Application } from '../../model/application.model';
import { ApplicationDialogFormService } from './applicationDialogForm.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShareDataService } from '../../services/shareData.service';
import { ApplicationService } from '../../services/application.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent implements OnInit {

  form: FormGroup;
  spinnerLoading = false;
  appId: string;
  insertMode: boolean;
  // application: Application;

  constructor(
    public dialogRef: MatDialogRef<ApplicationDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public application: Application ,
    public formService: ApplicationDialogFormService,
    public shareDataService: ShareDataService,
    public applicationService: ApplicationService,
    private toastr: ToastrService,
  ) {
    console.log('application>>' + JSON.stringify(application));
  }

  ngOnInit() {
    this._buildForm();

    if (!this.application.AppId) {
      this.insertMode = true;
    } else {
      this.insertMode = false;

      this.form.controls['id'].disable();
    }

  }


  private _buildForm() {
    // Initial Form fields
    this.form = new FormGroup({
     id: new FormControl(null, {
       validators: [Validators.required]
     }),
     name: new FormControl(null, {
       validators: [Validators.required]
     }),
     status: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     group: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     appLink: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     menuOrder: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     menuGroup: new FormControl(null, {
      //  validators: [Validators.required]
     }),
   });
 }

 public onSave() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    if (this.insertMode) {
      // console.log('Is new mode');
      this.applicationService.addApplication(this.application).subscribe((data: any ) => {
        this.toastr.success( `Add  ${this.application.AppName} successful`, 'Successful', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });

        this.dialogRef.close('close');
      }, error => () => {
        console.log('Add appliation was error ', error);
      }, () => {
        console.log(` Add appliation complete` );
      });

    } else {
      // console.log('Is update mode');

      this.applicationService.updateApplication(this.application).subscribe((data: any ) => {
        this.toastr.success( `Update  ${this.application.AppName} successful`, 'Successful', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });

        this.dialogRef.close('close');
      }, error => () => {
        console.log('Add appliation was error ', error);
      }, () => {
        console.log(` Add appliation complete` );
      });
    }

 }

 onClose(): void {
  this.dialogRef.close('close');
}


}
