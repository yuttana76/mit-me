import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserLevel } from '../model/userLevel.model';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent implements OnInit {


  @Input() userId: string;

  displayedColumns: string[] = ['index', 'Group', 'Status', 'Expire', 'Action'];
  dataSource = new BehaviorSubject([]);
  userLevelList: UserLevel[] = [];
  private userLevelSub: Subscription;

  constructor() { }

  ngOnInit() {
  }

  onDeleteGroup(_userId, _groupId) {
    console.log(`onDeleteGroup ..  ${_userId} - ${_groupId}`);

  }

}
