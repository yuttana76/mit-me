import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'personalPipe',
})
export class genderTransform implements PipeTransform {
    transform(val: string) {
      let retTxt = 'N/A';
      if(val === 'M'){
        retTxt ='Male'
      }else if(val === 'F'){
        retTxt ='Female'
      }
      return retTxt

    }
}
