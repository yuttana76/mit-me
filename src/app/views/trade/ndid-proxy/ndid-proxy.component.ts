import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OpenAccount } from '../model/openAccount.model';
import { NDIDService } from '../services/ndid.service';
import { ToastrService } from 'ngx-toastr';
import { ndidProxy } from '../model/ndidProxy.model';
import { ndidIdp } from '../model/ndidIdp.model';

@Component({
  selector: 'app-ndid-proxy',
  templateUrl: './ndid-proxy.component.html',
  styleUrls: ['./ndid-proxy.component.scss']
})
export class NdidProxyComponent implements OnInit {

  spinnerLoading = false;
  isLinear = true;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ndidModel = new ndidProxy();
  idpList :ndidIdp[]=[];

  @Input() currentAccount = new OpenAccount();
  @Output() ndidDone: EventEmitter<OpenAccount> = new EventEmitter<OpenAccount>();

 constructor(
  private toastr: ToastrService,
   private _formBuilder: FormBuilder,
  private ndidService:NDIDService
  ) {}

  ngOnInit() {

    // this.getNididToken();

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  getNididToken() {

    this.spinnerLoading = true;

    this.ndidService.getToken() .subscribe(token=> {
      this.ndidModel.token = token.data;
    }, error => {
      this.toastr.error("Get NID token error." + error , "Token error", {
        timeOut: 3000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

    },() =>{
      this.spinnerLoading=false;
    });

  }


  getIdp() {

    this.spinnerLoading = true;

    const _min_ial='2.1';
    const _min_aal='2.1';
    const _namespace ='citizen_id';

    this.ndidService.getIdp(this.ndidModel.token,_min_ial,_min_aal,_namespace,this.currentAccount.identifier).subscribe(result=> {

      // console.log('RS1 >' + result);
      var obj = JSON.parse(`${result}`);

      this.idpList=obj.id_providers

    }, error => {
      this.toastr.error("Get ID provider error." + error , "IDP error", {
        timeOut: 3000,
        closeButton: true,
        positionClass: "toast-top-center"
      });

    },() =>{
      this.spinnerLoading=false;
    });

  }


  ndidSubmit() {

    this.currentAccount.firstName="XXX";
    this.currentAccount.lastName="YYY";

    this.ndidDone.emit(this.currentAccount);
  }


}
