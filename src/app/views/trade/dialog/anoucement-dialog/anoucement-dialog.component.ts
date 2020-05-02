import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Anoucement } from '../../model/anoucement.model';
import { AnoucementService } from '../../services/anoucement.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from '../../services/shareData.service';
import { AnoucementDialogFormService } from './anoucementDialogForm.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-anoucement-dialog',
  templateUrl: './anoucement-dialog.component.html',
  styleUrls: ['./anoucement-dialog.component.scss']
})
export class AnoucementDialogComponent implements OnInit {

  form: FormGroup;
  imagePreview;
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
  ) {

    console.log('CONS DATA>>' + JSON.stringify(this.anoucement));
  }

  ngOnInit() {
    this._buildForm();
    if (!this.anoucement.id) {
      this.insertMode = true;
    } else {
      this.insertMode = false;

      // Set form value
      this.form.setValue({
        image : this.anoucement.SourcePath,
      });

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
     image: new FormControl(null, {
      // validators: [Validators.required],
      // asyncValidators: [mimeType]
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

     this.anoucementService.addApplication(this.anoucement, this.form.value.image).subscribe((data: any ) => {
      this.toastr.success( `Add  ${this.anoucement.Topic} successful`, 'Successful', {
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
    console.log('Is edit mode');
    this.anoucementService.updateApplication(this.anoucement, this.form.value.image).subscribe((data: any) => {

      this.toastr.success( `Update  ${this.anoucement.Topic} successful`, 'Successful', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });

      this.dialogRef.close('close');
    }, error => () => {
      console.log('Update appliation was error ', error);
    }, () => {
      console.log(` Update appliation complete` );
    });

  }
}

  onClose(): void {
    this.dialogRef.close('close');
  }

  onFilePicked(event: Event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    console.log(file);
    console.log(this.form);

    const reader = new FileReader();
    reader.onload = () => {
     this.imagePreview = reader.result;

    };
    reader.readAsDataURL(file);
  }

}
