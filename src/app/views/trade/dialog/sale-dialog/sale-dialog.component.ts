import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, PageEvent } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sale } from '../../model/sale.model';
import { SaleAgentService } from '../../services/saleAgent.service';
@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.scss']
})
export class SaleDialogComponent implements OnInit {

  spinnerLoading = false;
  form: FormGroup;
  sales: Sale[] = [];
  rowSelected: Sale;
  private salesSub: Subscription;


  displayedColumns = ['checked','User_Code', 'Full_Name', 'License_Code'];
  dataSource = new BehaviorSubject([]);

  currentPage = 1;
  rowsPerPage = 10;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];

  constructor(
    private saleAgentService: SaleAgentService,
    public thisDialogRef: MatDialogRef<SaleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    this.form = new FormGroup({
      userCode: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onCloseConfirm() {
    this.thisDialogRef.close(this.rowSelected);
  }
  onCloseCancel() {
    this.thisDialogRef.close('close');
  }

  onRowClicked(row) {
    this.rowSelected = row;
  }

  onSubmit() {
    if (this.form.invalid) {
      return true;
    }

    this.spinnerLoading = true;
    // Assign conditions
    this.saleAgentService.getSales(this.rowsPerPage, 1, this.form.value.userCode);
    this.salesSub = this.saleAgentService.getSalesUpdateListener().subscribe((sales: Sale[]) => {
          this.spinnerLoading = false;
          this.sales = sales;
          this.dataSource.next(this.sales);
      });
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.spinnerLoading = true;
    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

    console.log('Condition>>', this.form.value.userCode);
    this.saleAgentService.getSales(this.rowsPerPage, this.currentPage, this.form.value.userCode);
    this.salesSub = this.saleAgentService.getSalesUpdateListener().subscribe((sales: Sale[]) => {
          this.spinnerLoading = false;
          this.sales = sales;
          this.dataSource.next(this.sales);
      });
  }


}
