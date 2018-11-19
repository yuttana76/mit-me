import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MitApplicationFormService {

  // Label
  from_title = 'Applications';
  addNewBtn = 'Add new application';
  editAction = 'Edit';
  removeAction = 'Remove';

  tbNo = 'No';
  tbId = 'ID';
  tbName = 'Name';
  tbStatus = 'Status';
  tbGroup = 'Group';
  tbLink = 'Link';
  tbMenuOrder = 'Menu Order';
  tbMenuGroup = 'Menu Group';
  tbAction = 'Action';

  constructor() { }

}
