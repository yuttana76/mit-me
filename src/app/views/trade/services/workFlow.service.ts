
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

const BACKEND_URL = environment.apiURL + '/workFlow/';

@Injectable({ providedIn: 'root' })
export class WorkFlowService {


  constructor(private http: HttpClient , private router: Router) { }

  getWorkFlow(id: string) {
    return this.http.get<{result: any }>(BACKEND_URL + id )
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


  upWorkFlow(wfRef: string, SeqNo: string, WFStatus: string, Comment: string, ActionBy: string) {

    const workFlowTrans: WorkFlowTrans = { wfRef: wfRef,
      Method: null,
      SeqNo: Number(SeqNo),
      Flow: null,
      Level: null,
      WFStatus: WFStatus,
      Comment: Comment,
      CreateBy: null,
      CreateDate: null,
      ActionBy: ActionBy,
      ActionDate: null,
      AppRef: null,
      AppId: null};

    this.http
        .put(BACKEND_URL + wfRef, workFlowTrans)
        .subscribe(response => {
            // const updatedPosts = [...this.posts];
            // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            // updatedPosts[oldPostIndex] = post;
            // this.posts = updatedPosts;
            // this.postUpdated.next([...this.posts]);
            // this.router.navigate(['/']);
        });
}

}
