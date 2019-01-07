import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnoucementDialogFormService {

  from_title = 'Anoucement & News';

  id = 'Id';
  topic_label = 'Topic';
  category_label = 'Category';
  status_label = 'Status';
  anouceDate_label = 'Publish Date';
  from_label = 'Source From';
  type_label = 'Source Type';
  path_label = 'Source path';
  content_label = 'Content';

  submit_btn = 'Save';
  update_btn = 'Update';
  close_btn = 'Close';
  back_btn = 'Go Back';

}
