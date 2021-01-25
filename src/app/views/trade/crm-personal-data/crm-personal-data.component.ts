import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrmPersonModel } from '../model/crmPersonal.model';
import { BehaviorSubject } from 'rxjs';
import { CrmPersonalService } from '../services/crmPerson.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

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


   lbdu_list=[{'Code':'KF-RMF','Val':'100,000.00'}
   ,{'Code':'KFGTECHRMF', 'Val':'144,059.82'}
   ,{'Code':'KF-SSF', 'Val':'20,569.98'}
   ,{'Code':'TISCO-SSF', 'Val':'50,123.98'}
   ,{'Code':'KBANK-SSF', 'Val':'5123.98'}
  ];

  lbdu_displayedColumns: string[] = ['Code', 'Val'];
  lbdu_dataSource = new BehaviorSubject(this.lbdu_list);

  private_list=[{'Code':'PF001', 'Val':'20,000,000'}
   ,{'Code':'PF002', 'Val':'50,000,000'}

  ];

  private_displayedColumns: string[] = ['Code', 'Val'];
  private_dataSource = new BehaviorSubject(this.private_list);

  bond_list=[{'Code':'CHAIYO', 'Val':'1,000,000'}
   ,{'Code':'SANSIRI', 'Val':'2,000,000'}
   ,{'Code':'MAGNOLIA', 'Val':'10,000,000'}

  ];

  bond_displayedColumns: string[] = ['Code', 'Val'];
  bond_dataSource = new BehaviorSubject(this.bond_list);


  consent_list=[{'topic':'ยินยิมเปิดเผยข้อมูล', 'submitDate':'01/01/2020','status':'Active','action':''}
   ,{'topic':'ยินยอมให้ข้อมูลการตลาด', 'submitDate':'01/01/2020','status':'Cancel','action':''}
   ,{'topic':'ยิยยอมให้ข้อมูลจัดเก็บต่างประเทศ', 'submitDate':'01/01/2020','status':'Active','action':''}

  ];

  consent_displayedColumns: string[] = ['topic', 'submitDate','status','action'];
  consent_dataSource = new BehaviorSubject(this.consent_list);

  SexList =[
    {
    code:'Male',
    desc:'Male',
  },
  {
    code:'Female',
    desc:'Female',
  },
];

stateList = [{
  code:'Lead',
  desc:'Lead',
},
{
  code:'Prospect',
  desc:'Prospect',
},
{
  code:'Customer',
  desc:'Customer',
},
];

custTypeList = [{
  code:'Business',
  desc:'Business',
  },
  {
    code:'Individual',
    desc:'Individual',
  },
];

custGroupList = [{
  code:'Online',
  desc:'Online',
  },
  {
    code:'Agent',
    desc:'ตัวแทน',
  },
  {
    code:'General',
    desc:'ทั่วไป',
  },
];

interestList= [{
  code:'PF',
  desc:'PF',
  },
  {
    code:'BF',
    desc:'BF',
  },
  {
    code:'Bond',
    desc:'Bond',
  },
  {
    code:'BE',
    desc:'BE',
  },
];

SourceOfCustomerList = [{
  code:'Facebook',
  desc:'Facebook',
  },
  {
    code:'Line',
    desc:'Line',
  },
];

ReferList = [{
  code:'Pine',
  desc:'K.Pine',
  },
  {
    code:'Sale A',
    desc:'Sale A',
  },
  {
    code:'Sale B',
    desc:'Sale B',
  },
  {
    code:'Sale C',
    desc:'Sale C',
  },
];

ClassList = [{
  code:'Retail',
  desc:'Retail',
  },
  {
    code:'HNW',
    desc:'HNW',
  },
  {
    code:'U-HNW',
    desc:'U-HNW',
  },
];



  constructor(
    // private _formBuilder: FormBuilder,
    private location: Location,
    private crmPersonalService: CrmPersonalService,
    private router: Router,
    public dialog: MatDialog,
    public route: ActivatedRoute,
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

      if (paramMap.has('cust_Code')) {

        this.mode = this.MODE_EDIT;
        this.custCode = paramMap.get('cust_Code');
      }


       this.custCode='Input xxx'
    // Load personal data
        this.crmPersonalService.getPersonal(this.custCode).subscribe(custData => {
          this.spinnerLoading = false;

            console.log('Return getPersonal',JSON.stringify(custData))
          // this.personal ={}

          // this.customer = {
          //   Cust_Code: custData[0].Cust_Code,
          //   Card_Type: custData[0].Card_Type,
          //   Card_IssueDate: custData[0].Birth_Day, // custData.Card_IssueDate,
          //   Card_ExpDate: custData[0].Card_ExpDate,
          //   Group_Code: custData[0].Group_Code,
          //   Title_Name_T: custData[0].Title_Name_T,
          //   First_Name_T: custData[0].First_Name_T,
          //   Last_Name_T: custData[0].Last_Name_T,
          //   Title_Name_E: custData[0].Title_Name_E,
          //   First_Name_E: custData[0].First_Name_E,
          //   Last_Name_E: custData[0].Last_Name_E,
          //   Birth_Day: custData[0].Birth_Day,
          //   Nation_Code: custData[0].Nation_Code,
          //   Sex: custData[0].Sex,
          //   Tax_No: custData[0].Tax_No,
          //   Mobile: custData[0].Mobile,
          //   Email: custData[0].Email,
          //   MktId: custData[0].MktId,
          //   Create_By: custData[0].Create_By,
          //   Create_Date: custData[0].Create_Date,
          //   Modify_By: custData[0].Modify_By,
          //   Modify_Date: custData[0].Modify_Date,
          //   IT_SentRepByEmail: custData[0].IT_SentRepByEmail,
          //   OTP_ID:'',
          // };

          
        }, error => () => {
          console.log('Load error', error);
      }, () => {
         console.log('Load complete');
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
       validators: [Validators.required]
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
     SourceOfCustomer: new FormControl(null, {}),
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

      // if ( data.result && data.result.wfRef !== 'undefined') {
      //   this.openDialog('success', 'Create customer was successful.', 'The refference number is ' +  data.result.wfRef);
      //   this.saveCustomerComplete = true;
      // } else {
      //   this.openDialog('danger', 'Create customer was error',  data.message.originalError.info.message + '!  Please contact IT staff.' );
      // }

    }, error => () => {
        console.log('Save error', error);
    }, () => {
       console.log('Loading complete');
    });

  }


  goBack() {
    this.location.back();
  }


  // ****************************** Graph

  // theme: string;
  // options = {
  //   title: {
  //     text: 'Nightingale\'s Rose Diagram',
  //     subtext: 'Mocking Data',
  //     x: 'center'
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: '{a} <br/>{b} : {c} ({d}%)'
  //   },
  //   legend: {
  //     x: 'center',
  //     y: 'bottom',
  //     data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
  //   },
  //   calculable: true,
  //   series: [
  //     {
  //       name: 'area',
  //       type: 'pie',
  //       radius: [30, 110],
  //       roseType: 'area',
  //       data: [
  //         { value: 10, name: 'rose1' },
  //         { value: 5, name: 'rose2' },
  //         { value: 15, name: 'rose3' },
  //         { value: 25, name: 'rose4' },
  //         { value: 20, name: 'rose5' },
  //         { value: 35, name: 'rose6' },
  //         { value: 30, name: 'rose7' },
  //         { value: 40, name: 'rose8' }
  //       ]
  //     }
  //   ]
  // };

  // ******************************

    // events
    public chartClicked(e: any): void {
      console.log(e);
    }

    public chartHovered(e: any): void {
      console.log(e);
    }


}
