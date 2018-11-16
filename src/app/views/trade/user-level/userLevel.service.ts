import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserLevelFormService {

  userLevel_title = 'User Level';
  addLevel_label = 'Add Level';
  remove_label = 'Remove';

  tbNo_label = 'No';
  tbApplication_label = 'Application';
  tbLevel_label = 'Level';
  tbStatus_label = 'Status';
  tbExpDate_label = 'Expire Date';
  tbAction_label = 'Action';

}
