import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class CustAddrFormService {

  from_title = 'Address Information';

  // Action response
  SAVE_COMPLETE = ' Save complete';
  SAVE_INCOMPLETE = ' Save incomplete';

  // Label
  REQ_MODIFY = 'ต้องการแก้ไขข้อมูล';

  // Addr No
  // Moo
  // Place
  // Floor
  // Soi
  // Road
  // Coutry
  // Please choose Coutry.
  // Province
  // Please choose Province.
  // Districe
  // Sub District
  // Please choose Sub District.
}
