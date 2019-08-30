import { Component, OnInit } from '@angular/core';
import { FcDownload } from '../model/FcDownload.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { FundConnextService } from '../services/fundConnext.service';

@Component({
  selector: 'app-fcapp',
  templateUrl: './fcapp.component.html',
  styleUrls: ['./fcapp.component.scss']
})
export class FCAppComponent implements OnInit {


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
  constructor(private toastr: ToastrService,public dialog: MatDialog,private fundConnextService:FundConnextService) { }

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

}
