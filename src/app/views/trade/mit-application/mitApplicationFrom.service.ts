import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MitApplicationFormService {

  // Label
  from_title = 'Applications';

  tbNo = 'No';
  tbId = 'ID';
  tbName = 'Name';
  tbGroup = 'Group';
  tbLink = 'Link';
  tbAction = 'Action';

  constructor() { }

}
