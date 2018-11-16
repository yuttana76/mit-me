import { Component, OnInit, OnDestroy } from '@angular/core';
import {MitApplicationFormService} from './mitApplicationFrom.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Application } from '../model/application.model';
import { ApplicationService } from '../services/application.service';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { ApplicationDialogComponent } from '../dialog/application-dialog/application-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-mit-application',
  templateUrl: './mit-application.component.html',
  styleUrls: ['./mit-application.component.scss'],
  providers: [ConfirmationDialogService]
})
export class MitApplicationComponent implements OnInit , OnDestroy {

  spinnerLoading = false;

  displayedColumns: string[] = ['index', 'AppId', 'AppName', 'AppGroup', 'AppLink', 'Action'];
  dataSource = new BehaviorSubject([]);
  applicationList: Application[];
  private applicationSub: Subscription;

  applicationDialogComponent: MatDialogRef<ApplicationDialogComponent>;

  constructor(
    public formService: MitApplicationFormService,
    private applicationService: ApplicationService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,

    ) { }

  ngOnInit() {

    this.spinnerLoading = true;

    this.applicationService.getApplication();
    this.applicationSub = this.applicationService.getApplicationListener().subscribe((data: Application[]) => {
      this.spinnerLoading = false;
      this.applicationList = data;
      this.dataSource.next(this.applicationList);
    }
    );
  }

  ngOnDestroy() {
    this.applicationSub.unsubscribe();
  }

  public onDelete(appId: string, appName: string) {

    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete  ${appName}  application?`)
    .then((confirmed) => {
      if ( confirmed ) {
        this.applicationService.deleteApplication(appId).subscribe(response => {

          this.toastr.success( 'Delete group successful' , 'Delete Successful', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
        });
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }


  onEdit(app: Application) {
    console.log('Edit>>' , JSON.stringify(app));
    this.applicationDialogComponent = this.dialog.open(ApplicationDialogComponent, {
      width: '600px',
      data: app
    });

    this.applicationDialogComponent.afterClosed().subscribe(result => {
        // console.log('Dialog result => ', result);
    });
  }

  onAddNew() {
    console.log('Add New');
    this.applicationDialogComponent = this.dialog.open(ApplicationDialogComponent, {
      width: '600px',
      data: new Application()
    });

    this.applicationDialogComponent.afterClosed().subscribe(result => {
        // console.log('Dialog result => ', result);
    });
  }
}
