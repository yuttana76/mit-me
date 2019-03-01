import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class CustAddrFormService {

  from_title = 'Address Information';

  SAVE_COMPLETE = ' Save complete';
  SAVE_INCOMPLETE = ' Save incomplete';


}
