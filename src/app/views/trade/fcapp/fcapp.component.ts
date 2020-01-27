import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FcDownload } from '../model/FcDownload.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FundConnextService } from '../services/fundConnext.service';

import * as jsPDF from 'jspdf';

// D:\Merchants\apps\mit\src\assets\fonts\THSarabunNew\THSarabunNew-normal.js
import THSarabunNew from '../../../../assets/fonts/THSarabunNew/THSarabunNew-normal.js';
import THSarabunNewBold from '../../../../assets/fonts/THSarabunNew/THSarabunNew-Bold-bold.js';

declare let pdfMake: any ;
@Component({
  selector: 'app-fcapp',
  templateUrl: './fcapp.component.html',
  styleUrls: ['./fcapp.component.scss']
})
export class FCAppComponent implements OnInit {

  NavFundRecord;
  constructor(private toastr: ToastrService,public dialog: MatDialog,private fundConnextService:FundConnextService) { }

  spinnerLoading = false;
  fileTypeList =[
    {value: 'FundMapping.zip', display: 'FundMapping'},
    {value: 'FundProfile.zip', display: 'FundProfile'},
    {value: 'FundHoliday.zip', display: 'FundHoliday'},
    {value: 'SwitchingMatrix.zip', display: 'SwitchingMatrix'},
    {value: 'TradeCalendar.zip', display: 'TradeCalendar'},
    {value: 'AccountProfile.zip', display: 'AccountProfile'},
    {value: 'UnitholderMapping.zip', display: 'UnitholderMapping'},
    {value: 'BankAccountUnitholder.zip', display: 'BankAccountUnitholder'},
    {value: 'CustomerProfile.zip', display: 'CustomerProfile'},
    {value: 'Nav.zip', display: 'Nav'},
    {value: 'UnitholderBalance.zip', display: 'UnitholderBalance'},
    {value: 'AllottedTransactions.zip', display: 'AllottedTransactions'},
    {value: 'DividendNews.zip', display: 'DividendNews'},
    {value: 'DividendTransactions.zip', display: 'DividendTransactions'},
  ]

  downloadForm: FormGroup;
  fcdownloadAPI:FcDownload = new FcDownload();


  // *********
  api_records=0;

  @ViewChild('content') content:  ElementRef;

  ngOnInit() {

    this.downloadForm = new FormGroup({
      fileType: new FormControl(null, {
        validators: [Validators.required]
      }),

      businessDate: new FormControl(null, {
        validators: [Validators.required]
      }),

    });

    this.downloadForm.valueChanges.subscribe(dt => this.downloadFormfieldChanges());
  }


  downloadFormfieldChanges(){
      this.api_records=0;
  }

  // downloadExcute(){
  //   console.log('Welcome downloadExcute()');
  //   this.downloaInfo();
  // }

  downloadExcel(){
    this.fcdownloadAPI.fileAs='excel'
    this.downloadAPI();

  }

  downloadZip(){
    this.fcdownloadAPI.fileAs='zip'
    this.downloadAPI();
  }

  uploadDB(){
    console.log('Welcome uploadDB()');

    this.fundConnextService.uploadDB(this.fcdownloadAPI).subscribe(infoData =>{
      console.log(JSON.stringify(infoData));

    }, error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.toastr.error(``,  error,
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
        );
      },() => {
        this.spinnerLoading = false;
      }
    );
  }

  exportExcel(){
    console.log('Welcome exportExcel()' + this.fcdownloadAPI.extractArray[0]);

    this.fcdownloadAPI.extract = this.fcdownloadAPI.extractArray[0];

    this.fundConnextService.exportExcel(this.fcdownloadAPI).subscribe(data =>{

      // console.log('start data>>',data);
      const blob: any = new Blob([data], { type: data.type });
      let link = document.createElement("a");

      if (blob) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "downloadFile");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      }else{
        this.toastr.error(``, 'Not found data.',
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
        );
      }

    }, error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.toastr.error(``,  error,
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
        );
      },() => {
        this.spinnerLoading = false;
      }
    );
  }


  // ****************************************
  downloadAPI(){

    console.log(" downloadExe()!!!" + JSON.stringify(this.fcdownloadAPI));

    this.fundConnextService.getDownloadAPI(this.fcdownloadAPI).subscribe(data =>{

      console.log('start data>>',data);
      const blob: any = new Blob([data], { type: data.type });
      let link = document.createElement("a");

      if (blob) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "downloadFile");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      }else{
        this.toastr.error(``, 'Not found data.',
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
      );
      }

    }, error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.toastr.error(``,  error,
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
      );

      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;
      }
    );
  }

  downloaInfo(){

    this.api_records =0;

    this.fundConnextService.getDownloaInfo(this.fcdownloadAPI).subscribe(infoData =>{
      const infoDataObj = JSON.parse(JSON.stringify(infoData))

      if(infoDataObj){
        if(infoDataObj.records){
          this.api_records = infoDataObj.records;
        }else{
          this.api_records = 0;
        }

        if(infoDataObj.extract){
          // this.fcdownloadAPI.extract = infoDataObj.extract;
          this.fcdownloadAPI.extractArray = infoDataObj.extract;
        }
        console.log("***infoDataObj>"+JSON.stringify(infoDataObj));
      }
    }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        // this.spinnerLoading = false;
        this.toastr.error(``,  error,
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
      );

      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;
      }
    );
  }


  onDownloadNAV_Sync(){

    console.log('onDownloadNAV_Sync() >' + JSON.stringify(this.fcdownloadAPI));

    this.spinnerLoading = true;

    this.fundConnextService.downloadNAV_Sync(this.fcdownloadAPI).subscribe(data =>{
      const rtnData = JSON.parse(JSON.stringify(data))

        console.log("***rtnData>"+JSON.stringify(rtnData));
        this.NavFundRecord =rtnData.record;

            this.toastr.success(`NAV update found  ${rtnData.record} record` , "Successful", {
          timeOut: 3000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.spinnerLoading = false;

        this.toastr.error(``,  error,
        {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        }
      );

      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;
      }
    );


  }

  generatePdf(){





var doc = new jsPDF();

/**
 * Not finish yet has error
 */
// doc.addFileToVFS('THSarabunNew-normal.ttf', THSarabunNew)
// doc.addFileToVFS('Roboto-Bold.ttf', THSarabunNewBold)
// doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal')
// doc.addFont('Roboto-Bold.ttf', 'THSarabunNew', 'bold')
// doc.setFont('THSarabunNew')


doc.text(20, 20, 'Hello world! Yuttana บอม !');
doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF. ');
doc.addPage();
doc.text(20, 20, 'Do you like that?');

// Save the PDF
doc.save('Test.pdf');

   }



}
