import { Component, OnInit } from '@angular/core';
import { LEDService } from '../services/led.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-led-insp-dash',
  templateUrl: './led-insp-dash.component.html',
  styleUrls: ['./led-insp-dash.component.scss']
})
export class LedInspDashComponent implements OnInit {

  _cntToday;
  _cntInspect;
  _cntFreeze;

  constructor(
    private ledService:LEDService
  ) { }

  ngOnInit() {
    const observables = [];

    observables.push(this.ledService.getCntInspToday());
    observables.push(this.ledService.getCntOnInspection());
    observables.push(this.ledService.getCntOnFreeze());

    const example = forkJoin(observables);
    const subscribe = example.subscribe((result:any) => {
      this._cntToday =   JSON.parse(JSON.stringify(result[0])).result;
      this._cntInspect =   JSON.parse(JSON.stringify(result[1])).result;
      this._cntFreeze =   JSON.parse(JSON.stringify(result[2])).result;
    });

  }

}
