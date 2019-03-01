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
import { ToastrService } from 'ngx-toastr';
import { CustCddFormService } from './cust-cdd.service';

@Component({
  selector: 'app-cust-cdd',
  templateUrl: './cust-cdd.component.html',
  styleUrls: ['./cust-cdd.component.scss']
})
export class CustCDDComponent implements OnInit {

  @Input() custCode: string;

  cddFormGroup: FormGroup;
  public cddData = new CDDModel() ;

  public modifyFlag = true;

  businessTypeList: BusinessType[];
  occupationList: Occupation[];
  positionList: Position[];
  incomeList: Income[];
  incomeSourceList: IncomeSource[];


  constructor(
    private cddService: CddService,
    private masterDataService:MasterDataService,
    private toastr: ToastrService,
    public formService: CustCddFormService
    ) { }

  ngOnInit() {

   this.cddFormGroup = new FormGroup({
    pid: new FormControl(null, {
      validators: [Validators.required]
    }),
    firstName: new FormControl(null, {
      validators: [Validators.required]
    }),
    lastName: new FormControl(null, {
      validators: [Validators.required]
    }),
    dob: new FormControl(null, {
      validators: [Validators.required]
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
    occupation: new FormControl(null, {
      validators: [Validators.required]
    }),

    position: new FormControl(null, {
      validators: [Validators.required]
    }),
    incomeLevel: new FormControl(null, {
      validators: [Validators.required]
    }),
    incomeSource: new FormControl(null, {
      validators: [Validators.required]
    }),
    workPlace: new FormControl(null, {
      validators: [Validators.required]
    }),
  });

   // Load master data
   this.masterDataService.getOccupations().subscribe((data: any[]) => {
      this.occupationList = data;
   });

   this.masterDataService.getBusinessType().subscribe((data: any[]) => {
    this.businessTypeList = data;
  });

  this.masterDataService.getPosition().subscribe((data: any[]) => {
    this.positionList = data;
  });

  this.masterDataService.getIncome().subscribe((data: any[]) => {
    this.incomeList = data;
  });

  this.masterDataService.getIncomeSource().subscribe((data: any[]) => {
    this.incomeSourceList = data;
  });

   //Initial data
  this.getCustomerInfo(this.custCode);

  this.modifOnChange(this.modifyFlag);

  }

 getCustomerInfo(_id){
  //Load CDD
  this.cddService.getCustCDDInfo(_id).subscribe(data => {
    // console.log('CDD >>' +JSON.stringify(data));

    this.cddData.pid = data[0].pid;
    this.cddData.firstName = data[0].firstName;
    this.cddData.lastName = data[0].lastName;
    this.cddData.dob = data[0].dob;
    this.cddData.mobile = data[0].mobile;
    this.cddData.email = data[0].email;
    this.cddData.typeBusiness = data[0].typeBusiness;
    this.cddData.occupation = data[0].occupation;
    this.cddData.position = data[0].position;
    this.cddData.incomeLevel = data[0].incomeLevel;
    this.cddData.incomeSource = data[0].incomeSource;
    this.cddData.workPlace = data[0].workPlace;

    // this.reloadData();

  }, error => () => {
      console.log('Was error', error);
  }, () => {
    console.log('Loading complete');
  });
 }

//  reloadData(){
//   this.cddFormGroup.patchValue({pid: this.cddData.pid})
//   this.cddFormGroup.patchValue({firstName: this.cddData.firstName})
//   this.cddFormGroup.patchValue({lastName: this.cddData.lastName})
//   this.cddFormGroup.patchValue({dob: this.cddData.dob})
//   this.cddFormGroup.patchValue({mobile: this.cddData.mobile})
//   this.cddFormGroup.patchValue({email: this.cddData.email})
//   this.cddFormGroup.patchValue({typeBusiness: this.cddData.typeBusiness})
//   this.cddFormGroup.patchValue({occupation: this.cddData.occupation})
//   this.cddFormGroup.patchValue({position: this.cddData.position})
//   this.cddFormGroup.patchValue({incomeLevel: this.cddData.incomeLevel})
//   this.cddFormGroup.patchValue({incomeSource: this.cddData.incomeSource})
//  }

 savePersonInfo(){
   console.log('savePersonInfo()');

   this.cddService.saveCustCDDInfo(this.custCode,this.custCode,this.cddData)
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
     console.log('Loading complete');
  });
 }

 cancelEdit(){

  this.getCustomerInfo(this.custCode);

  this.cddFormGroup.disable();
  this.modifyFlag =false;
 }

 modifOnChange(val){
    if(val){
      this.cddFormGroup.enable();

     }else{
      // this.reloadData();
      this.cddFormGroup.disable();
     }
 }



}
