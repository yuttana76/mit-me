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

  menuGroupList = [
    {
      code: 'Applications',
      desc: 'Applications'
    },
    {
      code: 'Report & Enquiry',
      desc: 'Report & Enquiry'
    },
    {
      code: 'Setting',
      desc: 'Setting'
     }
  ];

  menuSequence = [
    {
      code: 1,
      desc: '1'
    },
    {
      code: 2,
      desc: '2'
    },
    {
      code: 3,
      desc: '3'
     },
     {
      code: 4,
      desc: '4'
     },
     {
      code: 5,
      desc: '5'
     }
  ];


  constructor() { }

}
