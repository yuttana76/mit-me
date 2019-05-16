import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-led-insp-result',
  templateUrl: './led-insp-result.component.html',
  styleUrls: ['./led-insp-result.component.scss']
})
export class LedInspResultComponent implements OnInit {

  currentPage = 1;
  rowsPerPage = 20;
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  displayedColumns: string[] = ['Cust_Code', 'FullName', 'cust_source', 'led_code', 'TMPDate','ABSDate','DFDate','BRKDate','Action'];
  dataSource = new BehaviorSubject([]);

  constructor() { }

  ngOnInit() {
  }

  onChangedPage(pageData: PageEvent) {

    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

  }
}
