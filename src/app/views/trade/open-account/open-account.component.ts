import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../model/customer.model';
import { OpenAccount } from '../model/openAccount.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-open-account',
  templateUrl: './open-account.component.html',
  styleUrls: ['./open-account.component.scss']
})
export class OpenAccountComponent implements OnInit {

  isLinear = true;
  openAccount = new OpenAccount();

  firstFormGroup: FormGroup;
  fillFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      identifier: ['', Validators.required]
    });
    this.fillFormGroup = this._formBuilder.group({
      identifier: ['', Validators.required],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      cardIssueDate: ['', Validators.required],
      cardExpDate: ['', Validators.required],
      nationality: ['', Validators.required],
    });

    this.fillFormGroup.controls['identifier'].disable();
  }

  onFillFormClick(){
    const controls = this.fillFormGroup.controls;
    for (const name in controls) {
      console.log(" Controls >>" + name);
        if (controls[name].invalid) {
            console.log(" *** Invalid >>" + name);

        }
    }
  }

  onSubmit(){

    console.log('**SUBMITED >>');

    this.confirmationDialogService.confirm('Confirmation', ` Please confirm your data before submit. `)
    .then((confirmed) => {
      console.log('Confirm >>' + confirmed);
      if ( confirmed ) {
        this.toastr.success("Open account was successful." , "Successful", {
          timeOut: 3000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      }
    });
  }

  ndidDone(currentAcc){
    console.log("NDID DATA>>" + JSON.stringify(currentAcc));

  }

}
