import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FundConnextService } from '../services/fundConnext.service';
import { ToastrService } from 'ngx-toastr';
import { FcDownload } from '../model/FcDownload.model';

export class Inverter {

  cardNumber: string;
}

@Component({
  selector: 'app-fcutility',
  templateUrl: './fcutility.component.html',
  styleUrls: ['./fcutility.component.scss']
})
export class FCUtilityComponent implements OnInit {

  spinnerLoading = false;
  downloadInvestorForm: FormGroup;
  downloadResponse="";

  NavFundRecord;
  downloadForm: FormGroup;
  fcdownloadAPI:FcDownload = new FcDownload();

  approveInvestorForm: FormGroup;

  public inverter : Inverter;



  constructor(
    private fundConnextService:FundConnextService,
    private toastr: ToastrService,

    ) {
    this.inverter = new Inverter();

   }

  ngOnInit() {

    this.downloadInvestorForm = new FormGroup({
      cardNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.approveInvestorForm = new FormGroup({
      cardNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.downloadForm = new FormGroup({
      fileType: new FormControl(null, {
        validators: [Validators.required]
      }),

      businessDate: new FormControl(null, {
        validators: [Validators.required]
      }),

    });
  }

  onDownloadInvestor(){

    this.spinnerLoading = true;
    this.downloadResponse ="";

    this.fundConnextService.downloadInvestor(this.inverter).subscribe((result:any) => {

      this.spinnerLoading = false;
      // console.log("downloadInvestor >>" + JSON.stringify(result));

      if(result.code===0){
        this.downloadResponse ="Complete"
        this.toastr.success("Download invertor profile complete.", "Complete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

      }else{
        this.downloadResponse = result.message;
        this.toastr.warning(result.message, "Incomplete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      }

    });

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

}
