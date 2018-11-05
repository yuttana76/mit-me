import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientType } from '../model/ref_clientType.model';
import { BeforeTitle } from '../model/ref_before_title.model';
import { MasterDataService } from '../services/masterData.service';
import { PIDTypes } from '../model/ref_PIDTypes.model';
import { MatRadioChange, MatSelectChange, MatDialogRef, MatDialog } from '@angular/material';
import { Country } from '../model/ref_country';
import { Provinces } from '../model/ref_provinces.model';
import { Amphurs } from '../model/ref_amphurs.model';
import { Tambons } from '../model/ref_tambons.model';
import { Nation } from '../model/ref_nation.model';
import { Customer } from '../model/customer.model';
import { CustAddress } from '../model/custAddress.model';
import { DatePipe, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SaleDialogComponent } from '../dialog/sale-dialog/sale-dialog.component';
import { AccountAddress } from '../model/accountAddress.model';
import { WipCustomerService } from '../services/wipCustomer.service';
import { ResultDialogComponent } from '../dialog/result-dialog/result-dialog.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AddressService } from '../services/address.service';
import { WorkFlowService } from '../services/workFlow.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customerDetail.component.html',
  styleUrls: ['./customerDetail.component.scss']
})
// @CrossOrigin(origins = {"http://localhost:4200"})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  CLIENT_TYPE_PERSION = '1';
  TRADE_FORMAT_DATE = 'yyyy-MM-dd';
  MODE_CREATE = 'create';
  MODE_EDIT = 'edit';

  formScreen = 'N';
  form: FormGroup;
  spinnerLoading = false;
  saveCustomerComplete = false;
  isDisableFields = false;

  private mode = this.MODE_CREATE;
  private custCode: string;

  clientTypeList: ClientType[] = [];

  PIDTypeMasList: PIDTypes[] = [];
  PIDTypeList: PIDTypes[];

  thaiTitleList: BeforeTitle[];
  engTitlesList: BeforeTitle[];

  nationList: Nation[];

  countryMasList: Country[];
  ce_countryList: Country[] ;
  ma_countryList: Country[] ; // Contact
  of_countryList: Country[] ;

  provinceMasList: Provinces[];
  ce_provinceList: Provinces[] ;
  ma_provinceList: Provinces[] ;
  of_provinceList: Provinces[] ;

  amphursMasList: Amphurs[];
  ce_amphursList: Amphurs[] ;
  ma_amphursList: Amphurs[] ;
  of_amphursList: Amphurs[] ;

  tambonsMasList: Tambons[];
  ce_tambonsList: Tambons[] ;
  ma_tambonsList: Tambons[] ;
  of_tambonsList: Tambons[] ;

  // Customer fields
  customer: Customer = new Customer();
  ceAddress: CustAddress = new CustAddress();  // Register address
  maAddress: CustAddress = new CustAddress();  // Mail & Contact address
  ofAddress: CustAddress = new CustAddress();  // Office address

