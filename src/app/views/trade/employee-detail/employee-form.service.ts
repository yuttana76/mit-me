import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFormService {

  validationMessages: any;

  // Formats
  dateFormat = 'dd/mm/yyyy';
  timeFormat = 'h:mm AM/PM';

  // Label
  from_title = 'Employee Detail';
  Birth_Day_label = 'Birth Day (' + this.dateFormat + ') ';

  constructor() { }

}
