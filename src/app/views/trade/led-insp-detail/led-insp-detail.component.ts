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
  mitLedMas:MitLedMas;
  mitLedInspCust:MitLedInspCust;
  mitLedInspHistory:MitLedInspHistory;
  mitLedInspResource:MitLedInspResource;


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

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('source')) {
        // console.log('SOURCE>>', paramMap.get('source'));
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('key')) {
        this.dataMode = this.MODE_EDIT;
        this.custCode = paramMap.get('key');
      }

    });

  }
}
