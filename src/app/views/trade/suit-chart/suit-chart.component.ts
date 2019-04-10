import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-suit-chart',
  templateUrl: './suit-chart.component.html',
  styleUrls: ['./suit-chart.component.scss']
})
export class SuitChartComponent implements OnInit {

  @Input() riskLevel: string;

    // Pie
    public pieChartLabels_1: string[] = ['เงินฝากและ ตราสารหนี้ระยะสั้น & เงินฝากและ ตราสารหนี้ระยะสั้น >60% ', 'ตราสารหนี้ ภาคเอกชน <20%', 'ตราสารทุน <10%','การลงทุนทางเลือก <5%'];
    public pieChartData_1: number[] = [60, 20, 10,5];

    public pieChartLabels_2: string[] = ['เงินฝากและ ตราสารหนี้ระยะสั้น <20%' ,' เงินฝากและ ตราสารหนี้ระยะสั้น  & ตราสารหนี้ ภาคเอกชน <70%', 'ตราสารทุน <20%','การลงทุนทางเลือก <10%'];
    public pieChartData_2: number[] = [20, 70, 20,10];

    public pieChartLabels_3: string[] = ['เงินฝากและ ตราสารหนี้ระยะสั้น <10%' ,' เงินฝากและ ตราสารหนี้ระยะสั้น  & ตราสารหนี้ ภาคเอกชน <60%', 'ตราสารทุน <30%','การลงทุนทางเลือก <10%'];
    public pieChartData_3: number[] = [10, 60, 30,10];

    public pieChartLabels_4: string[] = ['เงินฝากและ ตราสารหนี้ระยะสั้น <10%' ,' เงินฝากและ ตราสารหนี้ระยะสั้น  & ตราสารหนี้ ภาคเอกชน <40%', 'ตราสารทุน <40%','การลงทุนทางเลือก <20%'];
    public pieChartData_4: number[] = [10, 40, 40,20];

    public pieChartLabels_5: string[] = ['เงินฝากและ ตราสารหนี้ระยะสั้น <5%' ,' เงินฝากและ ตราสารหนี้ระยะสั้น  & ตราสารหนี้ ภาคเอกชน <30%', 'ตราสารทุน <60%','การลงทุนทางเลือก <30%'];
    public pieChartData_5: number[] = [5, 30, 60,30];

    public pieChartType = 'pie';


  constructor() {


  }

  ngOnInit() {

  }

    // events
    public chartClicked(e: any): void {
      console.log(e);
    }

    public chartHovered(e: any): void {
      console.log(e);
    }

    public getChartData(){
      console.log('riskLevel >>' + this.riskLevel);

      if(this.riskLevel === '1'){
        return this.pieChartData_1;

      }else if(this.riskLevel === '2'){
        return this.pieChartData_2;
      }else if(this.riskLevel === '3'){
        return this.pieChartData_3;
      }else if(this.riskLevel === '4'){
        return this.pieChartData_4;
      }else if(this.riskLevel === '5'){
        return this.pieChartData_5;

      }


    }

    public getChartLabels(){

      if(this.riskLevel === '1'){
        return this.pieChartLabels_1;

      }else if(this.riskLevel === '2'){
        return this.pieChartLabels_2;

      }else if(this.riskLevel === '3'){
        return this.pieChartLabels_3;
      }else if(this.riskLevel === '4'){
        return this.pieChartLabels_4;
      }else if(this.riskLevel === '5'){
        return this.pieChartLabels_5;

      }

    }
}
