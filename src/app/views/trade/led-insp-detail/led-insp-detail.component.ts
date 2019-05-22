import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog } from '@angular/material';
import { MasterDataService } from '../services/masterData.service';
import { LEDService } from '../services/led.service';
import { MitLedInspCust } from '../model/mitLedInspCust.model';
import { MitLedMas } from '../model/mitLedMas.model';
import { MitLedInspHistory } from '../model/mitLedInspHistory.model';
import { MitLedInspResource } from '../model/mitLedInspResource.model';
import { forkJoin } from "rxjs";
@Component({
  selector: 'app-led-insp-detail',
  templateUrl: './led-insp-detail.component.html',
  styleUrls: ['./led-insp-detail.component.scss']
})
export class LedInspDetailComponent implements OnInit {

  MODE_EDIT = 'EDIT';
  formScreen = '';

  form: FormGroup;
  spinnerLoading = false;

  dataMode = '';

  //LED data
  _key
  // mitLedMas:MitLedMas = new MitLedMas;
  main_mitLedInspCust:MitLedInspCust = new MitLedInspCust();
  member_mitLedInspCust:MitLedInspCust[] = [];
  mitLedInspHistory:MitLedInspHistory[] =[];
  mitLedInspResource:MitLedInspResource[] =[];


  constructor(
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
    private masterDataService: MasterDataService,
    private ledService:LEDService

  ) { }

  ngOnInit() {
    // this.spinnerLoading = true;
    const observables = [];

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('source')) {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('key')) {

        this.dataMode = this.MODE_EDIT;
        this._key = paramMap.get('key');

        // Initail data

        this.ledService.getInspByKey(this._key)
        .subscribe((data: any[]) => {
          this.main_mitLedInspCust  = data[0];

          console.log('INSP CUST >>' + JSON.stringify(this.main_mitLedInspCust) );

        observables.push(this.ledService.getInspByCustCode(this.main_mitLedInspCust.cust_code));

        const example = forkJoin(observables);
        const subscribe = example.subscribe((result:any) => {
        this.member_mitLedInspCust =result[0];
          console.log('MEMBER>>' + JSON.stringify(this.member_mitLedInspCust) );
        });


        }, error => () => {
            console.log('Was error', error);
        }, () => {
           console.log('Loading complete');

        });


      }

    });

  }
}
