import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserListFormService {

  validationMessages: any;

  // Formats
  dateFormat = 'dd/mm/yyyy';
  timeFormat = 'h:mm AM/PM';

  // Label
  from_title = 'Search User';
  login_label = 'Login';
  fullName_label = 'Name';
  email_label = 'Email';
  department_label = 'Department';

  Result_label = 'Result';

  // Label Action
  search_btn = 'Search';
  clear_btn = 'Back';

  constructor() { }

}
