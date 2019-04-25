import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
import { MatDialogRef, MatDialog } from '@angular/material';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { ChildrenDialogComponent } from '../dialog/children-dialog/children-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-cust-cdd',
  templateUrl: './cust-cdd.component.html',
  styleUrls: ['./cust-cdd.component.scss']
})
export class CustCDDComponent implements OnInit {

  @Input() custCode: string;
  @Input() cddFormGroup: FormGroup;

  @Input() cddData: CDDModel;
  @Input() SPpersonModel: PersonModel;

  // SPformGroup: FormGroup;

  // @ViewChild('SP') SPComponent: PersonalInfoComponent;
  // @ViewChild('Child') ChildComponent: PersonalInfoComponent;

  // SPComponent: PersonalInfoComponent;

  countryList: FCcountry[];
  businessTypeList: FCbusinessType[];
  occupationList: FCoccupation[];
  positionList: Position[];
  incomeList: FCincomeLevel[];
  incomeSourceList: FCincomeSource[];

  // childDisplayedColumns: string[] = ['index','CardType', 'Number', 'Expire' , 'Title', 'FirstName', 'LastName', 'Action'];
  // childDataSource = new BehaviorSubject([]);

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

  childrenDialogComponent: MatDialogRef<ChildrenDialogComponent>;

  constructor(
    // private cddService: CddService,
    private masterDataService:MasterDataService,
    // private toastr: ToastrService,
    public formService: CustCddFormService,
    public shareDataService: ShareDataService,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService,
    ) {

     }


