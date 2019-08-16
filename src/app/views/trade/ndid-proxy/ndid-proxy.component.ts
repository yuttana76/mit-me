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
import { ndidVeriReqDataRS } from '../model/ndidVeriReqData.model';

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
  forthFormGroup: FormGroup;

  ndidModel = new ndidProxy();
  idpList :ndidIdp[]=[];
  serviceList :ndidService[]=[];
  ASList :ndidAS[]=[];

SELIdp_display_name ="";
SELService_display_name ="";
SELAS_display_name ="";

verify_reference_id
verifyStatus_Display ="";

// SEL_verifyReq= new ndidVeriReqDataRS();


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

    this.forthFormGroup = this._formBuilder.group({
      forthCtrl: ['', Validators.required]
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

      console.log('getIdp()'+result);
      const obj = JSON.parse(`${result}`);

      if(obj.status === 401){
        this.toastr.error( obj.message , "IDP error", {
          timeOut: 3000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

      }else{
        this.idpList=obj.id_providers
      }




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

    this.ndidModel.identifier = this.currentAccount.identifier;

    // PREPARE PARAMs
    this.ndidModel.namespace ='citizen_id';
    this.ndidModel.request_message ='Consent to open account of a broker';
    this.ndidModel.min_ial =2.1;
    this.ndidModel.min_aal =2.1;
    this.ndidModel.min_idp=1;
    this.ndidModel.callback_url ='https://mpamapi.merchantasset.co.th:3009/api/proxy/callback',
    this.ndidModel.mode = 1;
    this.ndidModel.min_as = 1;
    this.ndidModel.request_params = '';

    let _idp_id_list=[];
    _idp_id_list.push(this.ndidModel.idp.id);

    const _AS = this.ndidModel.AS;
    let _as_id_list=[];
    _as_id_list.push(_AS.node_id);

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

      this.ndidModel.veriReqDataRS = obj;

      this.verify_reference_id = this.ndidModel.veriReqDataRS.reference_id;

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

    // if(!this.verify_reference_id){
    //   let _veriReqDataRS =this.ndidModel.veriReqDataRS;
    //   _veriReqDataRS.reference_id = this.verify_reference_id

    //   this.ndidModel.veriReqDataRS.reference_id = _veriReqDataRS.reference_id;
    // }

    // const _ndidVeriReqDataRS =this.ndidModel.veriReqDataRS;
    // this.ndidService.getVeriStatus(this.ndidModel.token,this.ndidModel.veriReqDataRS.reference_id).subscribe(result=> {
    this.ndidService.getVeriStatus(this.ndidModel.token,this.verify_reference_id).subscribe(result=> {

      const obj = JSON.parse(`${result}`);
      console.log('getVerifyStatus()>' + JSON.stringify(obj));

      if(obj.status){
        this.verifyStatus_Display = obj.status
      }


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

  getDataVerify() {

    this.spinnerLoading = true;

    this.ndidService.getDataVerify(this.ndidModel.token,this.verify_reference_id).subscribe(result=> {

      const obj = JSON.parse(`${result}`);
      console.log('getDataVerify()>' + JSON.stringify(obj));

      console.log("data >>"+obj.data_items[0].data);

      // if(obj.service_id){
      //   this.ndidModel.service_id=obj.service_id;
      // }

      // if(obj.source_node_id){
      //   this.ndidModel.source_node_id =obj.source_node_id;
      // }

      // if(obj.data){
      //   this.ndidModel.data =obj.data;

      // }

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

  console.log( "onASChange()" + JSON.stringify(obj));

  this.SELAS_display_name = obj.node_name

  this.ndidModel.AS = obj;
  console.log("ndidModel.AS >>"+JSON.stringify(this.ndidModel.AS));
}


}
