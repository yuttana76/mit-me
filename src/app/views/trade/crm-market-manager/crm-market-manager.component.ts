import { Component, OnInit } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-crm-market-manager',
  templateUrl: './crm-market-manager.component.html',
  styleUrls: ['./crm-market-manager.component.scss']
})
export class CrmMarketManagerComponent implements OnInit {


// lineChart
public lineChartData: Array<any> = [
  {data: [65, 59, 80, 81, 56,,,,,,,], label: 'LBDU'},
  {data: [28, 48, 40, 19, 86,,,,,,,], label: 'Privte'},
  {data: [18, 48, 77, 9, 200,,,,,,,], label: 'Bond'}
];

public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];
public lineChartOptions: any = {
  animation: false,
  responsive: true
};
public lineChartColours: Array<any> = [
  { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  },
  { // dark grey
    backgroundColor: 'rgba(77,83,96,0.2)',
    borderColor: 'rgba(77,83,96,1)',
    pointBackgroundColor: 'rgba(77,83,96,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  },
  { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
public lineChartLegend = true;
public lineChartType = 'line';


productList = [{
  code:'0',
  desc:'All',
  },
  {
    code:'LBDU',
    desc:'LBDU',
  },
  {
    code:'PF',
    desc:'Private fund',
  },
  {
    code:'BOND',
    desc:'Bond',
  },
];
  constructor() {

  }

  ngOnInit() {
  }

}
