import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustAddrFormService } from './cust-addr.service';
import { MasterDataService } from '../services/masterData.service';
import { ToastrService } from 'ngx-toastr';
import { AddrCustModel } from '../model/addrCust.model';
import { MatSelectChange } from '@angular/material/select';
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

  public modifyFlag = false;

  nation_Code = '000';

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

      this.sel_provinceList = this.getProvinceByCountry( this.provinceMasList, 0); // Default is Thailand
      // this.sel_provinceList = this.getProvinceByCountry( this.provinceMasList, this.addrData.Country_Id);
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

  ngAfterViewInit(){

    if (this.addrFormGroup.invalid) {
      this.addrFormGroup.enable();
      // this.modifyFlag  = true;

      const controls = this.addrFormGroup.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.addrFormGroup.controls[name].markAsTouched();
          }
      }
    }
    // else {
    //   this.addrFormGroup.disable();
    //   this.modifyFlag  = false;
    // }
  }

  countryChange(event: MatSelectChange) {

    console.log(" *** countryChange()" + event.value);
    /**
     * 0:Thailand
     * 9:Other
     */
    // this.sel_provinceList = this.getProvinceByCountry( this.provinceMasList,  event.value);
    if(event.value === 9){
      this.addrFormGroup.controls["Country_oth"].setValidators(Validators.required);
      this.addrFormGroup.controls["Country_oth"].updateValueAndValidity();
      // return true;
    }else if(event.value !== 0){

      // Addr_No
      this.addrFormGroup.controls["Addr_No"].clearValidators();
      this.addrFormGroup.controls["Addr_No"].updateValueAndValidity();

      // Zip_Code
      this.addrFormGroup.controls["Zip_Code"].clearValidators();
      this.addrFormGroup.controls["Zip_Code"].updateValueAndValidity();

      // Province_Id
      this.addrFormGroup.controls["Province_Id"].clearValidators();
      this.addrFormGroup.controls["Province_Id"].updateValueAndValidity();

      // Amphur_Id
      this.addrFormGroup.controls["Amphur_Id"].clearValidators();
      this.addrFormGroup.controls["Amphur_Id"].updateValueAndValidity();

      // Tambon_Id
      this.addrFormGroup.controls["Tambon_Id"].clearValidators();
      this.addrFormGroup.controls["Tambon_Id"].updateValueAndValidity();

    }else if(event.value === 0){

      // Addr_No
      this.addrFormGroup.controls["Addr_No"].setValidators(Validators.required);
      this.addrFormGroup.controls["Addr_No"].updateValueAndValidity();

      // Zip_Code
      this.addrFormGroup.controls["Zip_Code"].setValidators(Validators.required);
      this.addrFormGroup.controls["Zip_Code"].updateValueAndValidity();

      // Province_Id
      this.addrFormGroup.controls["Province_Id"].setValidators(Validators.required);
      this.addrFormGroup.controls["Province_Id"].updateValueAndValidity();

      // Amphur_Id
      this.addrFormGroup.controls["Amphur_Id"].setValidators(Validators.required);
      this.addrFormGroup.controls["Amphur_Id"].updateValueAndValidity();

      // Tambon_Id
      this.addrFormGroup.controls["Tambon_Id"].setValidators(Validators.required);
      this.addrFormGroup.controls["Tambon_Id"].updateValueAndValidity();


    }else{
      this.addrFormGroup.controls["Country_oth"].setValidators(Validators.required);
      this.addrFormGroup.controls["Country_oth"].updateValueAndValidity();
      // this.addrData.Country_oth = "";
      // return false;
    }


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

  modifOnChange(val){
    if(val){
      this.addrFormGroup.enable();
     }else{
      this.addrFormGroup.disable();
     }
 }

 isCountryOth(){
  if(this.addrData.Country_Id === 9){

    // console.log(' *** SET Country Oth VALIDAATED')

    // this.addrFormGroup.controls["Country_oth"].setValidators(Validators.required);
    // this.addrFormGroup.controls["Country_oth"].updateValueAndValidity();
    return true;
  }else{
    // console.log(' *** SET Country Oth VALIDAATED')
    // this.addrFormGroup.controls["Country_oth"].clearValidators();
    // this.addrFormGroup.controls["Country_oth"].updateValueAndValidity();
    // this.addrData.Country_oth = "";
    return false;
  }

 }

}
