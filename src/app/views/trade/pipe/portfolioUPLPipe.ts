import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormatPipe',
})
export class portfolioUPLPipe implements PipeTransform {
    transform(value: number) {

      //  var datePipe = new DatePipe("en-US");
      //   value = datePipe.transform(value, 'yyyy/MM/dd');
      //   return value;

        if (value>0) {
          return `<span class='green'>xxx ${value}</span>`

          // if (numLetters === undefined) {
          //     var str = text.replace(/#/g, '<span class="red">*</span>');
          //     return str;
          // }

      } else {
          return value;
      }

    }
}
