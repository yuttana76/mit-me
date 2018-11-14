import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Group } from '../model/group.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GroupFormService } from './groupForm.service';
import { GroupService } from '../services/group.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';


@Pipe({name: 'statusTransform'})
export class StatusTransform implements PipeTransform {
  transform(value: string): string {

    let newStr: string = '';
    if (value === 'A') {
      newStr = 'Active';
    } else if (value === 'I') {
      newStr = 'Inactive';
    } else {
      newStr = 'N/A';
    }

    return newStr;
  }
}

@Component({
  selector: 'app-mit-group',
  templateUrl: './mit-group.component.html',
  styleUrls: ['./mit-group.component.scss'],
  providers: [ConfirmationDialogService]
})
export class MitGroupComponent implements OnInit , OnDestroy {

  spinnerLoading = false;

  displayedColumns: string[] = ['index', 'Id', 'Name', 'Status', 'Authority' , 'Action'];
  dataSource = new BehaviorSubject([]);
  groupList: Group[];
  private groupSub: Subscription;

  constructor(
    public formService: GroupFormService,
    private groupService: GroupService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService
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


  // onDelGroup(groupId: string) {
  //   // Dialog confirm
  //   // action
  //   this.groupService.deleteGroup(groupId).subscribe(response => {

  //     console.log(' Delete response >>' , JSON.stringify(response));

  //     this.toastr.success( 'Delete group successful' , 'Delete Successful', {
  //       timeOut: 3000,
  //       positionClass: 'toast-top-center',
  //     });

  //   });
  // }

  public onDelGroup(groupId: string, groupName: string) {

    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete group ${groupName} ?`)
    .then((confirmed) => {
      if ( confirmed ) {
        this.groupService.deleteGroup(groupId).subscribe(response => {

          this.toastr.success( 'Delete group successful' , 'Delete Successful', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
        });
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

}
