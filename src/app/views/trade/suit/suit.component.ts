import { Component, OnInit } from "@angular/core";
import { SuitFormService } from "./suit.service";

import { ToastrService } from "ngx-toastr";
import { MatDialog, MatRadioChange } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { SuiteService } from "../services/suit.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { SurveyModel } from "../model/survey.model";
import { AuthService } from "../../services/auth.service";
import "rxjs/add/operator/finally";
import { Customer } from "../model/customer.model";
import { Question } from "../model/question.model";
import { CddService } from "../services/cdd.service";
import { AddrCustModel } from "../model/addrCust.model";
import { ConfirmationDialogService } from "../dialog/confirmation-dialog/confirmation-dialog.service";
import { CDDModel } from "../model/cdd.model";
import { forkJoin } from "rxjs";
// import { CDDModel } from "../model/cdd.model";


@Component({
  selector: "app-suit",
  templateUrl: "./suit.component.html",
  styleUrls: ["./suit.component.scss"],
  providers: [ConfirmationDialogService]
})
export class SuitComponent implements OnInit {

  riskData = [
    {id: 1, name: "เสี่ยงต่ำ"},
    {id: 2, name: "เสี่ยงปานกลางค่อนข้างต่ำ"},
    {id: 3, name: "เสี่ยงปานกลางค่อนข้างต่ำ"},
    {id: 4, name: "เสี่ยงสูง"},
    {id: 5, name: "เสี่ยงสูงมาก"}
  ];

  PREFIX_MOBILE_ALLOW_SEND_SMS ='02';
  SEQ_REG_ADDR = 1;
  SEQ_CURR_ADDR = 2;
  SEQ_WORK_ADDR = 3;
  SEQ_MAIL_ADDR = 4;

  form: FormGroup;

  cddFormGroup: FormGroup;
  suitFormGroup: FormGroup;
  FATCAGroup: FormGroup;
  register_formGroup: FormGroup;
  work_formGroup: FormGroup;
  current_formGroup: FormGroup;
  mail_formGroup: FormGroup;

  mobile = false;
  register_expanded = true;
  work_expanded = false;
  current_expanded = false;

  spinnerLoading = false;

  needVerify = false;
  verifyFLag = false;
  canDoSuit = true;
  canSaveSuit = false;
  canDoFATCA = false;
  showOtpEntry = false;
  addrModifyFlag = false;

  reg_addrModifyFlag = false;
  work_addrModifyFlag = false;
  cur_addrModifyFlag = false;

  suitModifyFlag = false;
  // showWorkAddr = false;
  // showCurrentAddr = false;
  // showMailAddr = false;

  onSuitCalculate = false;
  ADD_NEW = false;
  INTERNAL_USER = false;
  isEditable = true;
  saveAllComplete = false;

  suitScore = 0;
  riskLevel = 0;
  riskLevelTxt = "";
  riskLevelDesc = "";

  public customer: Customer = new Customer();

  public cddData = new CDDModel() ;
  public re_addrData: AddrCustModel = new AddrCustModel();
  public cur_addrData: AddrCustModel = new AddrCustModel();
  public work_addrData: AddrCustModel = new AddrCustModel();
  public mail_addrData: AddrCustModel = new AddrCustModel();

  // cust_mobile_disp;
  cust_RiskScore=0;
  cust_RiskLevel=0;
  cust_RiskLevelTxt='';
  cust_RiskTypeInvestor='';
  cust_RiskDate;
  verifyBy;
  verifyDOB_val;
  otpToken_Date;
  otpToken_Period;
  verifyOTP_val = "";

  public survey: SurveyModel = new SurveyModel();
  private token: string;
  suitQuestions: Array<Question>;
  fatcaQuestions: Array<Question>;
  resultMsg =[];

  constructor(
    public formService: SuitFormService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private suiteService: SuiteService,
    public authService: AuthService,
    private _formBuilder: FormBuilder,
    private cddService: CddService
  ) {

    if (
      this.authService.getUserId() != null &&
      this.authService.getDepCode() != null
    ) {
      this.ADD_NEW = true;
      this.INTERNAL_USER = true;
    }
  }

