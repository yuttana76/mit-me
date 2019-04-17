import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CDDModel } from '../model/cdd.model';
import { CddService } from '../services/cdd.service';
import { MasterDataService } from '../services/masterData.service';
import { Occupation } from '../model/occupation.model';
import { BusinessType } from '../model/businessType.model';
import { Income } from '../model/income.model';
import { IncomeSource } from '../model/incomeSource.model';
import { Position } from '../model/position.model';
import { ToastrService, ToastrComponentlessModule } from 'ngx-toastr';
import { CustCddFormService } from './cust-cdd.service';
import { FCoccupation } from '../model/fcOccupation.model';
import { FCbusinessType } from '../model/fcBusinessType.model';
import { FCincomeLevel } from '../model/fcIncomeLevel.model';
import { FCincomeSource } from '../model/fcIncomeSource.model';
import { ShareDataService } from '../services/shareData.service';
import { FCcountry } from '../model/fcContry.model';
import { PersonModel } from '../model/person.model';

@Component({
  selector: 'app-cust-cdd',
  templateUrl: './cust-cdd.component.html',
  styleUrls: ['./cust-cdd.component.scss']
})
export class CustCDDComponent implements OnInit {

  @Input() custCode: string;
  @Input() cddFormGroup: FormGroup;
  @Input() cddData: CDDModel;

  countryList: FCcountry[];
  businessTypeList: FCbusinessType[];
  occupationList: FCoccupation[];
  positionList: Position[];
  incomeList: FCincomeLevel[];
  incomeSourceList: FCincomeSource[];

  SPpersonModel:PersonModel = new PersonModel();

  numberChildren;
  children: PersonModel[] =[];

  public cardTypeList = [
    {Code : 'CITIZEN_CARD',Description:'บัตรประชาชน'}
    ,{Code : 'PASSPORT',Description:'Passport'}
  ];

  public titleList = [
    {Code : 'MR',Description:'นาย'}
    ,{Code : 'MRS',Description:'นาง'}
    ,{Code : 'MISS',Description:'นางสาว'}
    ,{Code : 'OTHER',Description:'อื่นๆ'}
  ];


  cardNotExpChecked = true;
  SPcardNotExpChecked = true;

  constructor(
    // private cddService: CddService,
    private masterDataService:MasterDataService,
    // private toastr: ToastrService,
    public formService: CustCddFormService,
    public shareDataService: ShareDataService
    ) {

     }


  ngOnInit() {

    this.cardNotExpChecked =    this.cddData.cardNotExp == 'Y'? true :false;
    this.SPcardNotExpChecked =    this.cddData.SpouseIDNotExp == 'Y'? true :false;

    this.masterDataService.getFCcountry().subscribe((data: any[]) => {
      this.countryList = data;
    });

  this.masterDataService.getFCoccupation().subscribe((data: any[]) => {
    this.occupationList = data;
  });

   this.masterDataService.getFCbusinessType().subscribe((data: any[]) => {
    this.businessTypeList = data;
  });

  this.masterDataService.getPosition().subscribe((data: any[]) => {
    this.positionList = data;

  })

  this.masterDataService.getFCincomeLevel().subscribe((data: any[]) => {
    this.incomeList = data;
  });

  this.masterDataService.getFCincomeSource().subscribe((data: any[]) => {
    this.incomeSourceList = data;
  });


  }

  ngAfterViewInit(){

    if (this.cddFormGroup.invalid) {
      this.cddFormGroup.enable();
      // this.modifyFlag  = true;
      this.cddData.ReqModifyFlag = true;

      const controls = this.cddFormGroup.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
              this.cddFormGroup.controls[name].markAsTouched();
          }
      }

    } else {
      this.cddFormGroup.disable();
      // this.modifyFlag  = false;
      this.cddData.ReqModifyFlag = false;
    }

  }

 modifOnChange(val){

    if(val){
      this.cddFormGroup.enable();
     }else{
      this.cddFormGroup.disable();
     }
 }

 checkFormInvalid(){
  if(this.cddFormGroup.invalid){

    const invalid = [];
    const controls = this.cddFormGroup.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log('Form invalid are>>' + JSON.stringify(invalid));
  }

 }

 isTitleOther(){
  if(this.cddData.title === 'OTHER'){
    this.cddFormGroup.controls["titleOth"].setValidators(Validators.required);
    this.cddFormGroup.controls["titleOth"].updateValueAndValidity();
    return true;
 }else{
    this.cddFormGroup.controls["titleOth"].clearValidators();
    this.cddFormGroup.controls["titleOth"].updateValueAndValidity();
    this.cddData.titleOther = "";
      return false;
 }
 }

