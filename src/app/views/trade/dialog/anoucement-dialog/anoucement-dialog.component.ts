import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Anoucement } from '../../model/anoucement.model';
import { AnoucementService } from '../../services/anoucement.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from '../../services/shareData.service';
import { AnoucementDialogFormService } from './anoucementDialogForm.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-anoucement-dialog',
  templateUrl: './anoucement-dialog.component.html',
  styleUrls: ['./anoucement-dialog.component.scss']
})
export class AnoucementDialogComponent implements OnInit {

  form: FormGroup;
  spinnerLoading = false;
  appId: string;
  insertMode: boolean;


  constructor(
    public dialogRef: MatDialogRef<AnoucementDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public anoucement: Anoucement ,
    public formService: AnoucementDialogFormService,
    public shareDataService: ShareDataService,
    public anoucementService: AnoucementService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this._buildForm();
    if (!this.anoucement.id) {
      this.insertMode = true;
    } else {
      this.insertMode = false;
    }
  }

  private _buildForm() {
    // Initial Form fields
    this.form = new FormGroup({
     topic: new FormControl(null, {
       validators: [Validators.required]
     }),
     category: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     status: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     anoucementDate: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     from: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     type: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     path: new FormControl(null, {
      //  validators: [Validators.required]
     }),
     content: new FormControl(null, {
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
     console.log('Is new mode');
  } else {
    console.log('Is edit mode');

  }
}

 onClose(): void {
  this.dialogRef.close('close');
}

}
