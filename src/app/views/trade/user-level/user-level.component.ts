import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserLevel } from '../model/userLevel.model';

@Component({
  selector: 'app-user-level',
  templateUrl: './user-level.component.html',
  styleUrls: ['./user-level.component.scss']
})
export class UserLevelComponent implements OnInit {

  @Input() userId: string;

  displayedColumns: string[] = ['index', 'Application', 'Level', 'Status', 'Expire', 'Action'];
  dataSource = new BehaviorSubject([]);
  userLevelList: UserLevel[] = [];
  private userLevelSub: Subscription;

  constructor() { }

  ngOnInit() {

  }

  onDeleteLevel(_userId, _appId) {
    console.log(`onDeleteLevel ..  ${_userId} - ${_appId}`);

  }

}