  ngOnInit() {

    if (window.screen.width < 700 ) { // 768px portrait
      this.mobile = true;
    }

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

    this.loadQuestions();
    this._buildForm();

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params["has"];

      // Set token in authentication environment
      this.authService.setUserExtlink(this.token);

      this.spinnerLoading = false;
    });
  }

  onLogout(){

    this.confirmationDialogService.confirm(this.formService.label_Confirm, this.formService.label_Confirm_logout)
    .then((confirmed) => {
      if ( confirmed ) {

        this.verifyFLag = false;
        this.customer = null;
        this.survey.pid = "";
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }


  private _buildForm() {
    // Initial Form fields
    this.form = new FormGroup({
      pid: new FormControl(null, {
        validators: [Validators.required]
      })
    });

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

    spouseCardType: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spouseCardNumber: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spousePassportCountry: new FormControl(null, {
      // validators: [Validators.required]
    }),
    spouseIDExpDate: new FormControl(null, {
      // validators: [Validators.required]
    }),
    SpouseIDNotExp: new FormControl(null, {
      // validators: [Validators.required]
    }),


    moneyLaundaring: new FormControl(null, {
      // validators: [Validators.required]
    }),
    politicalRelate: new FormControl(null, {
      // validators: [Validators.required]
    }),
    rejectFinancial: new FormControl(null, {
      // validators: [Validators.required]
    }),
    taxDeduction: new FormControl(null, {
      // validators: [Validators.required]
    }),

  });


  this.suitFormGroup = new FormGroup({
    cust_RiskLevel: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(1)]
    }),

  });


  this.FATCAGroup = new FormGroup({
    // cust_RiskLevel: new FormControl(null, {
    //   validators: [Validators.required, Validators.minLength(1)]
    // }),
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

  loadQuestions() {
    // tslint:disable-next-line:max-line-length
    this.suitQuestions = [
      this.formService.suit_q1,
      this.formService.suit_q2,
      this.formService.suit_q3,
      this.formService.suit_q4,
      this.formService.suit_q5,
      this.formService.suit_q6,
      this.formService.suit_q7,
      this.formService.suit_q8,
      this.formService.suit_q9,
      this.formService.suit_q10,
      this.formService.suit_s11,
      this.formService.suit_s12
    ];

    this.fatcaQuestions = [
      this.formService.fatca_q1,
      this.formService.fatca_q2,
      this.formService.fatca_q3,
      this.formService.fatca_q4,
      this.formService.fatca_q5,
      this.formService.fatca_q6,
      this.formService.fatca_q7,
      this.formService.fatca_q8,
      this.formService.fatca_q9
    ];
  }

  public getCustomerData() {
    // this.canDoSuit = false;
    // this.canDoFATCA = false;

    this.customer = new Customer();

    if (this.form.invalid) {
      console.log("form.invalid() " + this.form.invalid);

      this.toastr.error("Invalid require data", "warning", {
        timeOut: 5000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

      return false;
    }

    this.spinnerLoading = true;

    this.suiteService
      .verifyExtLink(this.survey.pid, this.token)
      .finally(() => {
        console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          console.log("getCustomerData :" + JSON.stringify(data));

          this.needVerify = true;
          this.verifyFLag = false;

          // this.customer.Title_Name_T = data.USERDATA.Title_Name_T;
          this.customer.First_Name_T = data.USERDATA.First_Name_T;
          this.customer.Last_Name_T = data.USERDATA.Last_Name_T;
          this.customer.First_Name_E = data.USERDATA.First_Name_E;
          this.customer.Last_Name_E = data.USERDATA.Last_Name_E;


          this.customer.Birth_Day = data.USERDATA.DOB;
          this.customer.Mobile = data.USERDATA.Mobile;

          this.cust_RiskScore = data.USERDATA.Suit_Score;
          this.cust_RiskLevel = data.USERDATA.Risk_Level;
          this.cust_RiskLevelTxt = data.USERDATA.Risk_Level_Txt;
          this.cust_RiskTypeInvestor = data.USERDATA.Type_Investor;
          this.cust_RiskDate = data.USERDATA.Risk_Date;

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          // console.log("Verify  complete");
        }
      );
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
      this.cddData.spouseCardType = data[0].spouseCardType;
      this.cddData.spousePassportCountry = data[0].spousePassportCountry;
      this.cddData.spouseCardNumber = data[0].spouseCardNumber;
      this.cddData.spouseTitle = data[0].spouseTitle;
      this.cddData.spouseTitleOther = data[0].spouseTitleOther;
      this.cddData.spouseFirstName = data[0].spouseFirstName;
      this.cddData.spouseLastName = data[0].spouseLastName;
      this.cddData.spouseIDExpDate = data[0].spouseIDExpDate;
      this.cddData.moneyLaundaring = data[0].moneyLaundaring;
      this.cddData.politicalRelate = data[0].politicalRelate;
      this.cddData.rejectFinancial = data[0].rejectFinancial;
      this.cddData.taxDeduction = data[0].taxDeduction;
      this.cddData.cardNotExp = data[0].cardNotExp;
      this.cddData.SpouseIDNotExp = data[0].SpouseIDNotExp;

      if(this.cddData.cardNotExp ==='Y'){
        this.cddData.PIDExpDate = '';

        this.cddFormGroup.controls["PIDExpDate"].clearValidators();
        this.cddFormGroup.controls["PIDExpDate"].updateValueAndValidity();

      }

      if(this.cddData.SpouseIDNotExp ==='Y'){
        this.cddData.spouseIDExpDate = '';

        // this.cddFormGroup.controls["PIDExpDate"].clearValidators();
        // this.cddFormGroup.controls["PIDExpDate"].updateValueAndValidity();

      }

      // this.reloadData();
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
        _addrData.Zip_Code = data[0].Zip_Code;
        _addrData.Print_Address = data[0].Print_Address;
        _addrData.Tel = data[0].Tel;
        _addrData.Fax = data[0].Fax;
        _addrData.SameAs = data[0].SameAs;

        if (seqNo === 1){
          // console.log('Seting in RE ');
          this.re_addrData = Object.assign({}, _addrData);

        } else if (seqNo === 2 ) {
          this.cur_addrData = Object.assign({}, _addrData);
          // this.showCurrentAddr = true;

        } else if (seqNo === 3){
          this.work_addrData = Object.assign({}, _addrData);
          // this.showWorkAddr = true;
        } else if (seqNo === 4){
          this.mail_addrData = Object.assign({}, _addrData);
        }
      }
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      // console.log('Loading complete');
    });
   }

  public requestOTP() {
    this.spinnerLoading = true;
    const _mobile = this.customer.Mobile;
    this.suiteService.verifyRequestOTP(this.survey.pid,_mobile)
      .finally(() => {
        console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          // console.log("HTTP return : verifyRequestOTP()" + JSON.stringify(data));

          this.showOtpEntry =true;
          this.otpToken_Date = data.TOKEN_DATE;
          this.otpToken_Period = data.TOKEN_PEROID;

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
  }

  public verifyConfirmOTP() {
    this.spinnerLoading = true;
    this.suiteService.verifyConfirmOTP(this.survey.pid,this.verifyOTP_val)
      .finally(() => {
        // console.log("Handle logging logic...");
        this.spinnerLoading = false;
      })
      .subscribe(
        (data: any) => {
          // console.log("HTTP return verifyConfirmOTP():" + JSON.stringify(data));

          // Load CDD
          this.getCDD(this.survey.pid);

          // Load address
          this.getCDDAddress(this.survey.pid, 1);
          this.getCDDAddress(this.survey.pid, 2);
          this.getCDDAddress(this.survey.pid, 3);

          // FATCA
          this.loadFATCA(this.survey.pid);

          this.verifyFLag = true;
          this.needVerify = false;


          this.toastr.success(` ${this.customer.First_Name_T} ${this.customer.Last_Name_T }`,
            "Welcome",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: "toast-top-center"
            }
          );

        },
        error => () => {
          console.log("Verify Was error", error);
        },
        () => {
          console.log("Verify  complete");
        }
      );
  }


  public verifyDOB() {

      if(this.customer.Birth_Day.replace(/[-]/g, "").toLowerCase() === this.verifyDOB_val){
        this.verifyFLag = true;
        this.needVerify = false;
        this.verifyDOB_val='';

        // Load CDD
          this.getCDD(this.survey.pid);

          // Load address
          this.getCDDAddress(this.survey.pid, this.SEQ_REG_ADDR);
          this.getCDDAddress(this.survey.pid, this.SEQ_CURR_ADDR);
          this.getCDDAddress(this.survey.pid, this.SEQ_WORK_ADDR);
          this.getCDDAddress(this.survey.pid, this.SEQ_MAIL_ADDR);

          // FATCA
          this.loadFATCA(this.survey.pid);

        this.toastr.success(` ${this.customer.First_Name_T} ${this.customer.Last_Name_T}`,
            "Welcome",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: "toast-top-center"
            }
          );
      } else {
        this.verifyDOB_val = '';
        this.toastr.warning(` Incorrect data. `,
              "Verify fail",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
      }
  }

  public searchCust() {
    this.canDoSuit = !this.canDoSuit;
  }

  onAddNew() {
    this.canDoSuit = false;
  }


  calSuit() {

    // console.log('ON calSuit !');
    this.suitScore = 0;

    if (this.form.invalid) {
      return false;
    }

    for (let i = 0; i < this.suitQuestions.length; i++) {
      // This for choose multi choices
      if (
        this.suitQuestions[i].multilchoice &&
        this.suitQuestions[i].calculate
      ) {
        // console.log(`multil `);
        let _score = 0;
        for (let y = 0; y < this.suitQuestions[i].choices.length; y++) {
          // console.log(`** check:  ${this.questions[i].choices[y].answer} `);
          if (this.suitQuestions[i].choices[y].answer) {
            // console.log(`** SCORE:  ${this.questions[i].choices[y].score} : ${_score}`);
            // Choose bigger score
            if (this.suitQuestions[i].choices[y].score > _score) {
              _score = this.suitQuestions[i].choices[y].score;
            }
          }
        }

        // console.log('*** Multi Score is >>' + _score);
        if (_score <= 0 && this.suitQuestions[i].require) {
          // console.log(' *** Suit not complete !!');

          this.toastr.warning(this.formService.SUIT_ANS_INCOMPLETE, "warning", {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          });

          return null;
        }
        this.suitScore += _score;
      } else if (this.suitQuestions[i].calculate) {
        // For single choose
        // console.log(`* ${this.suitQuestions[i].id} : ${this.suitQuestions[i].answer}`);

        if (!this.suitQuestions[i].answer && this.suitQuestions[i].require) {
          this.toastr.warning(this.formService.SUIT_ANS_INCOMPLETE, "warning", {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          });

          return null;
        } else {
          this.suitScore += Number(this.suitQuestions[i].answer);
        }
      }
    }

     console.log(`*** Suit score : ${this.suitScore}`);

    if (this.suitScore > 0) {
      this.riskEvaluate();
    }

    // console.log(JSON.stringify(this.questions));
  }

  riskEvaluate() {
    // this.canSaveSuit = false;
    // this.spinnerLoading = true;

    this.onSuitCalculate = true;
    this.canSaveSuit = false;

    this.suiteService
      .suitEvaluate(
        this.survey.pid,
        this.formService.suitSerieId,
        this.suitScore
      )
      .finally(() => {
        // Execute after graceful or exceptionally termination
        console.log("riskEvaluate logging logic...");
        // this.spinnerLoading = false;
        this.onSuitCalculate = false;
      })
      .subscribe((data: any) => {
          console.log(
            "HTTP return  evaluateRiskLevel :" + JSON.stringify(data)
          );

          if (data) {
            this.riskLevel = data.DATA.RiskLevel;
            this.riskLevelTxt = data.DATA.RiskLevelTxt;
            this.riskLevelDesc = data.DATA.Type_Investor;

            this.canSaveSuit = true;
            this.canDoSuit = false;
          }
        },
        error => () => {
          console.log("riskEvaluate Was error", error);
        },
        () => {
          console.log("riskEvaluate  complete");
        }
      );
  }


  suiteFormRESET() {
    console.log("Suite survey RESET !");

    this.suitScore = 0;
    this.riskLevel = 0;
    this.riskLevelTxt = "";
    this.riskLevelDesc = "";
    this.canSaveSuit = false;
  }

  public fatcaFormRESET(){
    console.log('*** FATCA RESET ');
  }


  verifyByChange(event: MatRadioChange) {
    // console.log( 'verifyByChange()>>' + event.value);
    this.verifyDOB_val = '';
    this.verifyOTP_val = '';
    this.showOtpEntry =false;
  }


  workAddrOnChange(val){
    if(val ==='1'){
      this.work_addrData = Object.assign({}, this.re_addrData);
      // this.showWorkAddr = false;
    }else { // Other
      this.work_addrData = new AddrCustModel();
      // this.showWorkAddr = true;
    }

    this.work_addrData.Addr_Seq = this.SEQ_WORK_ADDR;
    this.work_addrData.SameAs = val;

    // Check which components are in validation
    if (this.work_formGroup.invalid) {
      this.work_formGroup.enable();
      const controls = this.work_formGroup.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.work_formGroup.controls[name].markAsTouched();
          }
      }
    }
    // console.log('workAddrOnChange() >>' + JSON.stringify(this.work_addrData));

  }

  currAddrOnChange(val){
    if(val ==='1'){
      this.cur_addrData = Object.assign({}, this.re_addrData);
      // this.showCurrentAddr = false;
    } else if ( val === '3'){
      this.cur_addrData = Object.assign({}, this.work_addrData);
      // this.showCurrentAddr = false;
    } else { // Other
      this.cur_addrData = new AddrCustModel();
      // this.showCurrentAddr = true;
    }
    this.cur_addrData.SameAs = val;
    this.cur_addrData.Addr_Seq = this.SEQ_CURR_ADDR;

    // Check which components are in validation
    if (this.current_formGroup.invalid) {
      this.current_formGroup.enable();
      const controls = this.current_formGroup.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.current_formGroup.controls[name].markAsTouched();
          }
      }
    }

  }

  mailAddrOnChange(val){

    if(val === 'email'){
      // this.mail_addrData = Object.assign({}, this.re_addrData);

    } else if(val === 'reg'){
      this.mail_addrData = Object.assign({}, this.re_addrData);

    } else if ( val === 'work'){
      this.mail_addrData = Object.assign({}, this.work_addrData);

    } else if ( val === 'curr'){
      this.mail_addrData = Object.assign({}, this.cur_addrData);
    } else { // 9:Other
      this.mail_addrData = new AddrCustModel();
      // this.showCurrentAddr = true;
    }

    this.cddData.MailSameAs = val;
    this.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;

    if(val === 'email'){
      this.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;
      // Check which components are in validation
      if (this.mail_formGroup.invalid) {
        this.mail_formGroup.enable();
        const controls = this.mail_formGroup.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                this.mail_formGroup.controls[name].markAsTouched();
            }
        }
      }
    }

  }

  public loadFATCA(_id: string) {
    this.spinnerLoading = true;
    this.suiteService.getFATCA(_id)
      .finally(() => {
        // console.log("Handle logging logic...");
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



  evaluateSuitOK(){
    this.cust_RiskLevel = this.riskLevel;
    this.cust_RiskLevelTxt = this.riskLevelTxt;
    this.cust_RiskTypeInvestor = this.riskLevelDesc;
    this.cust_RiskDate =  new Date();

    this.canDoSuit = false;
    this.canSaveSuit = false;
    this.suitModifyFlag = true;

  }

  saveSuit() {

    this.cust_RiskLevel = this.riskLevel;
    this.cust_RiskLevelTxt = this.riskLevelTxt;
    this.cust_RiskTypeInvestor = this.riskLevelDesc;

    this.cust_RiskDate =  new Date();

      this.suiteService
        .saveSuitabilityByPID(
          this.survey.pid,
          this.survey.pid,
          this.formService.suitSerieId,
          this.suitScore,
          this.riskLevel,
          this.riskLevelTxt,
          this.riskLevelDesc,
          this.suitQuestions
        )
        .finally(() => {
          // Execute after graceful or exceptionally termination
          this.canDoSuit =false;
          this.spinnerLoading = false;
        })
        .subscribe(
          (data: any) => {
            // console.log("HTTP return  saveSuit :" + JSON.stringify(data));

            if (data.code === "000") {
              this.toastr.success(data.msg, this.formService.SUIT_SAVE_COMPLETE, {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              });
            } else {
              this.toastr.warning(
                data.msg,
                this.formService.SUIT_SAVE_INCOMPLETE,
                {
                  timeOut: 5000,
                  closeButton: true,
                  positionClass: "toast-top-center"
                }
              );
            }

          },
          error => () => {
            console.log("saveSuit Was error", error);
          },
          () => {
            console.log("saveSuit  complete");
          }
        );
    }

    modifOnChange(val){
      if(val){
        // this.addrFormGroup.enable();
        this.register_formGroup.enable();
        this.work_formGroup.enable();
        this.current_formGroup.enable();
       }else{
        // this.addrFormGroup.disable();
        this.register_formGroup.disable();
        this.work_formGroup.disable();
        this.current_formGroup.disable();

       }
   }

   modifRegAddr(){
    this.reg_addrModifyFlag = !this.reg_addrModifyFlag;
    if(this.reg_addrModifyFlag){
      this.register_formGroup.enable();
     }else{
      this.register_formGroup.disable();
     }
 }

  modifWorkAddr(){
    this.work_addrModifyFlag = !this.work_addrModifyFlag;
    if(this.work_addrModifyFlag){
      this.work_formGroup.enable();
    }else{
      this.work_formGroup.disable();
    }
  }

  modifCurrentAddr(){
    this.cur_addrModifyFlag = !this.cur_addrModifyFlag
    if(this.cur_addrModifyFlag){
      this.current_formGroup.enable();
     }else{
      this.current_formGroup.disable();
     }
 }

   cDDmodifOnChange(){

    this.cddData.ReqModifyFlag = !this.cddData.ReqModifyFlag;

    if(this.cddData.ReqModifyFlag){
      this.cddFormGroup.enable();
     }else{
      this.cddFormGroup.disable();
     }
 }

 fatcaOnChange(){

  if(this.cddFormGroup.disabled){
    this.cddFormGroup.enable();
   }else{
    this.cddFormGroup.disable();
   }
}


    checkCDD_FormInvalid(_Form:FormGroup){

      if(_Form.invalid){

        // let msg = '<ul>';
        // const invalid = [];
        // const controls = _Form.controls;
        // for (const name in controls) {
        //     if (controls[name].invalid) {
        //         invalid.push(name);
        //         msg += `<li> ${controls[name]} </li>`;
        //     }
        // }
        // msg += '</ul>';

        // if ( invalid.length > 0 ){
        //   this.toastr.warning(
        //     this.formService.DATA_INCOMPLETE_MSG + msg,
        //     this.formService.DATA_INCOMPLETE,
        //     {
        //       timeOut: 5000,
        //       closeButton: true,
        //       positionClass: "toast-top-center"
        //     }
        //   );
        // }

        this.toastr.warning(
              this.formService.DATA_INCOMPLETE_MSG,
              this.formService.DATA_INCOMPLETE,
              {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );

      }
     }


     fatch_FormInvalid(_Form:FormGroup){}

     checkSuit_FormInvalid(_Form:FormGroup){

      let alertMSG = "";

      if(!this.cust_RiskDate  ){
        alertMSG = this.formService.NO_SUIT_MSG; // `No suitability data. Please do suitability survey.`;
      } else {

          let _riskDate =  new Date(this.cust_RiskDate);
          let diff = Math.abs(new Date().getTime() - _riskDate.getTime());
          let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

          console.log("diffDays="+diffDays);

          if(diffDays > this.formService.SUIT_EXP_DAY){
                alertMSG = this.formService.EXP_SUIT_MSG;//`Suitability evaluate data near expired(2 year.). Please do suitability survey.`;
          }
      }

      if(alertMSG.length>0){

        // this.cddFormGroup.controls["titleOth"].setValidators(Validators.required);
        this.suitFormGroup.controls["cust_RiskLevel"].setValue(null);
        this.suitFormGroup.controls["cust_RiskLevel"].updateValueAndValidity();

        this.toastr.warning(
          alertMSG ,
          this.formService.DATA_INCOMPLETE,
          {
            timeOut: 5000,
            closeButton: true,
            positionClass: "toast-top-center"
          }
        );
      }


      // this.suitFormGroup.controls["titleOth"].setValidators(Validators.required);
      // this.suitFormGroup.controls["titleOth"].updateValueAndValidity();

      // if(_Form.invalid){
      //   const invalid = [];
      //   const controls = _Form.controls;
      //   for (const name in controls) {
      //       if (controls[name].invalid) {
      //           invalid.push(name);
      //       }
      //   }
      //   if ( invalid.length > 0 ){

      //     this.toastr.warning(
      //       this.formService.DO_SUIT_MSG,
      //       this.formService.DATA_INCOMPLETE,
      //       {
      //         timeOut: 5000,
      //         closeButton: true,
      //         positionClass: "toast-top-center"
      //       }
      //     );

      //   }
      // }
     }


     saveAddrAll(){

      this.re_addrData.ReqModifyFlag = this.addrModifyFlag;
      this.work_addrData.ReqModifyFlag = this.addrModifyFlag;
      this.cur_addrData.ReqModifyFlag = this.addrModifyFlag;

      this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.re_addrData)
      .subscribe((data: any ) => {
       console.log('Successful', JSON.stringify(data));

     }, error => () => {
         console.log('Was error', error);
     }, () => {
        console.log('Finish Addr register #1');
    // **************************
        this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.work_addrData)
        .subscribe((data: any ) => {
         console.log('Successful', JSON.stringify(data));

       }, error => () => {
           console.log('Was error', error);
       }, () => {
          console.log('Finish Addr register #2');
          // **************************
                this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.cur_addrData)
                .subscribe((data: any ) => {
                console.log('Successful', JSON.stringify(data));
                if (data.code === "000") {
                  this.toastr.success(data.msg, this.formService.SAVE_COMPLETE, {
                    timeOut: 5000,
                    closeButton: true,
                    positionClass: "toast-top-center"
                  });
                } else {
                  this.toastr.warning(
                    data.msg,
                    this.formService.SAVE_INCOMPLETE,
                    {
                      timeOut: 5000,
                      closeButton: true,
                      positionClass: "toast-top-center"
                    }
                  );
                }

                }, error => () => {
                  console.log('Was error', error);
                }, () => {
                  console.log('Finish Addr register #3');
                // **************************

                // **************************
                });
          // **************************

       });
    // **************************
     });
    }

  finalSaveAll(){
    // Save CDD
    // Save FATCA
    // Save register Address
    // Save work Address
    // Save current Address
    // Save Suit

    this.re_addrData.ReqModifyFlag = this.addrModifyFlag;
    this.work_addrData.ReqModifyFlag = this.addrModifyFlag;
    this.cur_addrData.ReqModifyFlag = this.addrModifyFlag;

    const observables = [];

    // if(this.cddData.ReqModifyFlag){
    //   observables.push(this.cddService.saveCustCDDInfo(this.survey.pid,this.survey.pid,this.cddData));
    //   observables.push(this.suiteService.saveFATCA(this.survey.pid,this.survey.pid,this.fatcaQuestions));
    // }

    // if(this.addrModifyFlag){
    //   observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.re_addrData));
    //   observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.work_addrData));
    //   observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.cur_addrData));
    // }

    // CDD
    observables.push(this.cddService.saveCustCDDInfo(this.survey.pid,this.survey.pid,this.cddData));
    observables.push(this.suiteService.saveFATCA(this.survey.pid,this.survey.pid,this.fatcaQuestions));


    // Check Work Address selected
    let sameAs = this.work_addrData.SameAs;
      if(sameAs ===  this.SEQ_REG_ADDR.toString() ){
        this.work_addrData = Object.assign({}, this.re_addrData);

      }
      this.work_addrData.SameAs = sameAs;
      this.work_addrData.Addr_Seq = this.SEQ_WORK_ADDR;

    // Check Current Address selected
    sameAs = this.cur_addrData.SameAs;
      if(sameAs ===  this.SEQ_REG_ADDR.toString() ){
        this.cur_addrData = Object.assign({}, this.re_addrData);

      }else if(sameAs ===  this.SEQ_WORK_ADDR.toString() ){
        this.cur_addrData = Object.assign({}, this.work_addrData);

      }
      this.cur_addrData.SameAs = sameAs;
      this.cur_addrData.Addr_Seq = this.SEQ_CURR_ADDR;

    // Check Mail Address selected
    sameAs = this.mail_addrData.SameAs;
      if(sameAs ===  this.SEQ_REG_ADDR.toString() ){
        this.mail_addrData = Object.assign({}, this.re_addrData);
      }else if(sameAs ===  this.SEQ_WORK_ADDR.toString() ){
        this.mail_addrData = Object.assign({}, this.work_addrData);
      }else if(sameAs ===  this.SEQ_CURR_ADDR.toString() ){
        this.mail_addrData = Object.assign({}, this.work_addrData);
      }
      this.mail_addrData.SameAs = sameAs;
      this.mail_addrData.Addr_Seq = this.SEQ_MAIL_ADDR;

    // Address
    observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.re_addrData));
    observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.work_addrData));
    observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.cur_addrData));

    if(this.cddData.MailSameAs !== 'email'){
      observables.push(this.cddService.saveCustCDDAddr(this.survey.pid,this.survey.pid,this.mail_addrData));
    }

    if(this.suitModifyFlag){
      observables.push(this.suiteService.saveSuitabilityByPID(
        this.survey.pid, this.survey.pid,
        this.formService.suitSerieId,
        this.suitScore,
        this.riskLevel,
        this.riskLevelTxt,
        this.riskLevelDesc,
        this.suitQuestions
        )
      );
    }


    if(observables.length > 0){

      const example = forkJoin(observables);
      const subscribe = example.subscribe(result => {
          // console.log(result)
         this.saveAllComplete = true;

          for(let i in result){
            let obj = result[i];
            // #1
            if(obj.module === 'saveCDDInfo'  ){
              if(obj.code === '000'){
                this.resultMsg.push('Save perional information : Complete');
              }else{
                this.resultMsg.push('Save perional information : Inomplete');
              }
            }

            // #2
            if(obj.module === 'saveFATCA'  ){
              if(obj.code === '000'){
                this.resultMsg.push('Save FATCA : Complete');
              }else{
                this.resultMsg.push('Save FATCA : Inomplete');
              }
            }

             // #3
             if(obj.module === 'suitSave'  ){
              if(obj.code === '000'){
                this.resultMsg.push('Save suitability : Complete');
              }else{
                this.resultMsg.push('Save suitability : Inomplete');
              }
            }

            // #4-1
            if(obj.module === 'saveCDDAddr'  ){
              if(obj.code === '000'){
                this.resultMsg.push(`Save address : Complete`);
              }else{
                this.resultMsg.push(`Save address : Incomplete`);
              }
            }
          }

          // Send mail to who relate(Owner & RM)

          // this.suiteService.mailThankCust(this.survey.pid)
          this.suiteService.mailThankCust(this.survey.pid)
          .finally(() => {
            // Execute after graceful or exceptionally termination
          })
          .subscribe((data: any) => {
              console.log("Send maill finalSaveAll:" + JSON.stringify(data));

            },
            error => () => {
              console.log("Send maill finalSaveAll was error", error);
            },
            () => {
              // console.log("saveFATCA  complete");
            }
          );


          this.toastr.info(`Survey complete please see result below.`,
            this.formService.SAVE_INFO,
            {
              timeOut: 8000,
              closeButton: true,
              positionClass: "toast-top-center"
            }
          );

          this.cddData.ReqModifyFlag = false;
          this.addrModifyFlag = false;
          this.suitModifyFlag = false;

        });
    }
  }


}
