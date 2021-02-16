import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { MatSelectChange } from '@angular/material';
import { CrmTask } from '../model/crmTask.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CrmService } from '../services/crmPersonal.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crm-task',
  templateUrl: './crm-task.component.html',
  styleUrls: ['./crm-task.component.scss']
})
export class CrmTaskComponent implements OnInit {

  schFormGroup: FormGroup;
  crmTaskObj: CrmTask = new CrmTask();
  private taskId: string;

  spinnerLoading = false;
  MODE_CREATE = 'CREATE';
  MODE_EDIT = 'EDIT';
  formScreen = 'N';
  private mode = this.MODE_CREATE;

  taskTypeList
  channelList
  prodGroupList
  feedbackList
  feedbackCategory

  productList=[
    {
      code:'000',
      text:'ไม่ระบุ',
    },
    {
      code:'1',
      text:'Chaiyo',
    },
    {
      code:'2',
      text:'JMT',
    },
    {
      code:'3',
      text:'PTT-w3',
    },
    {
      code:'4',
      text:'THAI',
    },
    {
      code:'5',
      text:'PTTGC',
    },
  ]

  responseList=[
    {
      code:'0',
      text:'โปรดระบุ',
    },
    {
      code:'1',
      text:'Mr.xxx',
    },
    {
      code:'2',
      text:'Mr.yyy',
    },
    {
      code:'3',
      text:'Mr.zzz',
    },
    {
      code:'DEV',
      text:'DEV',
    },
  ]

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    public route: ActivatedRoute,
    private crmPersonalService: CrmService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.schFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]

      title: new FormControl(null, {validators: [Validators.required]}),
      note: new FormControl(null, {}),

      schType: new FormControl(null, {validators: [Validators.required]}),
      // schStatus: new FormControl(null, {validators: [Validators.required]}),
      schStartDate: new FormControl(null, {validators: [Validators.required]}),


      channel: new FormControl(null, { }),
      prodCate: new FormControl(null, { }),
      productItem: new FormControl(null, { }),

      schCloseDate: new FormControl(null, { }),
      feedbackRS: new FormControl(null, { }),
      feedbackReason: new FormControl(null, { }),
      feedbackNote: new FormControl(null, { }),
      investType: new FormControl(null, { }),
      investValue: new FormControl(null, { }),
      investDate: new FormControl(null, { }),
      response: new FormControl(null, {validators: [Validators.required]}),

    });
  }

  ngAfterViewInit() {

    this.spinnerLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {


      if (paramMap.has('source') && paramMap.get('source') !== 'null') {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('taskId')
      && paramMap.get('taskId') !== 'undefined'
      && paramMap.get('taskId') !== 'null'
      && paramMap.get('taskId') !== ''
      ) {
        console.log('initial values')
        this.mode = this.MODE_EDIT;
        this.taskId = paramMap.get('taskId');
      }


      this.mode = this.MODE_EDIT;
      this.taskId = '2';

      console.log(`has taskId> :${paramMap.has('taskId')}  ;get:${paramMap.get('taskId')}`)
      console.log(`Initial taskId> :${this.taskId}  ;mode:${this.mode}`)

      //  Initial load master data
      var fnArray=[];
      fnArray.push(this.crmPersonalService.getMastert("taskType"));
      fnArray.push(this.crmPersonalService.getMastert("contactChannel"));
      fnArray.push(this.crmPersonalService.getMastert("prodGroup"));
      fnArray.push(this.crmPersonalService.getMastert("feedback"));
      fnArray.push(this.crmPersonalService.getMastert("feebackCategory"));

      if(this.mode === this.MODE_EDIT ) {
          fnArray.push(this.crmPersonalService.getTask(this.taskId)); //
      }


      forkJoin(fnArray)
      //  .subscribe(([call1Response, call2Response]) => {
       .subscribe((dataRs:any) => {

      this.taskTypeList=dataRs[0].recordset;
      this.channelList=dataRs[1].recordset;
      this.prodGroupList=dataRs[2].recordset;
      this.feedbackList=dataRs[3].recordset;
      this.feedbackCategory=dataRs[4].recordset;

         if(dataRs[5]){
          this.crmTaskObj=dataRs[5].recordset[0];

          console.log(' Task result:'+JSON.stringify(this.crmTaskObj))
         }

         if(this.crmTaskObj.prodCate)
         this.crmTaskObj.prodCate =  <any>this.crmTaskObj.prodCate.split(',');

         if(this.crmTaskObj.productItem)
         this.crmTaskObj.productItem =  <any>this.crmTaskObj.productItem.split(',');

         if(this.crmTaskObj.feedBackReson)
         this.crmTaskObj.feedBackReson =  <any>this.crmTaskObj.feedBackReson.split(',');

         if(this.crmTaskObj.response)
         this.crmTaskObj.response =  <any>this.crmTaskObj.response.split(',');

       });

    });
  }

  onSubmit(){


    if (this.schFormGroup.invalid) {
      console.log('form.invalid() ' + this.schFormGroup.invalid);
      return true;
    }
    console.log('Data is OK !!  ' + this.schFormGroup.invalid);

    //   console.log('AFTER SAVE', JSON.stringify(data));

    if(this.crmTaskObj.feedBackRS=='01'){
      this.crmTaskObj.feedBackReson=null;
    }

    this.crmPersonalService.updateTask(this.crmTaskObj)
    .subscribe((data: any ) => {

      console.log('Save sucessful', data);

      this.toastr.success("Save complete.", "Complete", {
        timeOut: 5000,
        closeButton: true,
        positionClass: "toast-top-center"
      });


    }, error => () => {
        console.log('Save error', error);

        this.toastr.warning(error, "Incomplete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

    }, () => {
       console.log('Submit complete');
    });

  }

}
