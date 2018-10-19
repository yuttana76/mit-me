import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { WorkFlowTrans } from '../model/workFlowTrans.model';
import { MailService } from './mail.service';
import { Mail } from '../model/mail.model';
import { WipCustomerService } from './wipCustomer.service';
import { UserService } from './user.service';

const BACKEND_URL = environment.apiURL + '/workFlow/';


@Injectable({ providedIn: 'root' })
export class WorkFlowService {

  private wfMsgListtener = new Subject<{msgType: string , msg: string}>();
  // private MAIL_FORM = 'it@Merchantasset.co.th';

  constructor(
    private http: HttpClient ,
    private router: Router,
    private mailService: MailService,
    private wipCustomerService: WipCustomerService,
    private userService: UserService
    ) { }

  getWfMsgListener() {
    return this.wfMsgListtener.asObservable();
}

  getWorkFlow(appRef: string) {
    const queryParams = `?appRef=${appRef}`;
    return this.http.get<{result: any }>(BACKEND_URL + '/wfByAppRef' + queryParams )
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
            AppLink: data.AppLink,
            AppGroup: data.AppGroup,
            AppName: data.AppName
        };
      });
    }));
  }

  getCurrentLevel(wfRef: string) {
    const queryParams = `?wfRef=${wfRef}`;
    return this.http.get<{result: any }>(BACKEND_URL + '/currentLevel' + queryParams )
    .pipe(map( fundtData => {
      return fundtData.result.map(data => {
        return {
            wfRef: wfRef,
            AppId: data.AppId,
            Flow: data.Flow,
            Level: data.Level,
            USERID: data.USERID,
            EMAIL: data.EMAIL,
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
          this.workFLowGoNext(workFlowTrans.AppRef, workFlowTrans.wfRef, workFlowTrans.ActionBy);
        });

  }
// *********************************
  workFLowGoNext(appRef: string, wfRef: string, actionBy: string) {

     let workFlowTransList: WorkFlowTrans[];
     let workFlowTrans: WorkFlowTrans;

    this.getWorkFlow(appRef).subscribe(data => {
      workFlowTransList = data;
      // Step #1  Check for Reject
      workFlowTrans = workFlowTransList.filter(function (i, n) {
              return i.WFStatus === 'R';
            })[0];

      if (workFlowTrans) {
        // # REJECTED ! Send mail to owner
        // console.log('REJECTED Send mail to (OWNER)' + JSON.stringify(workFlowTrans));
        // // SEND MAIL TO OWNER
        this.mail2Owner(workFlowTrans,'reject');


        this.wfMsgListtener.next({msgType: 'danger' , msg: workFlowTrans.AppRef + ' Work Flow rejected will send mail to owner'});

      } else {

        // Step #2 Check for next
        workFlowTrans = workFlowTransList.filter(function (i, n) {
          return i.WFStatus === 'N';
        })[0];

        if (workFlowTrans) {
          // NEXT STEP Send mail to next approver
          this.wfMsgListtener.next({msgType: 'info' ,
              msg: ' Work Flow will process to next step(User level ' + workFlowTrans.Level + ').'});
          // this.mail2Next(workFlowTrans,'next');
          this.getCurrentLevel(workFlowTrans.wfRef).subscribe(data => {

            // console.log( 'WF  next >>', JSON.stringify(data));
            this.mail2Next(workFlowTrans.AppRef, data);

          });

        } else {
          // COMPLETE  RESTORE here !  & Send mail to Owner
          this.wipCustomerService.restoreWIPCustomer(wfRef, actionBy).subscribe(result => {
              console.log('workFlow.service  COMPLETE>>' + JSON.stringify(result));
          });

          // Call RESTORE function
          this.wfMsgListtener.next({msgType: 'success' , msg: appRef + ' Work Flow complete will send mail to owner'});
          this.mail2Owner(workFlowTrans,'finish');
        }
      }

    });
  }

  mail2Owner(workFlowTrans: WorkFlowTrans , wfFlag: string) {
    let subject: string ;
    let msg: string;

    if ( wfFlag === 'reject' ) {
      subject = `Work Flow ${workFlowTrans.AppRef} was reject.`;
      msg = ' was reject. Please recheck the data again.';

    } else if ( wfFlag === 'finish' ) {
      subject = `Work Flow ${workFlowTrans.AppRef} was finish .Please action for next step.`;

    }
    if (subject) {
      this.userService.getUserInfo(workFlowTrans.CreateBy).subscribe( data => {

        if (data[0]) {
          const _mail: Mail = new Mail();
          // _mail.form = this.MAIL_FORM;
          _mail.to = data[0].EMAIL;
          _mail.subject = subject;
          _mail.msg = `
          <p>
            Work Flow ${workFlowTrans.AppRef}  ${msg}.
          </p>
          <p>
            Comment ${workFlowTrans.Comment}
          </p>
          <p>
            Action by ${workFlowTrans.ActionBy}
          </p>
          `;
          this.mailService.sendMail(_mail);
        } else {
          console.log('REJECT Not found mail of creator.');
        }
      });
    }
  }

  // [{"wfRef":"2018-10-16-102228330","AppId":"App1","Flow":"approve(2)","Level":4,"USERID":"bom@gmail.com","EMAIL":"bom@gmail.com"}]
  mail2Next(appRef: string, data: any[]) {

    const subject = `Work Flow ${appRef} was sent to you .Please action for next step.`;

    console.log('mail2Next() >> ', data[0].EMAIL);
          const _mail: Mail = new Mail();
          // _mail.form = this.MAIL_FORM;
          _mail.to = data[0].EMAIL;
          _mail.subject = subject;
          _mail.msg = `
          <p>
            ${subject}
          </p>
          `;
          this.mailService.sendMail(_mail);

    }
}
