import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { RegisterModel } from '../model/sitRegister.model';
import { UtilService } from '../services/util.service';



@Component({
  selector: 'app-set-registration',
  templateUrl: './set-registration.component.html',
  styleUrls: ['./set-registration.component.scss']
})
export class SetRegistrationComponent implements OnInit {

  spinnerLoading = false;
  isLinear = true;
  fillFormGroup: FormGroup;
  register = new RegisterModel();

  constructor(private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private utilService: UtilService
    ) {}

  ngOnInit() {

    this.fillFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
    });

  }

  onSubmit(){


    this.utilService.regisToMailService(this.register.firstName,this.register.lastName,this.register.mobile,this.register.email) .subscribe(data =>{
      this.toastr.success("Register successful." , "Successful", {
        timeOut: 3000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

      this.spinnerLoading = false;
    }
    , error => {

        this.toastr.error("Register incomplete  message." + JSON.stringify(error) , "Error", {
          timeOut: 6000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.spinnerLoading = false;
      }
    );




  }

}
