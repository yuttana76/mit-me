import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MitLedMas } from '../model/mitLedMas.model';
import { BehaviorSubject } from 'rxjs';
import { InspSearch } from '../model/inspSearch.model';
import { ToastrService } from 'ngx-toastr';
import { LEDService } from '../services/led.service';
import { PageEvent } from '@angular/material';


export class LedSearch {
  id: string;
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-led-mas-search',
  templateUrl: './led-mas-search.component.html',
  styleUrls: ['./led-mas-search.component.scss']
})
export class LedMasSearchComponent implements OnInit {

  spinnerLoading = false;
  form: FormGroup;
  ledSearch: LedSearch = new LedSearch();
  mitLedMasList: MitLedMas[] = [];

  // Result table [START]
  currentPage = 1;
  rowsPerPage = 2;
  dataSource = new BehaviorSubject([]);
  totalRecords = 10;
  pageSizeOptions = [10, 20, 50, 100];
  displayedColumns: string[] = ['key','id', 'FullName', 'black_case','red_case','court_name','plaintiff1', 'TMPDate','ABSDate','DFDate','BRKDate','Action'];
  // Result table [END]

  constructor(
    private toastr: ToastrService,
    private ledService:LEDService

  ) { }

  ngOnInit() {


// Initial Form
// this.ledSearch.id="";
// this.ledSearch.firstName="";
// this.ledSearch.lastName="";

this.form = new FormGroup({

  custId: new FormControl(null, {
    // validators: [Validators.required]
  }),
  firstName: new FormControl(null, {
    // validators: [Validators.required]
  }),
  lastName: new FormControl(null, {
    // validators: [Validators.required]
  }),

});
  }

  onSerach() {
    // console.log('onSerachCust ! ');
    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }

    this.spinnerLoading = true;

    this.ledService.getLedMaster(this.rowsPerPage, 1, this.ledSearch.id,this.ledSearch.firstName,this.ledSearch.lastName) .subscribe(data =>{
      this.mitLedMasList = data;
      this.dataSource.next(this.mitLedMasList);
    }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.spinnerLoading = false;
      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;


        if(this.mitLedMasList.length <= 0){
          this.toastr.warning(``,
              "Not found data",
              {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
        }
      }
    );

  }

  onChangedPage(pageData: PageEvent) {

    this.currentPage =  pageData.pageIndex + 1;
    this.rowsPerPage =  pageData.pageSize;
    console.log("currentPage>>" + this.currentPage  + "  ;rowsPerPage>>" + this.rowsPerPage);

    this.spinnerLoading = true;

    this.ledService.getLedMaster(this.rowsPerPage, this.currentPage, this.ledSearch.id,this.ledSearch.firstName,this.ledSearch.lastName) .subscribe(data =>{
      this.mitLedMasList = data;
      this.dataSource.next(this.mitLedMasList);
    }
    , error => {
        console.log("WAS ERR>>" + JSON.stringify(error) );
        this.spinnerLoading = false;
      }
      ,() => {
        // 'onCompleted' callback.
        this.spinnerLoading = false;


        if(this.mitLedMasList.length <= 0){
          this.toastr.warning(``,
              "Not found data",
              {
                timeOut: 5000,
                closeButton: true,
                positionClass: "toast-top-center"
              }
            );
        }
      }
    );

  }

}
