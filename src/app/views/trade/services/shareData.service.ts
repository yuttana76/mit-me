import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

   DATE_FORMAT = 'DD/MM/YYYY';
   DB_DATE_FORMAT = 'YYYY-MM-DD';

  statusList = [
    {
    code: 'A',
    desc: 'Active'
    },
    {
      code: 'I',
      desc: 'Inactive'
      },
  ];


  constructor() { }

}
