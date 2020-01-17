import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchActionDialogService {
  _COMPLETE = 'Complete';
  _INCOMPLETE = '  Incomplete';

  SAVE_COMPLETE = 'Save complete';
  SAVE_INCOMPLETE = 'Save  incomplete';

}
