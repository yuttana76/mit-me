import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SuiteService } from '../services/suit.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KycSurveyList } from '../model/kycSurveyList';
import { PageEvent, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { DatePipe } from '@angular/common';

import {dateDBFormatPipe} from '../pipe/dateFormatPipe';
import { SelectionModel } from '@angular/cdk/collections';
import { KycDetailDialogComponent } from '../dialog/kyc-detail-dialog/kyc-detail-dialog.component';
import { SurveySearchActionDialogComponent } from '../dialog/surveySearch-action-dialog/surveySearch-action-dialog.component';
import { ExportPDFService } from './exportPDF.service';


@Component({
  selector: 'app-survey-search',
  templateUrl: './survey-search.component.html',
  styleUrls: ['./survey-search.component.scss']
})
export class SurveySearchComponent implements OnInit {

  spinnerLoading = false;
  kycSurveyList: KycSurveyList[] = [];
  private postsSub: Subscription;
  dateDBFormatPipeFilter = new dateDBFormatPipe();

  form: FormGroup;
  displayedColumns: string[] = ['position','Cust_Code', 'FullName', 'KYC_C_DATE', 'SUIT_DATE','Action'];
  // dataSource = new BehaviorSubject([]);
  dataSource = new MatTableDataSource<KycSurveyList>(this.kycSurveyList);

  selection = new SelectionModel<KycSurveyList>(true, []);

  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];

  cust_Code_Cond: string;
  surveyStartDate_Cond :string;
  surveyToDate_Cond : string;

  kycDetailDialogComponent: MatDialogRef<KycDetailDialogComponent>;
  searchActionDialogComponent: MatDialogRef<SurveySearchActionDialogComponent>;

  constructor(
    private suiteService: SuiteService,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit() {

    this.form = new FormGroup({
      cust_Code: new FormControl(null, {
        // validators: [Validators.required]
      }),
      SurveyStartDate: new FormControl(null, {
        // validators: [Validators.required]
      }),
      SurveyToDate: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });

    this.postsSub = this.suiteService.getKycSurveyListener().subscribe((list: KycSurveyList[]) => {
      this.spinnerLoading = false;
      this.kycSurveyList = list;
  });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }


  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.spinnerLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

    this.suiteService.getKycSurveyList(this.rowsPerPage, this.currentPage, this.cust_Code_Cond,this.surveyStartDate_Cond,this.surveyToDate_Cond);

    this.postsSub = this.suiteService.getKycSurveyListener().subscribe((list: KycSurveyList[]) => {
          this.spinnerLoading = false;
          this.kycSurveyList = list;
          // this.dataSource.next(this.kycSurveyList);
          this.dataSource = new MatTableDataSource<KycSurveyList>(this.kycSurveyList);

      },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
      );
  }


  onSurveySerach() {

    console.log('onSerachCust ! ');

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    this.spinnerLoading = true;

    let _surveyStartDate_Cond = this.dateDBFormatPipeFilter.transform(this.surveyStartDate_Cond);
    let _surveyToDate_Cond = this.dateDBFormatPipeFilter.transform(this.surveyToDate_Cond);

    this.suiteService.getKycSurveyList(this.rowsPerPage, this.currentPage, this.cust_Code_Cond,_surveyStartDate_Cond,_surveyToDate_Cond);
    this.postsSub = this.suiteService.getKycSurveyListener().subscribe((list: KycSurveyList[]) => {
          this.spinnerLoading = false;
          this.kycSurveyList = list;
          // this.dataSource.next(this.kycSurveyList);
          this.dataSource = new MatTableDataSource<KycSurveyList>(this.kycSurveyList);
      },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
      );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: KycSurveyList): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  onKYCdetail(Cust_Code: string) {
    this.kycDetailDialogComponent = this.dialog.open(KycDetailDialogComponent, {
      width: '800px',
      height: '800px',
      data: Cust_Code
    });

    this.kycDetailDialogComponent.afterClosed()
    .subscribe(result => {
        console.log('onNewMobileDialog afterClosed()=> ', result);

        // if(result ==='newMobileSuccess'){
        //   this.toastr.success(` `,
        //   "ดำเนินการสำเร็จ",
        //   {
        //     timeOut: 3000,
        //     closeButton: true,
        //     positionClass: "toast-top-center"
        //   }
        //   );
        // }

    });
  }

  onCreateViewPDF() {

    this.spinnerLoading=true;
    this.suiteService.createKYCForm(this.authService.getUserId(),this.cust_Code_Cond)
    .finally(() => {
      this.spinnerLoading=false;
    })
    .subscribe((rs)=>{

      console.log('RS Create:'+JSON.stringify(rs));

     if(rs.code == '0'){

      this.suiteService.downloadKYCForm(this.authService.getUserId(),this.cust_Code_Cond).subscribe((rs)=>{
        const blob = new Blob([rs], { type: 'application/pdf' });
        const url= window.URL.createObjectURL(blob);
        window.open(url);
        });
     }
    });
  }

  // onExportPDF() {
  //   this.suiteService.downloadKYCForm(this.authService.getUserId(),this.cust_Code_Cond).subscribe((rs)=>{
  //     const blob = new Blob([rs], { type: 'application/pdf' });
  //     const url= window.URL.createObjectURL(blob);
  //     window.open(url);
  //   });
  // }

  onActionDialog(Cust_Code: string) {

    this.searchActionDialogComponent = this.dialog.open(SurveySearchActionDialogComponent, {
      width: '800px',
      data: Cust_Code
    });

    this.searchActionDialogComponent.afterClosed().subscribe(result => {
        console.log('onNewMobileDialog afterClosed()=> ', result);

        // if(result ==='newMobileSuccess'){
        //   this.toastr.success(` `,
        //   "ดำเนินการสำเร็จ",
        //   {
        //     timeOut: 3000,
        //     closeButton: true,
        //     positionClass: "toast-top-center"
        //   }
        //   );
        // }

    });
  }

  onNewSurvey(){
    console.log('Go to New Survey');
  }

}
