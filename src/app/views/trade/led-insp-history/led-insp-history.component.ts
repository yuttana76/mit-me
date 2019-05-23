import { Component, OnInit, Input } from '@angular/core';
import { LEDService } from '../services/led.service';
import { MitLedInspHistory } from '../model/mitLedInspHistory.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-led-insp-history',
  templateUrl: './led-insp-history.component.html',
  styleUrls: ['./led-insp-history.component.scss']
})
export class LedInspHistoryComponent implements OnInit {

  @Input() led_inspect_id;

  mitLedInspHistoryArray:MitLedInspHistory[];

  constructor(
    private ledService:LEDService
  ) { }

  ngOnInit() {
    console.log("Initial History  twsid>> " + this.led_inspect_id);

    this.loadHistory();

  }

  public loadHistory(){

    this.ledService.getInspHistory(this.led_inspect_id)
    .subscribe((data: any[]) => {
      this.mitLedInspHistoryArray = data;
      // console.log("Get History >> " + JSON.stringify(this.mitLedInspHistoryArray));
    }, error => () => {
            console.log('Was error', error);
        }, () => {
           console.log('Loading complete');
        });
  }



}
