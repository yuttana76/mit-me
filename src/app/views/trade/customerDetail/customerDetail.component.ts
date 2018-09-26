import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientType } from '../model/ref_clientType.model';
import { BeforeTitle } from '../model/ref_before_title.model';
import { MasterDataService } from '../services/masterData.service';
import { PIDTypes } from '../model/ref_PIDTypes.model';
import { AccountInfo } from '../model/accountInfo.model';
import { MatRadioChange, MatSelectChange } from '@angular/material';
import { Country } from '../model/ref_country';
import { Provinces } from '../model/ref_provinces.model';
import { Amphurs } from '../model/ref_amphurs.model';
import { Tambons } from '../model/ref_tambons.model';
import { NullTemplateVisitor } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { Nation } from '../model/ref_nation.model';

@Component({
  selector: 'app-customer',
  templateUrl: './customerDetail.component.html',
  styleUrls: ['./customerDetail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  CLIENT_TYPE_PERSION = '1';

  form: FormGroup;
  spinnerLoading = true;

  // clientTypeList: ClientType[];
  // PIDTypeList: PIDTypes[];
  // thaiTitleList: BeforeTitle[];
  // engTitlesList: BeforeTitle[];

  // clientTypeList: ClientType[] = this.masterDataService.getClientTypeList();
  clientTypeList: ClientType[] = [];

  // PIDTypeMasList: PIDTypes[] = this.masterDataService.getPIDTypeList();
  PIDTypeMasList: PIDTypes[] = [];
  PIDTypeList: PIDTypes[];

  thaiTitleList: BeforeTitle[];
  engTitlesList: BeforeTitle[];

  nationList: Nation[];

  countryMasList: Country[];
  ce_countryList: Country[] ;
  ma_countryList: Country[] ;

  provinceMasList: Provinces[];
  ce_provinceList: Provinces[] ;
  ma_provinceList: Provinces[] ;

  amphursMasList: Amphurs[];
  ce_amphursList: Amphurs[] ;
  ma_amphursList: Amphurs[] ;

  tambonsMasList: Tambons[];
  ce_tambonsList: Tambons[] ;
  ma_tambonsList: Tambons[] ;

  // Customer fields
  card_Type = this.CLIENT_TYPE_PERSION;
  Group_Code: string;
  thaiTitle: string;
  engTitle: string;
  Nation_Code = '000';
  asRegisterAddr = false;
  sex: string;
  fc_ipfg: string;
  ce_country: string;
  ce_province: string;
  ce_amphure: string;
  ce_tambon: string;
  ma_country: string;
  ma_province: string;
  ma_amphur: string;
  ma_tambon: string;

  constructor( private masterDataService: MasterDataService) { }

  ngOnInit() {
    console.log('Custeomer Detail  Inititial!!!');
    this.spinnerLoading = true;

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
      compExpDate: new FormControl(null, {
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
      ce_addr1: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_addr2: new FormControl(null, {
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
      ce_postCode: new FormControl(null, {
        validators: [Validators.required]
      }),
      ce_tel: new FormControl(null, null),
      ce_fax: new FormControl(null, null),
      // Mail Address
      ma_addr1: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_addr2: new FormControl(null, {
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
      ma_postcode: new FormControl(null, {
        validators: [Validators.required]
      }),
      ma_tel: new FormControl(null, null),
      ma_fax: new FormControl(null, null),
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
       this.PIDTypeList = this.getPIDTypeListByClientType(this.PIDTypeMasList, this.card_Type);
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
      this.ce_countryList = this.getCountryByNation( this.countryMasList, this.Nation_Code);
      this.ma_countryList = this.getCountryByNation( this.countryMasList, this.Nation_Code);
    });

    this.masterDataService.getProvince().subscribe((data: any[]) => {
      this.provinceMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ce_country);
      this.ma_provinceList = this.getProvinceByCountry( this.provinceMasList, this.ma_country);
    });

    this.masterDataService.getAmphurs().subscribe((data: any[]) => {
      this.amphursMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_amphursList = this.getAmphursByProvince( this.amphursMasList, this.ce_province);
      this.ma_amphursList = this.getAmphursByProvince( this.amphursMasList, this.ma_province);
    });

    this.masterDataService.getTambons().subscribe((data: any[]) => {
      this.tambonsMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.ce_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.ce_amphure);
      this.ma_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.ma_amphur);
    });

    // Mapping to View list
    // this.ce_countryList = this.getCountryByNation(this.countryMasList, '000');
    // this.ce_provinceList = this.getProvinceByCountry(this.provinceMasList, this.ce_country);
    // this.ce_amphursList = this.getAmphursByProvince(this.amphursMasList, this.ce_amphure);
    // this.ce_tambonsList = this.getTambonsByAmphur(this.tambonsMasList, this.ce_tambon);

    // this.ma_countryList = this.getCountryByNation(this.countryMasList, '000');
    // this.ma_provinceList = this.getProvinceByCountry(this.provinceMasList, this.ma_country);
    // this.ma_amphursList = this.getAmphursByProvince(this.amphursMasList, this.ma_amphur);
    // this.ma_tambonsList = this.getTambonsByAmphur(this.tambonsMasList, this.ma_tambon);

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

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
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

}