//  isPassportCard(){
//    if(this.cddData.identificationCardType === 'PASSPORT'){
//       return true;
//    }else{
//       return false;
//    }
//  }

 isBusinessTypeOther(){
    if(this.cddData.typeBusiness === this.shareDataService.BUSINESSTYPE_FC_OTHER){
      this.cddFormGroup.controls["typeBusinessOth"].setValidators(Validators.required);
      this.cddFormGroup.controls["typeBusinessOth"].updateValueAndValidity();
      return true;
    }else{
      this.cddFormGroup.controls["typeBusinessOth"].clearValidators();
      this.cddFormGroup.controls["typeBusinessOth"].updateValueAndValidity();
      this.cddData.typeBusiness_Oth = "";
      return false;
    }
 }

 isOccupationOther(){
  if(this.cddData.occupation ===  this.shareDataService.OCCUPATION_FC_OTHER){
    this.cddFormGroup.controls["occupationOth"].setValidators(Validators.required);
    this.cddFormGroup.controls["occupationOth"].updateValueAndValidity();
    return true;
  }else{
    this.cddFormGroup.controls["occupationOth"].clearValidators();
    this.cddFormGroup.controls["occupationOth"].updateValueAndValidity();
    this.cddData.occupation_Oth = "";
    return false;
  }
 }

 isPositionOther(){
  if(this.cddData.position === this.shareDataService.POSITION_OTHER){
    this.cddFormGroup.controls["positionOth"].setValidators(Validators.required);
    this.cddFormGroup.controls["positionOth"].updateValueAndValidity();
    return true;
  }else{
    this.cddFormGroup.controls["positionOth"].clearValidators();
    this.cddFormGroup.controls["positionOth"].updateValueAndValidity();
    this.cddData.position_Oth = "";
    return false;
  }
 }

 isIncomeSource(){
  if(this.cddData.incomeSource === this.shareDataService.INCOMESOURCE_FC_OTHER){
    this.cddFormGroup.controls["incomeSourceOth"].setValidators(Validators.required);
    this.cddFormGroup.controls["incomeSourceOth"].updateValueAndValidity();
    return true;
  }else{
    this.cddFormGroup.controls["incomeSourceOth"].clearValidators();
    this.cddFormGroup.controls["incomeSourceOth"].updateValueAndValidity();
    this.cddData.incomeSource_Oth = "";
    return false;
  }
 }

 CardNotExpChecked(){
   return true;
 }



 OnCardNotExpChange($event){

  if($event.checked){
    this.cddData.cardNotExp  = "Y";
    this.cddData.PIDExpDate = '';

    this.cddFormGroup.controls["PIDExpDate"].clearValidators();
    this.cddFormGroup.controls["PIDExpDate"].updateValueAndValidity();

   }else{
    this.cddFormGroup.controls["PIDExpDate"].setValidators(Validators.required);
    this.cddFormGroup.controls["PIDExpDate"].updateValueAndValidity();

    this.cddData.cardNotExp  = "N";
   }
}



OnSPCardNotExpChange($event){

  if($event.checked){
    this.cddData.SpouseIDNotExp  = "Y";
    this.cddData.spouseIDExpDate = '';

    this.cddFormGroup.controls["spouseIDExpDate"].clearValidators();
    this.cddFormGroup.controls["spouseIDExpDate"].updateValueAndValidity();

   }else{
    this.cddFormGroup.controls["spouseIDExpDate"].setValidators(Validators.required);
    this.cddFormGroup.controls["spouseIDExpDate"].updateValueAndValidity();

    this.cddData.SpouseIDNotExp  = "N";
   }
}


maritalStatusOnChange(val){
  console.log( "maritalStatusOnChange() >>"  + val);
  if(val){

  }

}


childrenOnChange(val){
  console.log( "childrenOnChange() >>"  + val );
  if(val){

    this.children=[];
    var i:number = val
    while(i>0) {
      let child = new PersonModel();
      this.children.push(child);

      i--;
    }


    console.log("length  >> " + this.children.length);
  }
}

}
