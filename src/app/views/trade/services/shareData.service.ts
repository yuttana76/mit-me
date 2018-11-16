import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

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
