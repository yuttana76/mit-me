import { Injectable, Pipe, PipeTransform } from '@angular/core';


// @Pipe({name: 'statusTransform'})
// export class StatusTransform implements PipeTransform {
//   transform(value: string): string {

//     let newStr: string = '';
//     if (value === 'A') {
//       newStr = 'Active';
//     } else if (value === 'I') {
//       newStr = 'Inactive';
//     } else {
//       newStr = 'N/A';
//     }

//     return newStr;
//   }
// }

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

// Anoucement value
  anouceCategory = [
    {
      code: 'Invest',
      desc: 'Invest'
    },
    {
      code: 'Law',
      desc: 'Law'
    },
    {
      code: 'Info',
      desc: 'Info'
     }
  ];

  anouceSourceType = [
    {
      code: 'link',
      desc: 'link'
    },
    {
      code: 'pdf',
      desc: 'pdf'
    },
    {
      code: 'doc',
      desc: 'doc'
     },
     {
      code: 'content',
      desc: 'content'
     }
  ];

  constructor() { }

}