// Dialog
  saleDialogRef: MatDialogRef<SaleDialogComponent>;

  constructor( private datePipe: DatePipe,
    private customerService: CustomerService ,
    private addressService: AddressService ,
    private masterDataService: MasterDataService ,
    private wipCustomerService: WipCustomerService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private workFlowService: WorkFlowService,
    private location: Location) { }

  ngOnInit() {
    this.spinnerLoading = true;
    // this.customer.Card_Type = this.CLIENT_TYPE_PERSION;
    this.customer.Group_Code = this.CLIENT_TYPE_PERSION;
    this.customer.Nation_Code = '000';

    // Initial Form fields
    this.form = new FormGroup({
      groupCode: new FormControl(null, {
        validators: [Validators.required]
      }),
      custType: new FormControl(null, {
        validators: [Validators.required]
      }),
      custId: new FormControl(null, {
        validators: [Validators.required]
      }),
      bf_title_th: new FormControl(null, {
        validators: [Validators.required]
      }),
      firstName_th: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName_th: new FormControl(null, {
        validators: [Validators.required]
      }),
      bf_title_en: new FormControl(null, {
        validators: [Validators.required]
      }),
      firstName_en: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName_en: new FormControl(null, {
        validators: [Validators.required]
      }),

      nationality: new FormControl(null, {
        validators: [Validators.required]
      }),
      sex: new FormControl(null, {
        validators: [Validators.required]
      }),
      dobDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      Card_IssueDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      Card_ExpDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      mobile: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      MktId: new FormControl(null, {
        validators: [Validators.required]
      }),
      // Census Address
      ce_addr_No: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_place: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_road: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_country: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_province: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_amphure: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_tambon: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_zip_Code: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_tel: new FormControl(null, null),
      ce_fax: new FormControl(null, null),

      // Mail Address
      ma_addr_No: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_place: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_road: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_country: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_province: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_amphur: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_tambon: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_zip_Code: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_tel: new FormControl(null, null),
      ma_fax: new FormControl(null, null),

      // Office Address
      of_addr_No: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_place: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_road: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_country: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_province: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_amphur: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_tambon: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_zip_Code: new FormControl(null, {
        validators: [Validators.required]
      }),
      of_tel: new FormControl(null, null),
      of_fax: new FormControl(null, null),

    });

    // Initial Master data
    this.masterDataService.getClientTypes().subscribe((data: any[]) => {
      this.clientTypeList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
       console.log('Loading complete');

    });

    this.masterDataService.getPIDTypes().subscribe((data: any[]) => {
      this.PIDTypeMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      //  this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, this.customer.Card_Type);
       this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, this.customer.Group_Code);
    });

    this.masterDataService.getThaiTitleList().subscribe((data: any[]) => {
      this.thaiTitleList = data;
    });

    this.masterDataService.getEngTitleList().subscribe((data: any[]) => {
      this.engTitlesList = data;
    });

    this.masterDataService.getNations().subscribe((data: any[]) => {
      this.nationList = data;
    });

    this.masterDataService.getCountry().subscribe((data: any[]) => {
      this.countryMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_countryList = this.getCountryByNation( this.countryMasList, this.customer.Nation_Code);
      this.ma_countryList = this.getCountryByNation( this.countryMasList, this.customer.Nation_Code);
      this.of_countryList = this.getCountryByNation( this.countryMasList, this.customer.Nation_Code);
    });

    this.masterDataService.getProvince().subscribe((data: any[]) => {
      this.provinceMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ceAddress.Country_Id);
      this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList, this.maAddress.Country_Id);
      this.of_provinceList = this.getProvinceByCountry( this.provinceMasList, this.maAddress.Country_Id);
    });

    this.masterDataService.getAmphurs().subscribe((data: any[]) => {
      this.amphursMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_amphursList = this.getAmphursByProvince( this.amphursMasList, this.ceAddress.Province_Id);
      this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, this.maAddress.Province_Id);
      this.of_amphursList = this.getAmphursByProvince( this.amphursMasList, this.maAddress.Province_Id);
    });

    this.masterDataService.getTambons().subscribe((data: any[]) => {
      this.tambonsMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.ceAddress.Amphur_Id);
      this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.maAddress.Amphur_Id);
      this.of_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.maAddress.Amphur_Id);
    });

    this.spinnerLoading = false;
  }

  // tslint:disable-next-line:use-life-cycle-interface
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


        // console.log('Edit Mode. >>', this.custCode );
        this.masterDataService.getCountry().subscribe((data: any[]) => {
          this.countryMasList = data;
        }, error => () => {
            console.log('Was error', error);
        }, () => {
          this.ce_countryList = this.getCountryByNation( this.countryMasList, this.customer.Nation_Code);
          this.ma_countryList = this.getCountryByNation( this.countryMasList, this.customer.Nation_Code);
          this.of_countryList = this.getCountryByNation( this.countryMasList, this.customer.Nation_Code);
        });

        if (this.formScreen === 'WORKFLOW_SCR' ) {
          /*
          Load from Work Flow page.
           */

          // Disable all controls
          this.isDisableFields = true;
          const controlLiss = new Array('groupCode', 'bf_title_th', 'firstName_th', 'lastName_th', 'bf_title_en',
          'firstName_en', 'lastName_en', 'nationality',
          'sex', 'dobDate', 'custType', 'custId', 'Card_IssueDate', 'Card_ExpDate', 'mobile', 'email', 'MktId',
          'ce_addr_No', 'ce_place', 'ce_road', 'ce_country', 'ce_province', 'ce_amphure', 'ce_tambon', 'ce_zip_Code', 'ce_tel', 'ce_fax',
          'of_addr_No',
           'of_place', 'of_road', 'of_country', 'of_province', 'of_amphur', 'of_tambon', 'of_zip_Code', 'of_tel', 'of_fax',
          'ma_addr_No', 'ma_place', 'ma_road', 'ma_country', 'ma_province', 'ma_amphur', 'ma_tambon', 'ma_zip_Code', 'ma_tel', 'ma_fax'
          );
          for (let i = 0; i < controlLiss.length; i++) {
            this.form.controls[ controlLiss[i]].disable();
          }

          // Load customer(Account) WIP info.(START)
          // wipCustomerService
          this.wipCustomerService.getWipCustomer(this.custCode).subscribe(custData => {
            this.spinnerLoading = false;
            this.customer = {
              Cust_Code: custData[0].Cust_Code,
              Card_Type: custData[0].Card_Type,
              Card_IssueDate: custData[0].Birth_Day, // custData.Card_IssueDate,
              Card_ExpDate: custData[0].Card_ExpDate,
              Group_Code: custData[0].Group_Code,
              Title_Name_T: custData[0].Title_Name_T,
              First_Name_T: custData[0].First_Name_T,
              Last_Name_T: custData[0].Last_Name_T,
              Title_Name_E: custData[0].Title_Name_E,
              First_Name_E: custData[0].First_Name_E,
              Last_Name_E: custData[0].Last_Name_E,
              Birth_Day: custData[0].Birth_Day,
              Nation_Code: custData[0].Nation_Code,
              Sex: custData[0].Sex,
              Tax_No: custData[0].Tax_No,
              Mobile: custData[0].Mobile,
              Email: custData[0].Email,
              MktId: custData[0].MktId,
              Create_By: custData[0].Create_By,
              Create_Date: custData[0].Create_Date,
              Modify_By: custData[0].Modify_By,
              Modify_Date: custData[0].Modify_Date,
              IT_SentRepByEmail: custData[0].IT_SentRepByEmail,
            };
            this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, this.customer.Group_Code);
          });
          // Load customer(Account) WIP info.(END)

          // Loading Wip Addresses(START)
          this.wipCustomerService.getWipAddress(this.custCode).subscribe(addrData => {

            // console.log('Wip Addr>>',JSON.stringify(addrData));

            // CE ADDRESS
            const ceAddr = addrData.filter(function (i, n) {
                      return i.Addr_Seq === 1;
                  })[0];
            if (ceAddr) {
              this.ceAddress = ceAddr;
              this.ce_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ceAddress.Country_Id);
            }

            // Mail Address
              const maAddr = addrData.filter(function (i, n) {
              return i.Addr_Seq === 2;
                  })[0];
              if (maAddr) {
                this.maAddress = maAddr;
                this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList, this.maAddress.Country_Id);
              }

            // // Office Address
            const offAddr =  addrData.filter(function (i, n) {
              return i.Addr_Seq === 3;
                  })[0];
            if ( offAddr) {
              this.ofAddress = offAddr;
              this.of_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ofAddress.Country_Id);
            }
        });
        // Loading Wip Addresses(END)

        } else {
            // Load customer(Account) info. (START)
            this.customerService.getCustomer(this.custCode).subscribe(custData => {
              this.spinnerLoading = false;
              this.customer = {
                Cust_Code: custData[0].Cust_Code,
                Card_Type: custData[0].Card_Type,
                Card_IssueDate: custData[0].Birth_Day, // custData.Card_IssueDate,
                Card_ExpDate: custData[0].Card_ExpDate,
                Group_Code: custData[0].Group_Code,
                Title_Name_T: custData[0].Title_Name_T,
                First_Name_T: custData[0].First_Name_T,
                Last_Name_T: custData[0].Last_Name_T,
                Title_Name_E: custData[0].Title_Name_E,
                First_Name_E: custData[0].First_Name_E,
                Last_Name_E: custData[0].Last_Name_E,
                Birth_Day: custData[0].Birth_Day,
                Nation_Code: custData[0].Nation_Code,
                Sex: custData[0].Sex,
                Tax_No: custData[0].Tax_No,
                Mobile: custData[0].Mobile,
                Email: custData[0].Email,
                MktId: custData[0].MktId,
                Create_By: custData[0].Create_By,
                Create_Date: custData[0].Create_Date,
                Modify_By: custData[0].Modify_By,
                Modify_Date: custData[0].Modify_Date,
                IT_SentRepByEmail: custData[0].IT_SentRepByEmail,
              };
              this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, this.customer.Group_Code);
            });
            // Load customer(Account) info. (END)

            // Loading Addresses(START)
            this.addressService.getAddress(this.custCode).subscribe(addrData => {

                // CE ADDRESS
                const ceAddr = addrData.filter(function (i, n) {
                          return i.Addr_Seq === 1;
                      })[0];
                if (ceAddr) {
                  this.ceAddress = ceAddr;
                  this.ce_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ceAddress.Country_Id);
                }

                // Mail Address
                  const maAddr = addrData.filter(function (i, n) {
                  return i.Addr_Seq === 2;
                      })[0];
                  if (maAddr) {
                    this.maAddress = maAddr;
                    this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList, this.maAddress.Country_Id);
                  }

                // // Office Address
                const offAddr =  addrData.filter(function (i, n) {
                  return i.Addr_Seq === 3;
                      })[0];
                if ( offAddr) {
                  this.ofAddress = offAddr;
                  this.of_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ofAddress.Country_Id);
                }
            });
            // Loading Addresses(END)
        }


      } else {
        this.mode = this.MODE_CREATE;
        this.custCode = null;
        this.spinnerLoading = false;
      }
    });

  }

  ngOnDestroy() {
    console.log('On destroy !');

  }

  getPIDTypeListByClientType(PIDTypeMasList: PIDTypes[], code: string) {
    if (PIDTypeMasList === null) {
      return null;
    }
    const filtered: any[] = PIDTypeMasList.filter(element => element.TypeHolder === code);
    return filtered;
  }

  getCountryByNation(countryList: Country[], code: string) {
    if (countryList === null || code === null) {
      return null;
    }
    const filtered: any[] = countryList.filter(element => element.Nation === code);
    return filtered;
  }

  getProvinceByCountry(provinceList: Provinces[], code: string) {
    if (provinceList === null) {
      return null;
    }
    const filtered: any[] = provinceList.filter(element => element.Country_ID === code);
    return filtered;
  }

  getAmphursByProvince(amphursList: Amphurs[], code: string) {
    if (amphursList === null) {
      return null;
    }
    const filtered: any[] = amphursList.filter(element => element.Province_ID === code);
    return filtered;
  }

  getTambonsByAmphur(tambonsList: Tambons[], code: string) {
    if (tambonsList === null) {
      return null;
    }
    const filtered: any[] = tambonsList.filter(element => element.Amphur_ID === code);
    return filtered;
  }

  onSubmit() {
    // console.log('ON SUBMIT !');

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    // CONVERT VALUES
    if ( this.customer.Birth_Day) {
      const d = new Date(this.customer.Birth_Day);
      this.customer.Birth_Day = this.datePipe.transform(d, this.TRADE_FORMAT_DATE);
    }
    this.customer.Create_By = this.authService.getUserData() || 'NONE';

    this.ceAddress.Cust_Code = this.customer.Cust_Code;
    this.ceAddress.Addr_Seq = '1';

    this.ofAddress.Cust_Code = this.customer.Cust_Code;
    this.ofAddress.Addr_Seq = '3';

    this.maAddress.Cust_Code = this.customer.Cust_Code;
    this.maAddress.Addr_Seq = '2';

    //   console.log('AFTER SAVE', JSON.stringify(data));
    this.wipCustomerService.createCustomer(this.customer, this.ceAddress, this.ofAddress, this.maAddress, this.mode)
    .subscribe((data: any ) => {

      if ( data.result && data.result.wfRef !== 'undefined') {

        // SEND MAIL TO APPROVER
        this.workFlowService.getCurrentLevel(data.result.wfRef).subscribe(levelData => {
          this.workFlowService.mail2Next(this.customer.Cust_Code, levelData);

        });

        this.openDialog('success', 'Create customer was successful.', 'The refference number is ' +  data.result.wfRef);
        this.saveCustomerComplete = true;


      } else {
        this.openDialog('danger', 'Create customer was error',  data.message.originalError.info.message + '!  Please contact IT staff.' );
      }

    }, error => () => {
        console.log('Was error', error);
    }, () => {
       console.log('Loading complete');
    });
  }


  openDialog(alertTypeStr: string, alertHeaderStr: string, alertMsgStr: string): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      width: '450px',
      // tslint:disable-next-line:max-line-length
      data: {alertType: alertTypeStr , alertHeader: alertHeaderStr , alertMsg: alertMsgStr}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
      if (this.saveCustomerComplete) {
        this.router.navigate(['/']);
      }

    });
  }

  clientTypeChange(event: MatRadioChange) {
    this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, event.value);
  }

