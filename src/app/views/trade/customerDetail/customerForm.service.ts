import { Injectable } from '@angular/core';

@Injectable()
export class CustomerFormService {

  validationMessages: any;

  // Formats
  dateFormat = 'm/d/yyyy';
  timeFormat = 'h:mm AM/PM';

}
