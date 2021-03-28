import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MitLedInspCust } from '../model/mitLedInspCust.model';

@Component({
  selector: 'app-led-insp-result',
  templateUrl: './led-insp-result.component.html',
  styleUrls: ['./led-insp-result.component.scss']
})
export class LedInspResultComponent implements OnInit {

  @Input() currentPage = 1;
  @Input() rowsPerPage = 20;
  @Input() dataSource = new BehaviorSubject([]);
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  displayedColumns: string[] = ['Cust_Code', 'FullName', 'cust_source', 'led_code', 'TMPDate','ABSDate','DFDate','BRKDate','Action'];


  constructor() { }

  ngOnInit() {
    // console.log("INSP result>>" + JSON.stringify(this.mitLedInspCustList))
  }

  onChangedPage(pageData: PageEvent) {

    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;

  }
}
