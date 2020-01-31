import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer.model';

  export class OrgCustomer {
  Cust_Code : string;
  Card_Type : string;
  Group_Code : string;
  Title_Name_T : string;
  First_Name_T : string;
  Last_Name_T : string;
  Title_Name_E : string;
  First_Name_E : string;
  Last_Name_E : string;
  Birth_Day : string;
  Nation_Code : string;
  Sex : string;
  Tax_No : string;
  Mobile : string;
  Email : string;
  MktId : string;
}


@Component({
  selector: 'app-fc-inves-comp-dialog',
  templateUrl: './fc-inves-comp-dialog.component.html',
  styleUrls: ['./fc-inves-comp-dialog.component.scss']
})
export class FcInvesCompDialogComponent implements OnInit {

  mftsCustomer:OrgCustomer;
  fundConnextCustomer:any;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public custCode: any,
    public customerService: CustomerService,
  ) { }

  ngOnInit() {
    this.mftsCustomer= new OrgCustomer();

    this.customerService.getInvestorComparision(this.custCode).subscribe(res => {
      // this.mftsCustomer = customer;

      console.log(JSON.stringify(res));

      this.mftsCustomer= JSON.parse(JSON.stringify(res[0].result[0]));
      console.log(this.mftsCustomer.Cust_Code);
  });
  }


  onApprove(){

  }
}
