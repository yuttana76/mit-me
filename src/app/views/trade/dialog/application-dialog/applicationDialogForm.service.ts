import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDialogFormService {

  // Label
  from_title = 'Application information';

  id = 'Id';
  name_label = 'Application name';
  group_label = 'Application group.';
  app_link_label = 'Application link';
  status_label = 'Status';
  menuOrder_label = 'Menu Order';
  menuGroup_label = 'Menu Group';


  submit_btn = 'Save';
  update_btn = 'Update';
  close_btn = 'Close';
  back_btn = 'Go Back';
}
