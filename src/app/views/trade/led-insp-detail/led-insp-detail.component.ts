import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog, MatDialogRef } from '@angular/material';
// import { MasterDataService } from '../services/masterData.service';
import { LEDService } from '../services/led.service';
import { MitLedInspCust } from '../model/mitLedInspCust.model';
// import { MitLedMas } from '../model/mitLedMas.model';
import { MitLedInspHistory } from '../model/mitLedInspHistory.model';
import { MitLedInspResource } from '../model/mitLedInspResource.model';
import { forkJoin } from "rxjs";
import { AuthService } from '../../services/auth.service';
import { LedInspHistoryComponent } from '../led-insp-history/led-insp-history.component';
import { LedInspCustDetailComponent } from '../dialog/led-insp-cust-detail/led-insp-cust-detail.component';
import { Authority } from '../model/authority.model';
import { AuthorityService } from '../services/authority.service';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
@Component({
  selector: 'app-led-insp-detail',
  templateUrl: './led-insp-detail.component.html',
  styleUrls: ['./led-insp-detail.component.scss']
})
export class LedInspDetailComponent implements OnInit {

  MODE_EDIT = 'EDIT';
  formScreen = '';
  spinnerLoading = false;

  form: FormGroup;
  public authority: Authority = new Authority();
  private appId = 'LEDInspSearch';
  public YES_VAL = 'Y';

  dataMode = '';

  //LED data
  _key
  main_mitLedInspCust:MitLedInspCust = new MitLedInspCust();
  member_mitLedInspCust:MitLedInspCust[] = [];
  mitLedInspHistory:MitLedInspHistory[] =[];
  mitLedInspResource:MitLedInspResource[] =[];

  //History
  newHistory :MitLedInspHistory = new MitLedInspHistory();
  // hisForm: FormGroup;

  // Dialog
  ledInspCustDetailComponent: MatDialogRef<LedInspCustDetailComponent>;

  @ViewChild(LedInspHistoryComponent)
  ledInspHistoryComponent: LedInspHistoryComponent;


  constructor(
    public route: ActivatedRoute,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
    // private masterDataService: MasterDataService,
    private ledService:LEDService,
    private authService: AuthService,
    private authorityService: AuthorityService,
  ) { }

  ngOnInit() {
    // this.spinnerLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('source')) {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('key')) {

        this.dataMode = this.MODE_EDIT;
        this._key = paramMap.get('key');

        // Initail data
        this.loadInvestProfile();

      }
    });

    // PERMISSION
    this.authorityService.getPermissionByAppId(this.authService.getUserData(), this.appId).subscribe( (auth: Authority[]) => {
      auth.forEach( (element) => {
        this.authority = element;
      });
    });
  }

  loadInvestProfile(){
    const observables = [];

    this.ledService.getInspByKey(this._key)
        .subscribe((data: any[]) => {
            this.main_mitLedInspCust  = data[0];

            // console.log('INSP MAIN CUST >>' + JSON.stringify(this.main_mitLedInspCust) );
            observables.push(this.ledService.getInspByCustCode(this.main_mitLedInspCust.cust_code));
            const example = forkJoin(observables);
            const subscribe = example.subscribe((result:any) => {

              console.log("loadInvestProfile()>>" + JSON.stringify(result[0]) );

            this.member_mitLedInspCust =result[0];
            });


        }, error => () => {
            console.log('Was error', error);
        }, () => {
           console.log('Loading complete');
        });

  }


  onAddHistory(){

      // if(this.hisForm.invalid){
    console.log("memo >>" + this.newHistory.memo);

    if(!this.newHistory.memo){
        this.toastr.warning("Please complete entry data." , "Data not complete", {
          timeOut: 3000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
        return
      }

      console.log("Add new history ");
      const _createBy = this.authService.getUserData() || 'NONE';
      const _version = "1";
      // const _createBy = 'NONE';

      this.ledService.getAddInspHistory(this.main_mitLedInspCust.led_inspect_id,_version,this.newHistory.memo,_createBy).subscribe(result=>{

        // this.hisForm.reset();
        this.newHistory.memo=null;

        this.ledInspHistoryComponent.loadHistory();

        this.toastr.info("Add new memo complete.", "successful", {
          timeOut: 3000,
          closeButton: true,
          positionClass: "toast-top-center"
        });


      }, error => () => {
            console.log('Was error', error);

            this.toastr.error("Was error " +error, "Incomplete !!", {
              timeOut: 3000,
              closeButton: true,
              positionClass: "toast-top-center"
            });

        }, () => {
           console.log('Loading complete');
        });

        this.form = new FormGroup({
          topic: new FormControl(null, {
            validators: [Validators.required]
          }),
          memo: new FormControl(null, {
            validators: [Validators.required]
          })
        });

  }

  onEditInspCust(_data: MitLedInspCust) {

    this.ledInspCustDetailComponent = this.dialog.open(LedInspCustDetailComponent, {
      width: '600px',
      data: _data
    });

    this.ledInspCustDetailComponent.afterClosed().subscribe(result => {
        console.log('Dialog result => ', result);

        if(result==='save'){
          this.loadInvestProfile();
        }

    });
  }



  onResponseToLED(_data: MitLedInspCust) {

    this.confirmationDialogService.confirm('Please confirm..', `Do you want report this(${_data.cust_code}  ${_data.firstName} ${_data.lastName}) to LED?`)
    .then((confirmed) => {
      if ( confirmed ) {
        //Do here

        //1.GET REQ_KEY
        //2. Capp API  params
        // 2.1 req_key = REQ_KEY
        // 2.2 req_status = 20001 // พบ
        // 2.2 req_status = 20002 //ไม่พบ
        //


        this.toastr.success( 'Successful' , 'Successful', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });

      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));


  }

}
