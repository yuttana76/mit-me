import { Injectable } from '@angular/core';
import { Question } from '../model/question.model';
import { Choice } from '../model/choice.model';
// import { Choice, Question } from '../suit-tree-view/questionBAK';


@Injectable({
  providedIn: 'root'
})
export class FcIndCustomer {
  from_title = 'Customer Infomation';

  cardNumber='No';
  thFirstName='First name';
  thLastName='Last name';

}
