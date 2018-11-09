import { Component, OnInit, OnDestroy } from '@angular/core';
import { Group } from '../model/group.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GroupFormService } from './groupForm.service';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-mit-group',
  templateUrl: './mit-group.component.html',
  styleUrls: ['./mit-group.component.scss']
})
export class MitGroupComponent implements OnInit , OnDestroy {

  spinnerLoading = false;

  displayedColumns: string[] = ['index', 'Id', 'Name',  'Action'];
  dataSource = new BehaviorSubject([]);
  groupList: Group[];
  private groupSub: Subscription;

  constructor(
    public formService: GroupFormService,
    private groupService: GroupService
  ) { }

  ngOnInit() {

    this.spinnerLoading = true;

    this.groupService.getGroup();
    this.groupSub = this.groupService.getGroupListener().subscribe((data: Group[]) => {
      this.spinnerLoading = false;
      this.groupList = data;
      this.dataSource.next(this.groupList);
    }
    );

  }

  ngOnDestroy() {
    this.groupSub.unsubscribe();
  }

}
