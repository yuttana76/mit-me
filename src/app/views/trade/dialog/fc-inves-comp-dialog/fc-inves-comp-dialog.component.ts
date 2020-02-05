import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer.model';
import { fcIndCustomer } from '../../model/fcIndCustomer.model';
import { ToastrService } from 'ngx-toastr';
import { AddrCustModel } from '../../model/addrCust.model';
import { PersonModel } from '../../model/person.model';

@Component({
  selector: 'app-fc-inves-comp-dialog',
  templateUrl: './fc-inves-comp-dialog.component.html',
  styleUrls: ['./fc-inves-comp-dialog.component.scss']
})
export class FcInvesCompDialogComponent implements OnInit {

  CAN_APPROVE_CUST_INFO:true;

  mftsCustomer:any;
  fcCustomer:any;

  fundConnextCustomer:any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public custCode: any,
    public customerService: CustomerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {

    this.mftsCustomer= new Customer();
    this.fcCustomer= new fcIndCustomer();
    this.fcCustomer.residence = new AddrCustModel();
    this.fcCustomer.current = new AddrCustModel();
    this.fcCustomer.work = new AddrCustModel();
    // this.fcCustomer.children = new PersonModel();
    this.fcCustomer.children = [];

    this.customerService.getInvestorComparision(this.custCode).subscribe(res => {

      this.mftsCustomer= JSON.parse(JSON.stringify(res[0].result[0]));
      // this.fcCustomer= JSON.parse(JSON.stringify(res[1].result[0]));
      this.fcCustomer= JSON.parse(JSON.stringify(res[1].result));

      console.log("children>>" + JSON.stringify(this.fcCustomer.children));
  });

  }


  onApprove(){

    var actionBy = 'SYSTEM';

    this.customerService.approveUpdateCust(this.mftsCustomer,this.fcCustomer,actionBy).subscribe(res => {
      console.log('Result>'+JSON.stringify(res));
      if(res && res["code"]==='0'){
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
