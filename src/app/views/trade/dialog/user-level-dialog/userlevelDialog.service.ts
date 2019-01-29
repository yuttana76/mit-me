import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserLevelDialogFormService {

  userlevelDialog_title = 'Add user level';

  application_label = 'Choose application';
  level_label = 'Choose Level';
  status_label = 'Choose Status';
  expire_label = 'Set expire date';
  remark_label = 'Leave a Remark';

  save_btn = 'Save';
  close_btn = 'Close';
}
