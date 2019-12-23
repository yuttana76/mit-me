import { Component, OnInit, AfterViewInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-mobile-dialog',
  templateUrl: './new-mobile-dialog.component.html',
  styleUrls: ['./new-mobile-dialog.component.scss'],
  // providers: [{
  //   provide: MatDialogRef,
  //   useValue: {}
  // }, {
  //   provide: MAT_DIALOG_DATA,
  //   useValue: {} // Add any data you wish to test if it is passed/used correctly
  // }]
})
export class NewMobileDialogComponent implements OnInit {

  public newMobile :string;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewMobileDialogComponent> ,
    // @Inject(MAT_DIALOG_DATA) public data: any
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit() {
    console.log("Init >>" + JSON.stringify(this.data));

    this.form = new FormGroup({
      newMobile: new FormControl(null, {
        validators: [Validators.required,]
      }),
    });
  }

  onClose(): void {
    this.dialogRef.close('close');
  }

  onSaveNewMob(){
    this.dialogRef.close('newMobileSuccess');
  }
}
