import { Component, OnInit, AfterViewInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SuiteService } from '../../services/suit.service';

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
    @Optional() @Inject(MAT_DIALOG_DATA) public custCode: any,
    private suiteService: SuiteService,
    ) { }

  ngOnInit() {
    console.log("Init >>" + JSON.stringify(this.custCode));

    this.form = new FormGroup({
      newMobileFC: new FormControl(null, {
        validators: [Validators.required,]
      }),
    });
  }

  onClose(): void {
    this.dialogRef.close('close');
  }

  onSaveNewMob(){

    this.suiteService.reqNewMobile(this.custCode,this.newMobile)
    // .finally(() => {
    //   console.log("Handle logging logic...");
    //   this.spinnerLoading = false;
    // })
    .subscribe((data: any) => {
        this.dialogRef.close('newMobileSuccess');
      },
      error => () => {
        console.log("reqNewMobile Was error", error);
      },
      // () => {
      //   console.log("reqNewMobile  complete");
      // }
    );


  }
}
