import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserGroupDialogFormService {

  userGroupDialog_title = 'Add user group';

  group_label = 'Choose Group';
  status_label = 'Choose Status';
  expire_label = 'Set expire date';
  remark_label = 'Leave a Remark';

  save_btn = 'Save';
  close_btn = 'Close';
}
