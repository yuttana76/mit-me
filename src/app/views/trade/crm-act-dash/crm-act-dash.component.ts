import { Component, OnInit } from '@angular/core';
// import { ThemeService } from './theme.service';

@Component({
  selector: 'app-crm-act-dash',
  templateUrl: './crm-act-dash.component.html',
  styleUrls: ['./crm-act-dash.component.scss']
})
export class CrmActDashComponent implements OnInit {


  ngOnInit() {
  }

  title = 'mzd-timeline';

  alternateSide: boolean = true;
  firstContentSide: 'left' | 'right' = 'left';

  // constructor(private themeService: ThemeService) { }
  constructor() { }

  setDarkMode(darkMode: boolean) {
    // this.themeService.setDarkMode(darkMode);
  }

}
