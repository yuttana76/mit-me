import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  validationMessages: any;

  // Formats
  dateFormat = 'dd/mm/yyyy';
  timeFormat = 'h:mm AM/PM';

  // Label
  from_title = 'User Detail';
  Birth_Day_label = 'Birth Day (' + this.dateFormat + ') ';

  // Label Action
  submit_btn = 'SAVE';
  back_btn = 'BACK';

  constructor() { }

}
