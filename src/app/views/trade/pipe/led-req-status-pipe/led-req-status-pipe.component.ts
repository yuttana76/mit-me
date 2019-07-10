import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';

@Pipe ({
  name : 'ledReqStatus'
})
export class LedReqStatusPipeComponent implements PipeTransform  {

  transform(val : string) : string {

      let valTxt = 'N/A';

      if(val === '20001'){
        valTxt ='พบทรัพย์'

      }else if(val === '20002'){
        valTxt ='ไม่พบทรัพย์'
      }

    return valTxt
 }

}
