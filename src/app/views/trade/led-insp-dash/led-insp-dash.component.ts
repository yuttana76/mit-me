import { Component, OnInit } from '@angular/core';
import { LEDService } from '../services/led.service';
import { forkJoin } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-led-insp-dash',
  templateUrl: './led-insp-dash.component.html',
  styleUrls: ['./led-insp-dash.component.scss']
})
export class LedInspDashComponent implements OnInit {

  spinnerLoading = false;
  public chooseDate = new Date();
  public chooseDateTxt;
  _ledDataToday;
  _cntInspToday;
  _cntFreezeToday;

  _cntInspectAll;
  _cntFreezeAll;

  constructor(
    private ledService:LEDService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    const observables = [];

    // Count current date
    this.chooseDateTxt = formatDate(new Date(), 'yyyy-MM-dd', 'en') ;
    this.getCountByDate(this.chooseDateTxt);

    // count all data
    observables.push(this.ledService.getCntOnInspection());
    observables.push(this.ledService.getCntOnFreeze());

    const example = forkJoin(observables);
    const subscribe = example.subscribe((result:any) => {
      this._cntInspectAll =   JSON.parse(JSON.stringify(result[0])).result;
      this._cntFreezeAll =   JSON.parse(JSON.stringify(result[1])).result;
    });

  }


  onChangeDate(event: MatDatepickerInputEvent<Date>) {
    this.chooseDateTxt = formatDate(event.value, 'yyyy-MM-dd', 'en')
    this.getCountByDate(this.chooseDateTxt)

  }


  getCountByDate(_date){
    this.spinnerLoading = true;
    this.ledService.getCntByDate(_date).subscribe(data =>{
      console.log("getCntByDate() >> " +  JSON.stringify(data) );
      this.spinnerLoading = false;
      if(data && data.result){
        this._ledDataToday = data.result.CNT_ALL;
        this._cntInspToday = data.result.CNT_INSP;
        this. _cntFreezeToday = data.result.CNT_FREEZE;

      }

   });
  }


}
