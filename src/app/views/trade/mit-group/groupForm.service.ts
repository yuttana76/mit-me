import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GroupFormService {

  // Label
  from_title = 'Group information';
  addNewBtn = 'Add new ';
  editAction = 'Edit';

  tbNo = 'No';
  tbId = 'ID';
  tbGroupName = 'Group Name';
  tbAuthority = 'Authority';
  tbAction = 'Action';

  constructor() { }

}
