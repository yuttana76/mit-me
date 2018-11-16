import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserGroupFormService {

  userGroup_title = 'User Group';
  add_label = 'Add Group';
  remove_label = 'Remove';

  tbNo_label = 'No';
  tbGroupName_label = 'Group';
  tbStatus_label = 'Status';
  tbExpDate_label = 'Expire Date';
  tbAction_label = 'Action';

}
