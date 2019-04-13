import { Component, OnInit, Input } from '@angular/core';
import { PersonModel } from '../model/person.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  @Input() personModel: PersonModel;
  formGroup: FormGroup;


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


  cardNotExpChecked=false;

  constructor() { }

  ngOnInit() {

    this.cardNotExpChecked =    this.personModel.cardNotExp == 'Y'? true :false;

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


}
