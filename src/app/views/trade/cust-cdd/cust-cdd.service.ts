import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class CustCddFormService {

  from_title = 'CDD Information';

  // Action response
  SAVE_COMPLETE = ' Save complete';
  SAVE_INCOMPLETE = ' Save incomplete';

  // Label
  REQ_MODIFY = 'ต้องการแก้ไขข้อมูล';

  LABEL_PERSON_INFO = 'ข้อมูลส่วนบุคคล';
  LABEL_BACKGROUND = 'ข้อมูลเพิ่มเติม';


}
