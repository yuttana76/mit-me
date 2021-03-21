import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SttOpenService } from '../services/sttOpen.service';

@Component({
  selector: 'app-stt-open-search-app',
  templateUrl: './stt-open-search-app.component.html',
  styleUrls: ['./stt-open-search-app.component.scss']
})
export class SttOpenSearchAppComponent implements OnInit {
  testData=[
    {
        "applicationId": 11009338,
        "status": "SUBMITTED",
        "ndidStatus": "ACCEPTED",
        "ndidResponseErrorCode": null,
        "statusDetail": {
            "rejectedFields": [
                {
                    "pageNum": 1,
                    "description": ""
                },
                {
                    "pageNum": 4,
                    "description": "ผู้ติดต่อเบอร์ไม่ครบ"
                },
                {
                    "pageNum": 8,
                    "description": "รูปไม่ชัด"
                }
            ],
            "redirectedPage": 7
        },
        "types": [
            "FUND"
        ],
        "verificationType": "NDID",
        "verifyIdpFailedCount": 0,
        "contractNo": "ZH722EL21",
        "ddrBankCode": null,
        "ddrBankAccountNo": null,
        "ddrStatus": null,
        "ddrUrl": null,
        "createdTime": "2021-02-05T20:03:31.673",
        "lastUpdatedTime": "2021-02-05T20:12:00.452",
        "submittedTime": "2021-02-05T20:08:09.367",
        "user": {
            "userId": 9406,
            "cid": "5648135769569",
            "firstName": "แซวม่อน",
            "lastName": "เมี๊ยวๆ",
            "telNo": "0939404628"
        },
        "userIP": "1.47.106.120"
    }
  ]

  spinnerLoading = false;
  searchForm: FormGroup;

  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  // dataSource = new BehaviorSubject([]);
  dataSource = new BehaviorSubject(this.testData);

  private taskSub: Subscription;
  displayedColumns: string[] = ['ID','CustInfo','Status', 'Verify','ActionDate','ACT'];

  statusList =[
    {code:'CREATED',text:'CREATED'},
    {code:'NDID_PENDING',text:'NDID_PENDING'},
    {code:'NDID_REJECTED',text:'NDID_REJECTED'},
    {code:'NDID_APPROVED',text:'NDID_APPROVED'},
    {code:'SUBMITTED',text:'SUBMITTED'},
    {code:'NEED_MODIFICATION',text:'NEED_MODIFICATION'},
    {code:'REJECTED',text:'REJECTED'},
    {code:'APPROVED',text:'APPROVED'},
  ]


  constructor(
    public datepipe: DatePipe,
    private sttOpenService:SttOpenService
  ) { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      status: new FormControl(null, {
        // validators: [Validators.required]
      }),
      startLastUpdatedTime: new FormControl(null, {
        // validators: [Validators.required]
      }),
      endLastUpdatedTime: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });
  }

  ngAfterViewInit() {

    // var fnArray=[];
    // fnArray.push(this.crmPersonalService.getMastert("taskType"));

    // forkJoin(fnArray)
    //    .subscribe((dataRs:any) => {
    //     this.taskTypeList=dataRs[0].recordset;
    // });

  }

  onSerach(){
    console.log('Welcome >> search e-open')

    if (this.searchForm.invalid) {
      console.log('form.invalid() ' + this.searchForm.invalid);
      return true;
    }
    // this.spinnerLoading = true;

    let status = this.searchForm.get('status').value
    let schStartDate = this.searchForm.get('startLastUpdatedTime').value
    let schEndDate = this.searchForm.get('endLastUpdatedTime').value

    // 2021-02-01T00:00:00
    if (schStartDate) {
      schStartDate = this.datepipe.transform(schStartDate, 'yyyy-MM-dd');
    }

    if (schEndDate) {
      schEndDate = this.datepipe.transform(schEndDate, 'yyyy-MM-dd');
    }


    // console.log( ` *** status>${status} ;  schStartDate>${schStartDate} ;schEndDate>${schEndDate} `);

    this.sttOpenService.getApplications(status,schStartDate,schEndDate).subscribe(data=>{

      console.log(JSON.stringify(data));

    })


  }

  onReset(){

  }

  onChangedPage(pageData: PageEvent) {

  }

}
