import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MitLedInspCust } from '../../model/mitLedInspCust.model';
import { ToastrService } from 'ngx-toastr';
import { MasterDataService } from '../../services/masterData.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ShareDataService } from '../../services/shareData.service';
import { LEDService } from '../../services/led.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-led-insp-cust-detail',
  templateUrl: './led-insp-cust-detail.component.html',
  styleUrls: ['./led-insp-cust-detail.component.scss']
})
export class LedInspCustDetailComponent implements OnInit,AfterViewInit {


  form: FormGroup;
  insertMode: boolean;
  codeLookupList:CodeLookup[]=[];


  constructor(
    public dialogRef: MatDialogRef<LedInspCustDetailComponent> ,
    @Inject(MAT_DIALOG_DATA) public mitLedInspCust: MitLedInspCust ,
    private toastr: ToastrService,
    private masterDataService: MasterDataService,
    public shareDataService: ShareDataService,
    private ledService:LEDService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    console.log("Edit Insp cust>>" + JSON.stringify(this.mitLedInspCust));

    if(this.mitLedInspCust.cust_code){
          this.insertMode = false;
    }else{
      this.insertMode = true;
    }

// Initial data
    const observables = [];
    observables.push(this.masterDataService.getCodeLookup("LEDCODE"));
    const example = forkJoin(observables);
    const subscribe = example.subscribe((result:any) => {

      this.codeLookupList = result[0];
      // console.log( "LEDCODE>>" + JSON.stringify(this.codeLookupList));
    });

// Build form
this.form = new FormGroup({
  twsid: new FormControl(null, {
    validators: [Validators.required]
  }),
  cust_code: new FormControl(null, {
    validators: [Validators.required]
  }),
  firstName: new FormControl(null, {
    validators: [Validators.required]
  }),
  lastName: new FormControl(null, {
    validators: [Validators.required]
  }),
  cust_source: new FormControl(null, {
    validators: [Validators.required]
  }),
  memo: new FormControl(null, {
    validators: [Validators.required]
  }),

  led_code: new FormControl(null, {
    validators: [Validators.required]
  }),
  status: new FormControl(null, {
    // validators: [Validators.required]
  }),
});


  }

  ngAfterViewInit(): void {

    if(!this.insertMode){
      this.form.get('twsid').disable();
      this.form.get('cust_code').disable();
      this.form.get('firstName').disable();
      this.form.get('lastName').disable();
      this.form.get('cust_source').disable();
    }

  }


  onSave() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    if(this.insertMode){
      console.log("Insert new  >>" );
    }else{
      console.log("Update data >>" + JSON.stringify(this.mitLedInspCust));

      const _actionBy = this.authService.getUserData() || 'NONE';

      this.ledService.updateInspCust(this.mitLedInspCust,_actionBy).subscribe((data: any ) => {
        this.toastr.success( `Update  successful`, 'Successful', {
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

    this.dialogRef.close('close');
  }

  onClose(): void {
    this.dialogRef.close('close');
  }
}
