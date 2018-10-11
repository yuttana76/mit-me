
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
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

  private WF_REJECTED = 'REJECTED';
  private wfMsgListtener = new Subject<{msgType: string , msg: string}>();

  constructor(private http: HttpClient , private router: Router, private mailService: MailService) { }

  getWfMsgListener() {
    return this.wfMsgListtener.asObservable();
}


  getWorkFlow(appRef: string) {
    return this.http.get<{result: any }>(BACKEND_URL + appRef )
    .pipe(map( fundtData => {
      return fundtData.result.map(data => {
        const vCanAction = false;
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
            CanAction: vCanAction,
        };
      });
    }));
  }

  updateWorkFlow(workFlowTrans: WorkFlowTrans) {

    const data = {
      'workFlowTrans': JSON.stringify(workFlowTrans)
      };
       // Update WF Status
    this.http
        .put(BACKEND_URL + workFlowTrans.wfRef, data)
        .subscribe(response => {
          this.workFLowGoNext(workFlowTrans.AppRef);
        });

    // Update WF Status
    // this.http
    //     .put(BACKEND_URL + workFlowTrans.wfRef, workFlowTrans)
    //     .subscribe(response => {
    //       this.workFLowGoNext(workFlowTrans.AppRef);
    //     });
  }
// *********************************
  workFLowGoNext(appRef: string) {

     let workFlowTransList: WorkFlowTrans[];
     let workFlowTrans: WorkFlowTrans;

    this.getWorkFlow(appRef).subscribe(data => {
      workFlowTransList = data;
      // Step #1  Check for Reject
      workFlowTrans = workFlowTransList.filter(function (i, n) {
              return i.WFStatus === 'R';
            })[0];

      if (workFlowTrans) {
        // console.log('REJECTED Send mail to owner');
        this.wfMsgListtener.next({msgType: 'danger' , msg: workFlowTrans.AppRef + ' Work Flow rejected will send mail to owner'});

      } else {

        // Step #2 Check for next
        workFlowTrans = workFlowTransList.filter(function (i, n) {
          return i.WFStatus === 'N';
        })[0];

        if (workFlowTrans) {
          // NEXT STEP Send mail to next approver
          // tslint:disable-next-line:max-line-length
          this.wfMsgListtener.next({msgType: 'info' , msg: ' Work Flow will process to next step(User level ' + workFlowTrans.SeqNo + ').'});

        } else {
          // COMPLETE  Send mail to Owner
          this.wfMsgListtener.next({msgType: 'success' , msg: appRef + ' Work Flow complete will send mail to owner'});
        }

      }

    });
  }

}
