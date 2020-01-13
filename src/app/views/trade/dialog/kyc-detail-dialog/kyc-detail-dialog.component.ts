import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CddService } from '../../services/cdd.service';
import { ChildService } from '../../services/child.service';
import { CDDModel } from '../../model/cdd.model';
import { AddrCustModel } from '../../model/addrCust.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SuiteService } from '../../services/suit.service';
import { Question } from '../../model/question.model';
import { KycFormService } from './kyc.service';
import { SurveyModel } from '../../model/survey.model';

@Component({
  selector: 'app-kyc-detail-dialog',
  templateUrl: './kyc-detail-dialog.component.html',
  styleUrls: ['./kyc-detail-dialog.component.scss']
})
export class KycDetailDialogComponent implements OnInit {

  spinnerLoading = false;

  // form: FormGroup;
  cddFormGroup: FormGroup;
  FATCAGroup: FormGroup;
  register_formGroup: FormGroup;
  work_formGroup: FormGroup;
  current_formGroup: FormGroup;
  mail_formGroup: FormGroup;
  suitFormGroup: FormGroup;

  formReadOnly =true;

  public cddData = new CDDModel() ;
  public re_addrData: AddrCustModel = new AddrCustModel();
  public cur_addrData: AddrCustModel = new AddrCustModel();
  public work_addrData: AddrCustModel = new AddrCustModel();
  public mail_addrData: AddrCustModel = new AddrCustModel();
  public survey: SurveyModel = new SurveyModel();

  fatcaQuestions: Array<Question>;
  suitQuestions: Array<Question>;

  constructor(
    public formService: KycFormService,
    public dialogRef: MatDialogRef<KycDetailDialogComponent> ,
    @Optional() @Inject(MAT_DIALOG_DATA) public custCode: any,
    private cddService: CddService,
    private childService: ChildService,
    private suiteService: SuiteService,
  ) { }

  ngOnInit() {
    console.log("Init >>" + JSON.stringify(this.custCode));

    this.re_addrData.Addr_Seq = 1;
    if(!this.re_addrData.Country_Id){
      this.re_addrData.Country_Id = 0;
    }

    this.cur_addrData.Addr_Seq = 2;
    if(!this.cur_addrData.Country_Id){
      this.cur_addrData.Country_Id = 0;
    }

    this.work_addrData.Addr_Seq = 3;
    if(!this.work_addrData.Country_Id){
      this.work_addrData.Country_Id = 0;
    }

    this.mail_addrData.Addr_Seq = 4;
    if(!this.mail_addrData.Country_Id){
      this.mail_addrData.Country_Id = 0;
    }

    this.spinnerLoading = true;

    this._buildForm();

    if(this.formReadOnly){
      this.register_formGroup.disable();
      this.work_formGroup.disable();
      this.current_formGroup.disable();
      this.mail_formGroup.disable();
      this.suitFormGroup.disable();
    }

  }

  ngAfterViewInit(){
    // Load CDD
    this.getCDD(this.custCode);

    // Load address
    this.getCDDAddress(this.custCode, 1);
    this.getCDDAddress(this.custCode, 2);
    this.getCDDAddress(this.custCode, 3);

    // FATCA
    this.loadFATCA(this.custCode);

    // Suitability
    this.loadSuitByCust(this.custCode);
  }


  onClose(): void {
    this.dialogRef.close('close');
  }