nationChange(event: MatSelectChange) {
  this.ce_countryList = this.getCountryByNation( this.countryMasList, event.value);
  this.ma_countryList = this.getCountryByNation( this.countryMasList, event.value);
}


ceCountryChange(event: MatSelectChange) {
  this.ce_provinceList = this.getProvinceByCountry( this.provinceMasList,  event.value);
}

ceProvinceChange(event: MatSelectChange) {
  this.ce_amphursList = this.getAmphursByProvince( this.amphursMasList, event.value);
}
ceAmphurChange(event: MatSelectChange) {

  this.ce_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, event.value);

}
ceTambonChange(event: MatSelectChange) {
  // console.log('ceTambonChange>>', event.value);
}


ofCountryChange(event: MatSelectChange) {
  this.of_provinceList = this.getProvinceByCountry( this.provinceMasList,  event.value);
}

ofProvinceChange(event: MatSelectChange) {
  this.of_amphursList = this.getAmphursByProvince( this.amphursMasList, event.value);
}
ofAmphurChange(event: MatSelectChange) {

  this.of_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, event.value);

}
ofTambonChange(event: MatSelectChange) {
  // console.log('maTambonChange>>', event.value);
}

maCountryChange(event: MatSelectChange) {
  this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList,  event.value);
}

maProvinceChange(event: MatSelectChange) {
  this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, event.value);
}
maAmphurChange(event: MatSelectChange) {

  this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, event.value);

}
maTambonChange(event: MatSelectChange) {
  // console.log('maTambonChange>>', event.value);
}


