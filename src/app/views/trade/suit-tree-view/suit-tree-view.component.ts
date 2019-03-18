import { Component, OnInit, Input } from '@angular/core';
// import { Question } from './questionBAK';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Question } from '../model/question.model';


@Component({
  selector: 'app-suit-tree-view',
  templateUrl: './suit-tree-view.component.html',
  styleUrls: ['./suit-tree-view.component.scss']
})
export class SuitTreeViewComponent  {

  @Input() questions: Array<Question>;
  @Input() questionDisabled: true;


}