  private _buildForm() {
    // Initial Form fields
    // this.form = new FormGroup({
    //   pid: new FormControl(null, {
    //     validators: [Validators.required]
    //   })
    // });

   // Initial  firstFormGroup
   this.cddFormGroup = new FormGroup({

    // identificationCardType: new FormControl(null, {
    //   validators: [Validators.required]
    // }),
    // passportCountry: new FormControl(null, {
    //   validators: [Validators.required]
    // }),

    pid: new FormControl(null, {
      validators: [Validators.required]
    }),

    title: new FormControl(null, {
      validators: [Validators.required]
    }),
    titleOth: new FormControl(null, {
      validators: [Validators.required]
    }),

    firstName: new FormControl(null, {
      validators: [Validators.required]
    }),
    lastName: new FormControl(null, {
      validators: [Validators.required]
    }),
    firstNameE: new FormControl(null, {
      validators: [Validators.required]
    }),
    lastNameE: new FormControl(null, {
      validators: [Validators.required]
    }),
    dob: new FormControl(null, {
      validators: [Validators.required]
    }),
    nationality: new FormControl(null, {
      validators: [Validators.required]
    }),
    PIDExpDate: new FormControl(null, {
      validators: [Validators.required]
    }),
    cardNotExp: new FormControl(null, {
      // validators: [Validators.required]
    }),
    mobile: new FormControl(null, {
      validators: [Validators.required]
    }),
    email: new FormControl(null, {
      validators: [Validators.required]
    }),
    typeBusiness: new FormControl(null, {
      validators: [Validators.required]
    }),
    typeBusinessOth: new FormControl(null, {
      validators: [Validators.required]
    }),
    occupation: new FormControl(null, {
      validators: [Validators.required]
    }),
    occupationOth: new FormControl(null, {
      validators: [Validators.required]
    }),

    position: new FormControl(null, {
      validators: [Validators.required]
    }),
    positionOth: new FormControl(null, {
      validators: [Validators.required]
    }),

    incomeLevel: new FormControl(null, {
      validators: [Validators.required]
    }),
    incomeSource: new FormControl(null, {
      validators: [Validators.required]
    }),
    incomeSourceOth: new FormControl(null, {
      validators: [Validators.required]
    }),
    workPlace: new FormControl(null, {
      validators: [Validators.required]
    }),
    maritalStatus: new FormControl(null, {
      validators: [Validators.required]
    }),

    // Spouce
    spCardType: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spCardNumber: new FormControl(null, {
      // validators: [Validators.required]
    }),

    spPassportCountry: new FormControl(null, {
      // validators: [Validators.required]
    }),

    spCardExpDate: new FormControl(null, {
      // validators: [Validators.required]
    }),

    spCardNotExp: new FormControl(null, {
      // validators: [Validators.required]
    }),

    spTitle: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spTitleOther: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spFirstName: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spLastName: new FormControl(null, {
      // validators: [Validators.required]
    }),


    moneyLaundaring: new FormControl(null, {
      validators: [Validators.required]
    }),
    politicalRelate: new FormControl(null, {
      validators: [Validators.required]
    }),
    rejectFinancial: new FormControl(null, {
      validators: [Validators.required]
    }),
    taxDeduction: new FormControl(null, {
      validators: [Validators.required]
    }),

    numberChildren: new FormControl(null, {
      // validators: [Validators.required]
    }),

  });


  this.FATCAGroup = new FormGroup({
    // cust_RiskLevel: new FormControl(null, {
    //   validators: [Validators.required, Validators.minLength(1)]
    // }),
  });

  this.suitFormGroup = new FormGroup({
    cust_RiskLevel: new FormControl(null, {
      // validators: [Validators.required, Validators.minLength(1)]
    }),

  });


  //  Initial register_formGroup
  this.register_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),

    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),


    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    }),

    work_addrData: new FormControl(null, {
      validators: [Validators.required]
    }),
    cur_addrData: new FormControl(null, {
      validators: [Validators.required]
    }),
    MailSameAs: new FormControl(null, {
      validators: [Validators.required]
    }),


  });

  // this.register_formGroup = new FormGroup({ });
  this.work_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),

    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    }),
  });

  this.current_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),

    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    }),
  });


  this.mail_formGroup = new FormGroup({
    Addr_No: new FormControl(null, {
      validators: [Validators.required]
    }),
    Moo: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Place: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Floor: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Soi: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Road: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Tambon_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Amphur_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Province_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_Id: new FormControl(null, {
      validators: [Validators.required]
    }),
    Country_oth: new FormControl(null, {
      // validators: [Validators.required]
    }),

    Zip_Code: new FormControl(null, {
      validators: [Validators.required]
    }),
    Tel: new FormControl(null, {
      // validators: [Validators.required]
    }),
    Fax: new FormControl(null, {
      // validators: [Validators.required]
    })
  });


  }


 getCDD(_id){
  this.cddService.getCustCDDInfo(_id).subscribe(data => {

    if(data ){

      this.cddData.identificationCardType = data[0].identificationCardType;
      this.cddData.passportCountry = data[0].passportCountry;
      this.cddData.title = data[0].title;
      this.cddData.titleOther = data[0].titleOther;
      this.cddData.firstNameE = data[0].firstNameE;
      this.cddData.lastNameE = data[0].lastNameE;

      this.cddData.pid = data[0].pid;
      this.cddData.firstName = data[0].firstName;
      this.cddData.lastName = data[0].lastName;
      this.cddData.dob = data[0].dob;
      this.cddData.nationality = data[0].nationality;

      this.cddData.PIDExpDate = data[0].PIDExpDate;
      this.cddData.mobile = data[0].mobile;
      this.cddData.email = data[0].email;
      this.cddData.typeBusiness = data[0].typeBusiness;
      this.cddData.typeBusiness_Oth = data[0].typeBusinessOth;
      this.cddData.occupation = data[0].occupation;
      this.cddData.occupation_Oth = data[0].occupationOth;
      this.cddData.position = data[0].position;
      this.cddData.position_Oth = data[0].positionOth;

      this.cddData.incomeLevel = data[0].incomeLevel;
      this.cddData.incomeSource = data[0].incomeSource;
      this.cddData.incomeSource_Oth = data[0].incomeSourceOth;
      this.cddData.workPlace = data[0].workPlace;
      this.cddData.MailSameAs = data[0].MailSameAs;
      this.cddData.ReqModifyFlag = false;

      this.cddData.maritalStatus = data[0].maritalStatus;
      this.cddData.SPpersonModel.cardType = data[0].spouseCardType;
      this.cddData.SPpersonModel.passportCountry = data[0].spousePassportCountry;
      this.cddData.SPpersonModel.cardNumber = data[0].spouseCardNumber;
      this.cddData.SPpersonModel.title = data[0].spouseTitle;
      this.cddData.SPpersonModel.titleOther = data[0].spouseTitleOther;
      this.cddData.SPpersonModel.firstName = data[0].spouseFirstName;
      this.cddData.SPpersonModel.lastName = data[0].spouseLastName;
      this.cddData.SPpersonModel.cardExpDate = data[0].spouseIDExpDate;
      this.cddData.SPpersonModel.cardNotExp = data[0].SpouseIDNotExp;

      this.cddData.moneyLaundaring = data[0].moneyLaundaring;
      this.cddData.politicalRelate = data[0].politicalRelate;
      this.cddData.rejectFinancial = data[0].rejectFinancial;
      this.cddData.taxDeduction = data[0].taxDeduction;
      this.cddData.cardNotExp = data[0].cardNotExp;
      this.cddData.numChildren = data[0].NumChildren;

      if(this.cddData.cardNotExp ==='Y'){
        this.cddData.PIDExpDate = '';
        this.cddData.cardNotExpBol=true;

        this.cddFormGroup.controls["PIDExpDate"].clearValidators();
        this.cddFormGroup.controls["PIDExpDate"].updateValueAndValidity();

      }

      // if(this.cddData.SPpersonModel.cardNotExp ==='Y'){
      //   this.cddData.SPpersonModel.cardExpDate = '';

      //   this.cddFormGroup.controls["spouseIDExpDate"].clearValidators();
      //   this.cddFormGroup.controls["spouseIDExpDate"].updateValueAndValidity();

      // }

      if(this.cddData.maritalStatus !=='Married'){
        this.cddData.SPpersonModel.cardExpDate = '';

      }


      if(this.cddData.SPpersonModel.cardNotExp ==='Y'){
        this.cddData.SPpersonModel.cardExpDate = '';

      }

      // this.reloadData();
      this.getChildren(_id);

      if(this.cddData.incomeSource){
        this.cddData.incomeSourceList = this.cddData.incomeSource.split(",");
      }

    }

  }, error => () => {
      console.log('Was error', error);
  }, () => {
    console.log('Loading complete');
  });
 }

 getChildren(_id){
  this.childService.getChildByCust(_id).subscribe(data => {

    if(data){
      for(let i in data){
        this.cddData.children.push(data[i]);
      }

      this.cddData.numChildren = String(this.cddData.children.length) ;

      if(this.cddData.children.length >=1 ){
        this.cddFormGroup.controls["numberChildren"].clearValidators();
        this.cddFormGroup.controls["numberChildren"].updateValueAndValidity();
      }
    }

    }, error => () => {
        console.log('Was error', error);
    }, () => {
      console.log('Loading complete');
    });
  }


  getCDDAddress(_id,seqNo : number){

    let _addrData: AddrCustModel = new AddrCustModel();
    this.cddService.getCustCDDAddr(_id, seqNo).subscribe(data => {

      _addrData.Addr_Seq = seqNo;
      if (data.length > 0){
        // _addrData.Addr_Seq = data[0].Addr_Seq;
        _addrData.Addr_No = data[0].Addr_No;
        _addrData.Moo = data[0].Moo;
        _addrData.Place = data[0].Place;
        _addrData.Floor = data[0].Floor;
        _addrData.Soi = data[0].Soi;
        _addrData.Road = data[0].Road;
        _addrData.Tambon_Id = data[0].Tambon_Id;
        _addrData.Amphur_Id = data[0].Amphur_Id;
        _addrData.Province_Id = data[0].Province_Id;
        _addrData.Country_Id = data[0].Country_Id;
        _addrData.Country_oth = data[0].Country_oth;

        _addrData.Zip_Code = data[0].Zip_Code;
        _addrData.Print_Address = data[0].Print_Address;
        _addrData.Tel = data[0].Tel;
        _addrData.Fax = data[0].Fax;
        _addrData.SameAs = data[0].SameAs;

        if (seqNo === 1){
          // console.log('Seting in RE ');
          this.re_addrData = Object.assign({}, _addrData);

          if (this.re_addrData.Country_Id === null)
            this.re_addrData.Country_Id=0;

          if(_addrData.Country_Id === 9 ){
            this.register_formGroup.controls["Country_oth"].setValidators(Validators.required);
            this.register_formGroup.controls["Country_oth"].updateValueAndValidity();
          }

        } else if (seqNo === 2 ) {
          this.cur_addrData = Object.assign({}, _addrData);
          // this.showCurrentAddr = true;

          if(_addrData.Country_Id === 9 ){
            this.current_formGroup.controls["Country_oth"].setValidators(Validators.required);
            this.current_formGroup.controls["Country_oth"].updateValueAndValidity();

            // console.log(' ** SET Validators CURR Address');
          }
        } else if (seqNo === 3){
          this.work_addrData = Object.assign({}, _addrData);
          // this.showWorkAddr = true;

          if(_addrData.Country_Id === 9 ){
            this.work_formGroup.controls["Country_oth"].setValidators(Validators.required);
            this.work_formGroup.controls["Country_oth"].updateValueAndValidity();

            // console.log(' ** SET Validators WORK Address');
          }
        } else if (seqNo === 4){
          this.mail_addrData = Object.assign({}, _addrData);

          if(_addrData.Country_Id === 9 ){
            this.mail_formGroup.controls["Country_oth"].setValidators(Validators.required);
            this.mail_formGroup.controls["Country_oth"].updateValueAndValidity();

          }

        }
      }
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      // console.log('Loading complete');
    });
   }


   public loadFATCA(_id: string) {
    this.spinnerLoading = true;
    this.suiteService.getFATCA(_id)
      .finally(() => {
        this.spinnerLoading = false;
      })
      .subscribe((data: any) => {
          if ( data.result.length > 0 ) {
            this.fatcaQuestions = JSON.parse(data.result[0].FATCA_DATA);
          }
        },
        error => () => {
          console.log("loadFATCA Was error", error);
        },
        () => {
          console.log("loadFATCA  complete");
        }
      );
  }



  public loadSuitByCust(_id: string) {

    console.log("START loadSuitByCust()");

    this.spinnerLoading = true;
    this.suiteService.getSuitByCust(_id)
      .finally(() => {
        this.spinnerLoading = false;
      })
      .subscribe((data: any) => {

        // console.log("SUIT>>" + JSON.stringify(result));
        // console.log("ANS>>" + JSON.stringify(data.result[0]));

          if ( data.result.length > 0 ) {
            this.suitQuestions = JSON.parse(data.result[0].Ans);
          }
        },
        error => () => {
          console.log("loadSuitByCust Was error", error);
        },
        () => {
          console.log("loadSuitByCust  complete");
        }
      );
  }

}
