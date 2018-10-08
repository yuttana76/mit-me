
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Customer} from '../model/customer.model';
import { environment } from '../../../../environments/environment';
import { CustomerCond } from '../model/customerCond.model';
import { CustAddress } from '../model/custAddress.model';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { MailService } from './mail.service';
import { Mail } from '../model/mail.model';

const BACKEND_URL = environment.apiURL + '/workFlow/';

@Injectable({ providedIn: 'root' })
export class WorkFlowService {


  constructor(private http: HttpClient , private router: Router, private mailService: MailService) { }

  getWorkFlow(appRef: string) {
    return this.http.get<{result: any }>(BACKEND_URL + appRef )
    .pipe(map( fundtData => {
      return fundtData.result.map(data => {
        return {
            wfRef: data.wfRef,
            Method: data.Method,
            SeqNo: data.SeqNo,
            Flow: data.Flow,
            Level: data.Level,
            WFStatus: data.WFStatus,
            Comment: data.Comment,
            CreateBy: data.CreateBy,
            CreateDate: data.CreateDate,
            ActionBy: data.ActionBy,
            ActionDate: data.ActionDate,
            AppRef: data.AppRef,
            AppId: data.AppId,
        };
      });
    }));
  }

    updateWorkFlow(workFlowTrans: WorkFlowTrans) {

    this.http
        .put(BACKEND_URL + workFlowTrans.wfRef, workFlowTrans)
        .subscribe(response => {

            console.log('RS>>' + JSON.stringify(response) );

            if (workFlowTrans.WFStatus === 'R') {
              // SEND MAIL

            } else {

              this.workFLowGoNext(workFlowTrans.AppRef);
            }

        });
  }

  workFLowGoNext(appRef: string) {

     let workFlowTransList: WorkFlowTrans[];
     let workFlowTrans: WorkFlowTrans;
     this.getWorkFlow(appRef).subscribe(data => {
      workFlowTransList = data;
      // Check for Reject
      workFlowTrans = workFlowTransList.filter(function (i, n) {
              return i.WFStatus === 'R';
            })[0];
      if (workFlowTrans) {
        console.log('THIS CODE REJECTED.');
      }

      // Check for next
      workFlowTrans = workFlowTransList.filter(function (i, n) {
                return i.WFStatus === 'N';
              })[0];
        if (workFlowTrans) {
          console.log('NEXT IS >>' , JSON.stringify(workFlowTrans));
        } else {
          // COMPLETE

        }
    });

  }

}
