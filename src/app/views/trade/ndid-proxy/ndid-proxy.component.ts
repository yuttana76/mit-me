import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OpenAccount } from '../model/openAccount.model';
import { NDIDService } from '../services/ndid.service';
import { ToastrService } from 'ngx-toastr';
import { ndidProxy } from '../model/ndidProxy.model';
import { ndidIdp } from '../model/ndidIdp.model';
import { MatRadioChange } from '@angular/material';
import { ndidService } from '../model/ndidService.model';
import { ndidAS } from '../model/ndidAS.model';

@Component({
  selector: 'app-ndid-proxy',
  templateUrl: './ndid-proxy.component.html',
  styleUrls: ['./ndid-proxy.component.scss']
})
export class NdidProxyComponent implements OnInit {

  spinnerLoading = false;
  isLinearStepper = false;
  min_ial='2.1';
  min_aal='2.1';


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  ndidModel = new ndidProxy();
  idpList :ndidIdp[]=[];
  serviceList :ndidService[]=[];
  ASList :ndidAS[]=[];

SELIdp_display_name ="";
SELService_display_name ="";
SELAS_display_name ="";

verifyStatus ="";



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

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
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


  getIdps() {

    this.spinnerLoading = true;

    const _namespace ='citizen_id';

    this.ndidService.getIdp(this.ndidModel.token,this.min_ial,this.min_aal,_namespace,this.currentAccount.identifier).subscribe(result=> {

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


  getServices() {

    this.spinnerLoading = true;

    this.ndidService.getService(this.ndidModel.token).subscribe(result=> {

      var obj = JSON.parse(`${result}`);
      this.serviceList=obj;

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


  getAS() {

    this.spinnerLoading = true;

    this.ndidService.getAS(this.ndidModel.token,this.ndidModel.service.service_id).subscribe(result=> {

      var obj = JSON.parse(`${result}`);
      this.ASList=obj;

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


  veriReqData() {

    this.spinnerLoading = true;

    // PREPARE PARAMs
    let _idp_id_list=[];
    _idp_id_list.push(this.ndidModel.idp.id);

    let _as_id_list=[];
    _as_id_list.push(this.ndidModel.AS.node_id);

    //CALL SERVICE
    this.ndidService.ndidVeriReqData( this.ndidModel.token
      ,this.ndidModel.namespace,
      this.ndidModel.identifier,
      this.ndidModel.request_message,
      _idp_id_list,
      this.ndidModel.min_ial,
      this.ndidModel.min_aal,
      this.ndidModel.min_idp,
      this.ndidModel.callback_url,
      this.ndidModel.mode,
      this.ndidModel.service.service_id,
      _as_id_list,
      this.ndidModel.min_as,
      this.ndidModel.request_params).subscribe(result=> {

      const obj = JSON.parse(`${result}`);
      console.log('veriReqData()>' + JSON.stringify(obj));
      this.ndidModel.veriReqDataRS = obj;

    }, error => {
      this.toastr.error('Get ID provider error.' + error , 'IDP error', {
        timeOut: 3000,
        closeButton: true,
        positionClass: 'toast-top-center'
      });

    }, () => {
      this.spinnerLoading = false;
    });
  }

  getVerifyStatus() {

    this.spinnerLoading = true;

    this.ndidService.getVeriStatus(this.ndidModel.token,this.ndidModel.veriReqDataRS.reference_id).subscribe(result=> {

      const obj = JSON.parse(`${result}`);
      console.log('getVerifyStatus()>' + JSON.stringify(obj));

    }, error => {
      this.toastr.error('Get ID provider error.' + error , 'IDP error', {
        timeOut: 3000,
        closeButton: true,
        positionClass: 'toast-top-center'
      });

    },() =>{
      this.spinnerLoading = false;
    });

  }


  ndidSubmit() {

    this.currentAccount.firstName="XXX";
    this.currentAccount.lastName="YYY";

    this.ndidDone.emit(this.currentAccount);
  }


  onIdpChange(obj: ndidIdp) {
    this.SELIdp_display_name = obj.display_name_th

    console.log(JSON.stringify(this.ndidModel.idp));
 }

 onServiceChange(obj: ndidService) {
  this.SELService_display_name = obj.service_name

  console.log(JSON.stringify(this.ndidModel.service));
}
 onASChange(obj: ndidAS) {
  this.SELAS_display_name = obj.node_name

  console.log(JSON.stringify(this.ndidModel.AS));
}


}
