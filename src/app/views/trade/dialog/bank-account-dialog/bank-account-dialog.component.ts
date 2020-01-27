import { Component, OnInit, Inject } from '@angular/core';
import { MasterDataService } from '../../services/masterData.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { BankAccountModel } from '../../model/bankAccount.model';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from '../../services/shareData.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GeneralModel } from '../../model/general.model';

@Component({
  selector: 'app-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-dialog.component.scss']
})
export class BankAccountDialogComponent implements OnInit {

  formGroup: FormGroup;

  bankList: GeneralModel[];
  branchList: GeneralModel[];
  sel_branchList: GeneralModel[];

  constructor(
    private masterDataService:MasterDataService,
    public dialogRef: MatDialogRef<BankAccountDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public bankAccountModel: BankAccountModel ,
    private shareDataService: ShareDataService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.masterDataService.getBank().subscribe((data: any[]) => {
      this.bankList = data;
    });

    this.masterDataService.getBranch().subscribe((data: any[]) => {
      this.branchList = data;

      if(this.bankAccountModel.bankCode){
        this.sel_branchList = this.getBranchByBank( this.branchList, this.bankAccountModel.bankCode);
      }

    });


    this.formGroup = new FormGroup({

      bankCode: new FormControl(null, {
        validators: [Validators.required]
      }),
      bankBranchCode: new FormControl(null, {
        validators: [Validators.required]
      }),
      bankAccountNo: new FormControl(null, {
        validators: [Validators.required]
      }),
      default: new FormControl(null, {
        // validators: [Validators.required]
      }),
      finnetCustomerNo: new FormControl(null, {
        // validators: [Validators.required]
      }),
    });
  }



 public onUpdate() {

  if (this.formGroup.invalid) {
    this.toastr.warning("กรุณากรอกข้อมูลให้สมบูรณ์", "warning", {
      timeOut: 5000,
      closeButton: true,
      positionClass: "toast-top-center"
    });
    return true;
  }

  this.bankAccountModel.bankTxt=(this.getObjectModel(this.bankList,this.bankAccountModel.bankCode).length>0)?this.getObjectModel(this.bankList,this.bankAccountModel.bankCode)[0]["Description"]:""
  this.bankAccountModel.branchTxt=(this.getObjectModel(this.branchList,this.bankAccountModel.bankBranchCode).length>0)?this.getObjectModel(this.branchList,this.bankAccountModel.bankBranchCode)[0]["Description"]:""

  this.dialogRef.close(this.bankAccountModel);
}

 public onSave() {

  if (this.formGroup.invalid) {
    this.toastr.warning("กรุณากรอกข้อมูลให้สมบูรณ์", "warning", {
      timeOut: 5000,
      closeButton: true,
      positionClass: "toast-top-center"
    });
    return true;
  }

  this.bankAccountModel.bankTxt=(this.getObjectModel(this.bankList,this.bankAccountModel.bankCode).length>0)?this.getObjectModel(this.bankList,this.bankAccountModel.bankCode)[0]["Description"]:""
  this.bankAccountModel.branchTxt=(this.getObjectModel(this.branchList,this.bankAccountModel.bankBranchCode).length>0)?this.getObjectModel(this.branchList,this.bankAccountModel.bankBranchCode)[0]["Description"]:""

  this.dialogRef.close(this.bankAccountModel);
}


 onClose(): void {
  this.dialogRef.close();
}

onBankChange(event: MatSelectChange) {
  this.sel_branchList = this.getBranchByBank( this.branchList, event.value);
}

getBranchByBank(branchList: GeneralModel[], code: any) {
  if (branchList === null) {
    return null;
  }
  const filtered: any[] = branchList.filter(element => element.RefCode === code);
  return filtered;
}

getObjectModel(objList: GeneralModel[], code: any) {
  if (objList === null) {
    return null;
  }
  const filtered: any = objList.filter(element => element.Code === code);
  return filtered;
}

}
