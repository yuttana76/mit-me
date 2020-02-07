import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer.model';
import { fcIndCustomer } from '../../model/fcIndCustomer.model';
import { ToastrService } from 'ngx-toastr';
import { AddrCustModel } from '../../model/addrCust.model';
import { PersonModel } from '../../model/person.model';
import { CustomerExt } from '../../model/customerExt.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-fc-inves-comp-dialog',
  templateUrl: './fc-inves-comp-dialog.component.html',
  styleUrls: ['./fc-inves-comp-dialog.component.scss']
})
export class FcInvesCompDialogComponent implements OnInit {

  spinnerLoading = false;
  CAN_APPROVE_CUST_INFO:true;

  mftsCustomer:any;
  mftsCustomerExt:any;
  fcCustomer:any;

  fundConnextCustomer:any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public custCode: any,
    public customerService: CustomerService,
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.mftsCustomer= new Customer();
    this.mftsCustomerExt= new CustomerExt();

    this.fcCustomer= new fcIndCustomer();
    this.fcCustomer.residence = new AddrCustModel();
    this.fcCustomer.current = new AddrCustModel();
    this.fcCustomer.work = new AddrCustModel();
    // this.fcCustomer.children = new PersonModel();
    this.fcCustomer.children = [];

    this.loadCustData();


  }

  loadCustData(){

    this.spinnerLoading = true;

    this.customerService.getInvestorComparision(this.custCode).subscribe(res => {

      // console.log("RESULT DATA>" + JSON.stringify(res));

      //Original data
      this.mftsCustomer = JSON.parse(JSON.stringify(res[0].result));
      this.mftsCustomerExt = JSON.parse(JSON.stringify(res[0].result));

      if (res[0].result.ext) {
      this.mftsCustomerExt = JSON.parse(JSON.stringify(res[0].result.ext));
      }

      if(res[0].result.children){
        this.mftsCustomerExt.children =JSON.parse(JSON.stringify(res[0].result.children));
      }

      // FundConnext data
      this.fcCustomer= JSON.parse(JSON.stringify(res[1].result));

      this.spinnerLoading = false;

    });

  }


  onApprove(){

    this.spinnerLoading = true;

    this.customerService.approveUpdateCust(this.mftsCustomer,this.fcCustomer,this.authService.getUserId()).subscribe(res => {
      // console.log('Result>'+JSON.stringify(res));
      this.spinnerLoading = false;
      if(res && res["code"]==='0'){

        this.loadCustData();

        this.toastr.success("Download invertor profile complete.", "Complete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });

      }else{
        this.toastr.warning(res.message, "Incomplete", {
          timeOut: 5000,
          closeButton: true,
          positionClass: "toast-top-center"
        });
      }
    });


  }
}
