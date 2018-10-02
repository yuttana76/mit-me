import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientType } from '../model/ref_clientType.model';
import { BeforeTitle } from '../model/ref_before_title.model';
import { MasterDataService } from '../services/masterData.service';
import { PIDTypes } from '../model/ref_PIDTypes.model';
import { AccountInfo } from '../model/accountInfo.model';
import { MatRadioChange, MatSelectChange, MatDialogRef, MatDialog } from '@angular/material';
import { Country } from '../model/ref_country';
import { Provinces } from '../model/ref_provinces.model';
import { Amphurs } from '../model/ref_amphurs.model';
import { Tambons } from '../model/ref_tambons.model';
import { NullTemplateVisitor } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { Nation } from '../model/ref_nation.model';
import { Customer } from '../model/customer.model';
import { CustAddress } from '../model/custAddress.model';
import { CustomerService } from '../services/customer.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SaleDialogComponent } from '../dialog/sale-dialog/sale-dialog.component';
import { Sale } from '../model/sale.model';
import { AccountAddress } from '../model/accountAddress.model';
import { WipCustomerService } from '../services/wipCustomer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customerDetail.component.html',
  styleUrls: ['./customerDetail.component.scss']
})
// @CrossOrigin(origins = {"http://localhost:4200"})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  CLIENT_TYPE_PERSION = '1';
  TRADE_FORMAT_DATE = 'yyyy-MM-dd';

  form: FormGroup;
  spinnerLoading = false;

  clientTypeList: ClientType[] = [];

  PIDTypeMasList: PIDTypes[] = [];
  PIDTypeList: PIDTypes[];

  thaiTitleList: BeforeTitle[];
  engTitlesList: BeforeTitle[];

  nationList: Nation[];

  countryMasList: Country[];
  ce_countryList: Country[] ;
  ma_countryList: Country[] ;//Contact
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


  saleDialogRef: MatDialogRef<SaleDialogComponent>;

  constructor( private datePipe: DatePipe,
    private masterDataService: MasterDataService ,
    private wipCustomerService: WipCustomerService,
    private authService: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.spinnerLoading = true;
    this.customer.Card_Type = this.CLIENT_TYPE_PERSION;
    this.customer.Nation_Code = '000';

    // Initial Form fields
    this.form = new FormGroup({
      custType: new FormControl(null, {
        validators: [Validators.required]
      }),
      groupCdoe: new FormControl(null, {
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
      // compRegisDate: new FormControl(null, {
      //   validators: [Validators.required]
      // }),
      issueDate: new FormControl(null, {
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
       this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, this.customer.Card_Type);
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
    console.log('ON SUBMIT !');

    // if (this.form.invalid) {
    //   console.log('form.invalid() ' + this.form.invalid);
    //   return true;
    // }

    // CONVERT VALUES
    if ( this.customer.Birth_Day) {
      const d = new Date(this.customer.Birth_Day);
      this.customer.Birth_Day = this.datePipe.transform(d, this.TRADE_FORMAT_DATE);
    }
    // this.customer.Create_By = this.authService.getUserData() || 'NONE';

    console.log('CUST>>', JSON.stringify(this.customer));
    console.log('CE ADDR>>', JSON.stringify(this.ceAddress));
    console.log('MA ADDR>>', JSON.stringify(this.maAddress));

    // this.customerService.createCustomer(this.customer, this.ceAddress, this.maAddress);
    this.wipCustomerService.createCustomer(this.customer, this.ceAddress, this.maAddress);

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
  console.log('ceTambonChange>>', event.value);
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
  console.log('maTambonChange>>', event.value);
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
  console.log('maTambonChange>>', event.value);
}


openSaleDialog() {
  this.saleDialogRef = this.dialog.open(SaleDialogComponent, {
    width: '600px',
    data: 'This text is passed into the dialog!'
  });

  this.saleDialogRef.afterClosed().subscribe(result => {
    if ( result && result !== 'close' ) {
      const saleObj = result;
      this.customer.MktId = saleObj.User_Code;
    }
  });
}

// ceAddress: CustAddress = new CustAddress();  // Register address
// maAddress: CustAddress = new CustAddress();  // Mail & Contact address
// ofAddress: CustAddress = new CustAddress();  // Office address

ofSameAsRegister() {
  copyAddr(this.ceAddress, this.ofAddress);

  this.of_provinceList = this.getProvinceByCountry( this.provinceMasList,  this.ofAddress.Country_Id);
  this.of_amphursList = this.getAmphursByProvince( this.amphursMasList, this.ofAddress.Province_Id);
  this.of_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.ofAddress.Amphur_Id);
}

maSameAsRegister() {
  copyAddr(this.ceAddress, this.maAddress);

  this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList,  this.maAddress.Country_Id);
  this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, this.maAddress.Province_Id);
  this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.maAddress.Amphur_Id);

}

maSameAsOffice() {
  copyAddr(this.ofAddress, this.maAddress);

  this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList,  this.maAddress.Country_Id);
  this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, this.maAddress.Province_Id);
  this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.maAddress.Amphur_Id);

}

function copyAddr (A_Addr: AccountAddress , B_Addr: AccountAddress): void {

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
}
