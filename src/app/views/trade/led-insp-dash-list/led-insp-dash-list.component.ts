import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-led-insp-dash-list',
  templateUrl: './led-insp-dash-list.component.html',
  styleUrls: ['./led-insp-dash-list.component.scss']
})
export class LedInspDashListComponent implements OnInit {


  led_state;
  chooseDate

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {


      if (paramMap.has('chooseDate')) {
        this.chooseDate = paramMap.get('chooseDate');
      }

      if (paramMap.has('led_state')) {
        this.led_state = paramMap.get('led_state');
      }

   });

  }

}
