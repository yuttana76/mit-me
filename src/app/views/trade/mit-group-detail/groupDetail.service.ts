import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupDetailFormService {

  // Formats
  dateFormat = 'm/d/yyyy';
  timeFormat = 'h:mm AM/PM';

  // Label
  from_title = 'Group information';
  g_id_label = 'Group ID';
  g_name_label = 'Group Name';
  submit_btn = 'Save';

  authority_title = 'Authority';
  AddAuthority_btn = 'Add Authority';

  tbNo = 'No';
  tbApp = 'Application' ;
  tbStatus = 'Status';
  tbExp = 'Expire';
  tbCreate = 'Create';
  tbEdit = 'Edit';
  tbDelete = 'Delete';
  tbView = 'View';
  tbAction = 'Action';
  del_tip = 'Delete';

}
