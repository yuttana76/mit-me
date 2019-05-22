import { Component, OnInit, Input } from '@angular/core';
import { MitLedMas } from '../model/mitLedMas.model';
import { LEDService } from '../services/led.service';

@Component({
  selector: 'app-led-detail',
  templateUrl: './led-detail.component.html',
  styleUrls: ['./led-detail.component.scss']
})
export class LedDetailComponent implements OnInit {

  @Input() twsid;
  ledMas:MitLedMas = new MitLedMas();

  constructor(
    private ledService:LEDService
  ) { }

  ngOnInit() {

    this.ledService.getLEDMasterBykey(this.twsid)
        .subscribe((data: any[]) => {
          this.ledMas  = data[0];
        });
  }

}
