import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
// import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog, PageEvent } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { MasterDataService } from '../services/masterData.service';
import { LEDService } from '../services/led.service';
import { MitLedInspCust } from '../model/mitLedInspCust.model';
import { InspSearch } from '../model/inspSearch.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }


@Component({
  selector: 'app-led-insp-search',
  templateUrl: './led-insp-search.component.html',
  styleUrls: ['./led-insp-search.component.scss']
})
export class LedInspSearchComponent implements OnInit {

  spinnerLoading = false;
  form: FormGroup;
  inspSearch: InspSearch = new InspSearch() ;
  mitLedInspCustList: MitLedInspCust[] = [];
  formScreen;


  // Result table [START]
  currentPage = 1;
  rowsPerPage = 2;
  dataSource = new BehaviorSubject([]);
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  displayedColumns: string[] = ['key','id', 'FullName', 'cust_source', 'led_code', 'TMPDate','ABSDate','DFDate','BRKDate','Action'];
  // Result table [END]

   public codeLedList: CodeLookup[];
   public ledSourceList = [
    {value: '0', viewValue: 'ALL'},
    {value: 'MFTS', viewValue: 'MFTS'},
    {value: 'SWAN', viewValue: 'SWAN'},
  ];


  constructor(
    private toastr: ToastrService,
    // private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
    private masterDataService: MasterDataService,
    private ledService:LEDService,
    public route: ActivatedRoute,
  ) { }

   ngOnInit() {
    this.inspSearch.fromSource = '0';

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.get('formScreen')){
        this.formScreen = paramMap.get('formScreen');
      }

      if(paramMap.get('chooseDate') && paramMap.get('led_state')){

        // console.log(` Welcome DASH route_param_chooseDate= ${paramMap.get('chooseDate')}  ;route_param_led_state=${paramMap.get('led_state')}`);

        this.spinnerLoading = true;
        this.inspSearch.chooseDate = paramMap.get('chooseDate');
        this.inspSearch.led_state = paramMap.get('led_state');

        this.ledService.getInsp(this.rowsPerPage, 1, this.inspSearch) .subscribe(data =>{
          this.mitLedInspCustList = data;
          this.dataSource.next(this.mitLedInspCustList);
        }
        , error => {
            console.log("WAS ERR>>" + JSON.stringify(error) );
            this.spinnerLoading = false;
          }
          ,() => {
            // 'onCompleted' callback.
            this.spinnerLoading = false;


            if(this.mitLedInspCustList.length <= 0){
              this.toastr.warning(``,
                  "Not found data",
                  {
                    timeOut: 5000,
                    closeButton: true,
                    positionClass: "toast-top-center"
                  }
                );
            }
          }
        );

      }

   });

// Initial Form
    this.form = new FormGroup({

      custId: new FormControl(null, {
        // validators: [Validators.required]
      }),

      firstName: new FormControl(null, {
        // validators: [Validators.required]
      }),

      lastName: new FormControl(null, {
        // validators: [Validators.required]
      }),

      fromSource: new FormControl(null, {
        // validators: [Validators.required]
      }),

      led_code: new FormControl(null, {
        // validators: [Validators.required]
      }),

    });

    // Initial data
    this.masterDataService.getCodeLookup("LEDCODE").subscribe((data: any[]) => {
      this.codeLedList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
       console.log('Loading complete');
    });

  }


  onSerach() {
    // console.log('onSerachCust ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    this.spinnerLoading = true;

    this.ledService.getInsp(this.rowsPerPage, 1, this.inspSearch) .subscribe(data =>{
      this.mitLedInspCustList = data;
      this.dataSource.next(this.mitLedInspCustList);
    }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.spinnerLoading = false;
      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;


        if(this.mitLedInspCustList.length <= 0){
          this.toastr.warning(``,
              "Not found data",
              {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
        }
      }
    );

  }

  onChangedPage(pageData: PageEvent) {

    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

    console.log("currentPage>>" + this.currentPage  + "  ;rowsPerPage>>" + this.rowsPerPage);

    this.spinnerLoading = true;

    this.ledService.getInsp(this.rowsPerPage, this.currentPage, this.inspSearch) .subscribe(data =>{
      this.mitLedInspCustList = data;
      this.dataSource.next(this.mitLedInspCustList);
    }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.spinnerLoading = false;
      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;

        if(this.mitLedInspCustList.length <= 0){
          this.toastr.warning(``,
              "Not found data",
              {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
        }
      }
    );

  }


}