  ngOnInit() {

    this.cardNotExpChecked =    this.cddData.cardNotExp == 'Y'? true :false;
    this.SPcardNotExpChecked =    this.cddData.SPpersonModel.cardNotExp == 'Y'? true :false;

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


  // this.childDataSource.next(this.cddData.children);
  // this.SPformGroup = new FormGroup({
  //   cardType: new FormControl(null, {
  //     validators: [Validators.required]
  //   }),
  //   cardNumber: new FormControl(null, {
  //     validators: [Validators.required]
  //   }),
  //   cardExpDate: new FormControl(null, {
  //     validators: [Validators.required]
  //   }),
  //   cardNotExp: new FormControl(null, {
  //     // validators: [Validators.required]
  //   }),
  //   passportCountry: new FormControl(null, {
  //     // validators: [Validators.required]
  //   }),
  //   title: new FormControl(null, {
  //     validators: [Validators.required]
  //   }),
  //   titleOther: new FormControl(null, {
  //     // validators: [Validators.required]
  //   }),
  //   firstName: new FormControl(null, {
  //     validators: [Validators.required]
  //   }),
  //   lastName: new FormControl(null, {
  //     validators: [Validators.required]
  //   }),

  // });

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

 isSpouceTitleOther(){
  if(this.cddData.SPpersonModel.title === 'OTHER'){
    this.cddFormGroup.controls["spTitleOther"].setValidators(Validators.required);
    this.cddFormGroup.controls["spTitleOther"].updateValueAndValidity();
    return true;
  }else{
    this.cddFormGroup.controls["spTitleOther"].clearValidators();
    this.cddFormGroup.controls["spTitleOther"].updateValueAndValidity();
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
    this.cddData.SPpersonModel.cardNotExp  = "Y";
    this.cddData.SPpersonModel.cardExpDate = '';

    this.cddFormGroup.controls["spCardExpDate"].clearValidators();
    this.cddFormGroup.controls["spCardExpDate"].updateValueAndValidity();

   }else{
    this.cddFormGroup.controls["spCardExpDate"].setValidators(Validators.required);
    this.cddFormGroup.controls["spCardExpDate"].updateValueAndValidity();

    this.cddData.SPpersonModel.cardNotExp = "N";
   }
}

maritalStatusOnChange(val){
  console.log( "maritalStatusOnChange() >>"  + val);
  if(val ==='Married'){
    console.log( " *** SET setParent() " );

    // this.cddFormGroup.addControl('SPformGroup', this.SPformGroup);
    // this.SPformGroup.setParent(this.cddFormGroup);

    this.cddFormGroup.controls["spCardType"].setValidators(Validators.required);
    this.cddFormGroup.controls["spCardNumber"].setValidators(Validators.required);
    this.cddFormGroup.controls["spTitle"].setValidators(Validators.required);
    this.cddFormGroup.controls["spFirstName"].setValidators(Validators.required);
    this.cddFormGroup.controls["spLastName"].setValidators(Validators.required);

  }else{

    // Clear spouce validation
    this.cddFormGroup.controls["spCardType"].clearValidators();
    this.cddFormGroup.controls["spCardNumber"].clearValidators();
    this.cddFormGroup.controls["spTitle"].clearValidators();
    this.cddFormGroup.controls["spFirstName"].clearValidators();
    this.cddFormGroup.controls["spLastName"].clearValidators();

    // Clear spouce data
    this.cddData.SPpersonModel.cardType ='';
    this.cddData.SPpersonModel.cardNumber = '';
    this.cddData.SPpersonModel.cardExpDate = '';
    this.cddData.SPpersonModel.cardNotExp = '';
    this.cddData.SPpersonModel.title = '';
    this.cddData.SPpersonModel.titleOther = '';
    this.cddData.SPpersonModel.firstName = '';
    this.cddData.SPpersonModel.lastName = '';
  }

  this.cddFormGroup.controls["spCardType"].updateValueAndValidity();
  this.cddFormGroup.controls["spCardNumber"].updateValueAndValidity();
  this.cddFormGroup.controls["spTitle"].updateValueAndValidity();
  this.cddFormGroup.controls["spFirstName"].updateValueAndValidity();
  this.cddFormGroup.controls["spLastName"].updateValueAndValidity();


}




childrenOnChange(val){
  // console.log( "childrenOnChange() >>"  + val );
  if(val){

    this.cddData.children=[];
    let i : number = val;
    while ( i > 0 ) {
      const child = new PersonModel();
      this.cddData.children.push(child);

      i--;
    }
    console.log("length  >> " + this.cddData.children.length);
  }
}

addChildren() {

    this.childrenDialogComponent = this.dialog.open(ChildrenDialogComponent, {
      width: '600px',
      data: new PersonModel()
    });

    this.childrenDialogComponent.afterClosed().subscribe(result => {

      if(result){

        this.cddData.children.push(result);
        // this.childDataSource.next(this.cddData.children);
        this.cddFormGroup.controls["numberChildren"].clearValidators();
        this.cddFormGroup.controls["numberChildren"].updateValueAndValidity();

        this.cddData.numChildren = String(this.cddData.children.length) ;

      }
        console.log('Dialog result => ', this.cddData.children);

    });
  }


   onDeleteChildren(appId: string, appName: string) {
    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete  ${appName}  application?`)
    .then((confirmed) => {
      if ( confirmed ) {

      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  onEditChildren(app: PersonModel) {
    this.childrenDialogComponent = this.dialog.open(ChildrenDialogComponent, {
      width: '600px',
      data: app
    });

    this.childrenDialogComponent.afterClosed().subscribe(result => {
        console.log('Dialog result => ', result);
        // if(result){
        //   this.cddData.children.push(result);
        // }

    });
  }

  removeChild(i){

    this.confirmationDialogService.confirm('ยืนยัน Confirmation', `โปรดยืนยันการลบ ข้อมูลบุตร  Please confirm delete data ?`)
    .then((confirmed) => {
      if ( confirmed ) {
        // console.log("Remove >>" + i);
        this.cddData.children.splice(i,1);

      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  public cardNumberUpdate(value: string){

    if(this.cddData.SPpersonModel.cardType ==='CITIZEN_CARD' && value !==''){
      if(!this.shareDataService.checkIDcard(value)){

        this.toastr.warning("เลขบัตรไม่ถูกต้อง Card number incorrect", "warning", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

        this.cddData.SPpersonModel.cardNumber ='';
      }
    }
  }

  public CardTypeChange(event){
    if (event.value === 'CITIZEN_CARD' && this.cddData.SPpersonModel.cardNumber !=''){

      if(!this.shareDataService.checkIDcard(this.cddData.SPpersonModel.cardNumber)){

        this.toastr.warning("เลขบัตรไม่ถูกต้อง Card number incorrect", "warning", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

        this.cddData.SPpersonModel.cardNumber ='';
      }
    }
  }

}
