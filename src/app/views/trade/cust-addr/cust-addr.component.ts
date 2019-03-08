import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustAddrFormService } from './cust-addr.service';
import { MasterDataService } from '../services/masterData.service';
import { ToastrService } from 'ngx-toastr';
import { AddrCustModel } from '../model/addrCust.model';
import { MatSelectChange } from '@angular/material';
import { Country } from '../model/ref_country';
import { Provinces } from '../model/ref_provinces.model';
import { Amphurs } from '../model/ref_amphurs.model';
import { Tambons } from '../model/ref_tambons.model';
import { CddService } from '../services/cdd.service';

@Component({
  selector: 'app-cust-addr',
  templateUrl: './cust-addr.component.html',
  styleUrls: ['./cust-addr.component.scss']
})
export class CustAddrComponent implements OnInit {

  @Input() custCode: string;
  @Input() addrData: AddrCustModel;
  @Input() addrFormGroup: FormGroup;
  // @Output() addrFormGroup: FormGroup;

  public modifyFlag = true;
  nation_Code = '000';

  // addrFormGroup: FormGroup;

  countryMasList: Country[];
  sel_countryList: Country[];

  provinceMasList: Provinces[];
  sel_provinceList: Provinces[] ;

  amphursMasList: Amphurs[];
  sel_amphursList: Amphurs[];

  tambonsMasList: Tambons[];
  sel_tambonsList: Tambons[];

  constructor(
    public formService: CustAddrFormService,
    private masterDataService:MasterDataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // console.log( 'Initial CustAddrComponent >>'+ JSON.stringify(this.addrData) )

    // this.addrFormGroup = new FormGroup({
    //   // Addr_Seq: new FormControl(null, {
    //   //   validators: [Validators.required]
    //   // }),
    //   Addr_No: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Moo: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Place: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Floor: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Soi: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Road: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Tambon_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Amphur_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Province_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Country_Id: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Zip_Code: new FormControl(null, {
    //     validators: [Validators.required]
    //   }),
    //   Tel: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    //   Fax: new FormControl(null, {
    //     // validators: [Validators.required]
    //   }),
    // });

    this.masterDataService.getCountry().subscribe((data: any[]) => {
      this.countryMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
    //  this.sel_countryList = this.getCountryByNation( this.countryMasList, this.nation_Code);
        this.sel_countryList =this.countryMasList ;

    });


    this.masterDataService.getProvince().subscribe((data: any[]) => {
      this.provinceMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {

      this.sel_provinceList = this.getProvinceByCountry( this.provinceMasList, this.addrData.Country_Id);
    });

    this.masterDataService.getAmphurs().subscribe((data: any[]) => {
      this.amphursMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.sel_amphursList = this.getAmphursByProvince( this.amphursMasList, this.addrData.Province_Id);
    });

    this.masterDataService.getTambons().subscribe((data: any[]) => {
      this.tambonsMasList = data;
    }, error => () => {
        console.log('Was error', error);
    }, () => {
      this.sel_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, this.addrData.Amphur_Id);

    });

  }


  countryChange(event: MatSelectChange) {

    this.sel_provinceList = this.getProvinceByCountry( this.provinceMasList,  event.value);
  }

  provinceChange(event: MatSelectChange) {
    this.sel_amphursList = this.getAmphursByProvince( this.amphursMasList, event.value);
  }
  amphurChange(event: MatSelectChange) {

    this.sel_tambonsList = this.getTambonsByAmphur( this.tambonsMasList, event.value);

  }
  tambonChange(event: MatSelectChange) {
    // console.log('ceTambonChange>>', event.value);
  }


  getCountryByNation(countryList: Country[], code: string) {
    if (countryList === null || code === null) {
      return null;
    }
    const filtered: any[] = countryList.filter(element => element.Nation === code);

    return filtered;
  }

  getProvinceByCountry(provinceList: Provinces[], code: any) {
    if (provinceList === null) {
      return null;
    }
    const filtered: any[] = provinceList.filter(element => element.Country_ID === code);
    return filtered;
  }

  getAmphursByProvince(amphursList: Amphurs[], code: any) {
    if (amphursList === null) {
      return null;
    }
    const filtered: any[] = amphursList.filter(element => element.Province_ID === code);
    return filtered;
  }

  getTambonsByAmphur(tambonsList: Tambons[], code: any) {
    if (tambonsList === null) {
      return null;
    }
    const filtered: any[] = tambonsList.filter(element => element.Amphur_ID === code);
    return filtered;
  }

}
