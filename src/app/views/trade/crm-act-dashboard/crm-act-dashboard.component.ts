import {
  Component,
  OnInit,

  ViewChild,

} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-crm-act-dashboard',
  templateUrl: './crm-act-dashboard.component.html',
  styleUrls: ['./crm-act-dashboard.component.scss']
})
export class CrmActDashboardComponent implements OnInit {
  @ViewChild('modalContent', {static: false})

// barChart
public barChartOptions: any = {
  scaleShowVerticalLines: false,
  responsive: true
};
public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
// public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
public barChartType = 'bar';
public barChartLegend = true;

public barChartData: any[] = [
  {data: [65, 59, 80, 81, 56, 55, 40], label: 'Task'},
  // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
];


  constructor() {}

  ngOnInit() {
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
