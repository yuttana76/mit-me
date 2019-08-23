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
  canExeBtn:false;

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

  }

  onChangeDate(event: MatDatepickerInputEvent<Date>) {
    // this.fcdownloadAPI.businessDate = formatDate(event.value, 'yyyyMMdd', 'en');
    // console.log(" onChangeDate()!!!" + JSON.stringify(this.fcdownloadAPI));
  }

  downloadExe(){
    console.log(" downloadExe()!!!" + JSON.stringify(this.fcdownloadAPI));

    this.fcdownloadAPI.businessDate = formatDate(this.fcdownloadAPI.businessDate, 'yyyyMMdd', 'en');

    this.fundConnextService.getDownloadAPI(this.fcdownloadAPI).subscribe(data =>{

      console.log('start download:',data);

      const blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      let link = document.createElement("a");

      if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "downloadExcel");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }



    }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        // this.spinnerLoading = false;

        this.toastr.error(``,
        error,
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

        // if(this.mitLedInspCustList.length <= 0){
        //   this.toastr.warning(``,
        //       "Not found data",
        //       {
        //         timeOut: 5000,
        //         closeButton: true,
        //         positionClass: "toast-top-center"
        //       }
        //     );
        // }

      }
    );

  }

}
