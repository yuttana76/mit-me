import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnoucementFormService {
  // Label
  from_title = 'Anoucement';
  addNewBtn = 'Add New ';
  editAction = 'Edit';
  removeAction = 'Remove';


  tb_date = 'Date';
  tb_category = 'Category';
  tb_from = 'From';
  tb_topic = 'Topic';
  tb_action = 'Action';
}
