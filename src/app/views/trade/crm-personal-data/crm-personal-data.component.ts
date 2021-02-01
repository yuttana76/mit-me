import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrmPersonModel , MasterData} from '../model/crmPersonal.model';
import { BehaviorSubject } from 'rxjs';
import { CrmPersonalService } from '../services/crmPerson.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { forkJoin } from 'rxjs';
import { ResultDialogComponent } from '../dialog/result-dialog/result-dialog.component';
import { ToastrService } from 'ngx-toastr';

// import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking

@Component({
  selector: 'app-crm-personal-data',
  templateUrl: './crm-personal-data.component.html',
  styleUrls: ['./crm-personal-data.component.scss']
})
export class CrmPersonalDataComponent implements OnInit, OnDestroy {

  personalForm: FormGroup;
  paramId: String = '';
  personal: CrmPersonModel = new CrmPersonModel();
  isDisableFields = false;
  spinnerLoading = false;

  MODE_CREATE = 'create';
  MODE_EDIT = 'edit';

  formScreen = 'N';
  private mode = this.MODE_CREATE;
  private custCode: string;

  consent_list=[{'topic':'ยินยิมเปิดเผยข้อมูล', 'submitDate':'01/01/2020','status':'Active','action':''}
   ,{'topic':'ยินยอมให้ข้อมูลการตลาด', 'submitDate':'01/01/2020','status':'Cancel','action':''}
   ,{'topic':'ยิยยอมให้ข้อมูลจัดเก็บต่างประเทศ', 'submitDate':'01/01/2020','status':'Active','action':''}

  ];

  consent_displayedColumns: string[] = ['topic', 'submitDate','status','action'];
  consent_dataSource = new BehaviorSubject(this.consent_list);

//List of value
SexList
stateList ;
custTypeList;
ClassList;
interestList;
ReferList

  constructor(
    // private _formBuilder: FormBuilder,
    private location: Location,
    private crmPersonalService: CrmPersonalService,
    private router: Router,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private toastr: ToastrService,
  ) {

   }

  ngOnInit() {
    this.spinnerLoading = true;
    this._buildForm();

  }

  ngAfterViewInit() {

    this.spinnerLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('source')) {
        // console.log('SOURCE>>', paramMap.get('source'));
        this.formScreen = paramMap.get('source');
      }

      // this.custCode='1'

      if (paramMap.has('cust_Code')) {
        this.mode = this.MODE_EDIT;
        this.custCode = paramMap.get('cust_Code');
      }

      console.log('Initial cust_Code> ',this.custCode )

      //  Initial load master data
      var fnArray=[];
      fnArray.push(this.crmPersonalService.getMastert("custState"));
      fnArray.push(this.crmPersonalService.getMastert("custType"));
      fnArray.push(this.crmPersonalService.getMastert("custClass"));
      fnArray.push(this.crmPersonalService.getMastert("prodGroup"));
      fnArray.push(this.crmPersonalService.getMastert("custRefer"));
      fnArray.push(this.crmPersonalService.getMastert("sex"));

      fnArray.push(this.crmPersonalService.getPersonal(this.custCode)); //

      forkJoin(fnArray)
      //  .subscribe(([call1Response, call2Response]) => {
       .subscribe((dataRs:any) => {

         this.stateList=dataRs[0].recordset;
         this.custTypeList=dataRs[1].recordset;
         this.ClassList=dataRs[2].recordset;
         this.interestList=dataRs[3].recordset;
         this.ReferList=dataRs[4].recordset;
         this.SexList=dataRs[5].recordset;

         console.log( " dataRs[6]>>" +JSON.stringify(dataRs[6].recordset))
         this.personal=dataRs[6].recordset[0];

        //  ["retail","mf","pf"]
        //  "Interested":"retail,mf,pf",

         this.personal.Interested =  <any>this.personal.Interested.split(',');

       });

    });
  }

  private _buildForm() {
    // Initial Form fields
    this.personalForm = new FormGroup({

      FirstName: new FormControl(null, {
       validators: [Validators.required]
     }),
     LastName: new FormControl(null, {
      //  validators: [Validators.required]
     }),

     CustomerAlias: new FormControl(null, {}),
     Dob: new FormControl(null, {}),
     Sex: new FormControl(null, {}),
     Mobile: new FormControl(null, {
      validators: [Validators.required]
     }),
     Telephone: new FormControl(null, {}),
     Email: new FormControl(null, {}),
     SocialAccount: new FormControl(null, {}),
     ImportantData: new FormControl(null, {}),
     Refer: new FormControl(null, {}),
     State: new FormControl(null, {}),
     Type: new FormControl(null, {}),
     Class: new FormControl(null, {}),
     Interested: new FormControl(null, {}),
    //  SourceOfCustomer: new FormControl(null, {}),
     InvestCondition: new FormControl(null, {}),

    });
  }


  ngOnDestroy() {
    // this.formChangeSub.unsubscribe();
  }

  onPersonFormSubmit() {

    if (this.personalForm.invalid) {
      console.log('form.invalid() ' + this.personalForm.invalid);

      return true;
    }

    console.log('Data is OK !!  ' + this.personalForm.invalid);

    //   console.log('AFTER SAVE', JSON.stringify(data));
    this.crmPersonalService.updatePerson(this.personal)
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

  goBack() {
    this.location.back();
  }



    // events
    public chartClicked(e: any): void {
      console.log(e);
    }

    public chartHovered(e: any): void {
      console.log(e);
    }


}
