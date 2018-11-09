import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GroupFormService {

  // Label
  from_title = 'Group information';
  addNewBtn = 'Add new group';
  editAction = 'Edit';

  tbNo = 'No';
  tbId = 'ID';
  tbGroupName = 'Group Name';
  tbAction = 'Action';

  constructor() { }

}
