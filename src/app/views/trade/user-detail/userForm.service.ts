import { Injectable } from '@angular/core';

export class MasObj {
  code: string;
  desc: string;

}

@Injectable({
  providedIn: 'root'
})
export class UserFormService {

  validationMessages: any;

  // Formats
  dateFormat = 'dd/mm/yyyy';
  timeFormat = 'h:mm AM/PM';
  MODE_CREATE = 'create';
  MODE_EDIT = 'edit';

  // DATA
  // tslint:disable-next-line:whitespace
  statusList: MasObj[] = [{code:'A',desc:'Active'},{code:'I',desc:'Inactive'}];

  // Label
  from_title = 'User Detail';
  user_name_label = 'User Name';
  email_label = 'Email';
  status_label = 'Status';
  empDate_label = 'Employee Date';
  expDate_label = 'Expire Date';

  firstName_label = 'First Name';
  lastName_label = 'Last Name';
  department_label = 'Department';
  position_label = 'Position';
  officePhone_label = 'Office Telephone Number';
  mobPhone_label = 'Mobile Number';
  othEmail = 'Other Email Address';

  user_level_title = 'User Level Setting';
  user_authority_title = 'Authority Setting';
  Birth_Day_label = 'Birth Day (' + this.dateFormat + ') ';

  // Label Action
  submit_btn = 'SAVE';
  back_btn = 'BACK';

  constructor() { }

}
