import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MitLedMas } from '../../model/mitLedMas.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MasterDataService } from '../../services/masterData.service';
import { ShareDataService } from '../../services/shareData.service';
import { LEDService } from '../../services/led.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-led-mas-detail',
  templateUrl: './led-mas-detail.component.html',
  styleUrls: ['./led-mas-detail.component.scss']
})
export class LedMasDetailComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  insertMode: boolean;
  codeLookupList:CodeLookup[]=[];


  constructor(
    public dialogRef: MatDialogRef<LedMasDetailComponent> ,
    @Inject(MAT_DIALOG_DATA) public mitLedMas: MitLedMas ,
    private toastr: ToastrService,
    private masterDataService: MasterDataService,
    public shareDataService: ShareDataService,
    private ledService:LEDService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    console.log("LedMasDetailComponent>>" + JSON.stringify(this.mitLedMas));

    if(this.mitLedMas.twsid){
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

      // status: new FormControl(null, {
      //   // validators: [Validators.required]
      // }),
    });

  }

  ngAfterViewInit(): void {

    if(!this.insertMode){
      this.form.get('twsid').disable();
      this.form.get('cust_code').disable();
      this.form.get('firstName').disable();
      this.form.get('lastName').disable();

    }

  }

  onSave(): void {
    this.dialogRef.close('close');
  }


  onClose(): void {
    this.dialogRef.close('close');
  }

}
