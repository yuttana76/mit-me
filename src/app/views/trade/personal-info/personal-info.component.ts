import { Component, OnInit, Input } from '@angular/core';
import { PersonModel } from '../model/person.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FCcountry } from '../model/fcContry.model';
import { MasterDataService } from '../services/masterData.service';
import { ShareDataService } from '../services/shareData.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  @Input() personModel: PersonModel;
  @Input() adult;
  // @Input() formGroup: FormGroup;
  formGroup: FormGroup;

  countryList: FCcountry[];



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

  public titleList_child = [
    {Code : 'MR',Description:'เด็กชาย / นาย'}
    ,{Code : 'MISS',Description:'เด็กหญิง / นางสาว'}
    ,{Code : 'OTHER',Description:'อื่นๆ'}
  ];

  cardNotExpChecked=false;

  constructor(
    private masterDataService:MasterDataService,
    private shareDataService: ShareDataService,
    private toastr: ToastrService,
  ) {


   }

  ngOnInit() {

    console.log('PersonalInfoComponent()->ngOnInit()')

    this.cardNotExpChecked =    this.personModel.cardNotExp == 'Y'? true :false;

    this.masterDataService.getFCcountry().subscribe((data: any[]) => {
      this.countryList = data;
    });

    if(this.personModel.cardNotExp ==='Y'){

      this.formGroup.controls["cardExpDate"].clearValidators();
      this.formGroup.controls["cardExpDate"].updateValueAndValidity();
     }

     this.formGroup = new FormGroup({
      cardType: new FormControl(null, {
        validators: [Validators.required]
      }),
      cardNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
      cardExpDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      cardNotExp: new FormControl(null, {
        // validators: [Validators.required]
      }),
      passportCountry: new FormControl(null, {
        // validators: [Validators.required]
      }),
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      titleOther: new FormControl(null, {
        // validators: [Validators.required]
      }),
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required]
      }),

    });

  }

  OnCardNotExpChange($event){
    if($event.checked){
      this.personModel.cardNotExp  = "Y";
      this.personModel.cardExpDate = '';

      this.formGroup.controls["cardExpDate"].clearValidators();
      this.formGroup.controls["cardExpDate"].updateValueAndValidity();

    }else{
      this.formGroup.controls["cardExpDate"].setValidators(Validators.required);
      this.formGroup.controls["cardExpDate"].updateValueAndValidity();

      this.personModel.cardNotExp  = "N";
    }
}

isTitleOther(){
  if(this.personModel.title === 'OTHER'){
    this.formGroup.controls["titleOther"].setValidators(Validators.required);
    this.formGroup.controls["titleOther"].updateValueAndValidity();
    return true;
  }else{
      this.formGroup.controls["titleOther"].clearValidators();
      this.formGroup.controls["titleOther"].updateValueAndValidity();
      this.personModel.titleOther = "";
        return false;
  }
 }


 public cardNumberUpdate(value: string){

  if(this.personModel.cardType ==='CITIZEN_CARD'){
    if(!this.shareDataService.checkIDcard(value)){

      this.toastr.warning("เลขบัตรไม่ถูกต้อง Card number incorrect", "warning", {
        timeOut: 5000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

      this.personModel.cardNumber ='';
    }
  }
}
}