openSaleDialog() {
  this.saleDialogRef = this.dialog.open(SaleDialogComponent, {
    width: '600px',
    data: 'This text is passed into the dialog!'
  });

  this.saleDialogRef.afterClosed().subscribe(result => {
    if ( result && result !== 'close' ) {
      const saleObj = result;
      this.customer.MktId = saleObj.Id;
    }
  });
}

// ceAddress: CustAddress = new CustAddress();  // Register address
// maAddress: CustAddress = new CustAddress();  // Mail & Contact address
// ofAddress: CustAddress = new CustAddress();  // Office address

ofSameAsRegister() {
  this.ofAddress = this.copyAddr(this.ceAddress);

  this.of_provinceList = this.getProvinceByCountry( this.provinceMasList,  this.ofAddress.Country_Id);
  this.of_amphursList = this.getAmphursByProvince( this.amphursMasList, this.ofAddress.Province_Id);
  this.of_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.ofAddress.Amphur_Id);
}

maSameAsRegister() {
  this.maAddress = this.copyAddr(this.ceAddress);

  this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList,  this.maAddress.Country_Id);
  this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, this.maAddress.Province_Id);
  this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.maAddress.Amphur_Id);

}

maSameAsOffice() {

  this.maAddress = this.copyAddr(this.ofAddress);

  this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList,  this.maAddress.Country_Id);
  this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, this.maAddress.Province_Id);
  this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.maAddress.Amphur_Id);

}

copyAddr (A_Addr: AccountAddress  ): AccountAddress {
  // console.log(JSON.stringify(A_Addr));
  const B_Addr: AccountAddress = new AccountAddress();

  B_Addr.Addr_No = A_Addr.Addr_No;
  B_Addr.Place = A_Addr.Place;
  B_Addr.Road = A_Addr.Road;
  B_Addr.Tambon_Id = A_Addr.Tambon_Id;
  B_Addr.Amphur_Id = A_Addr.Amphur_Id;
  B_Addr.Province_Id = A_Addr.Province_Id;
  B_Addr.Country_Id = A_Addr.Country_Id;
  B_Addr.Zip_Code = A_Addr.Zip_Code;
  B_Addr.Tel = A_Addr.Tel;
  B_Addr.Fax = A_Addr.Fax;

  return B_Addr;
  }

  goBack() {
    this.location.back();
  }
}
