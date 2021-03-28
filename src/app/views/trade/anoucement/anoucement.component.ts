import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnoucementFormService } from './anoucementForm.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Anoucement } from '../model/anoucement.model';
import { AnoucementService } from '../services/anoucement.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../dialog/confirmation-dialog/confirmation-dialog.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AnoucementDialogComponent } from '../dialog/anoucement-dialog/anoucement-dialog.component';


@Component({
  selector: 'app-anoucement',
  templateUrl: './anoucement.component.html',
  styleUrls: ['./anoucement.component.scss'],
  providers: [ConfirmationDialogService]
})
export class AnoucementComponent implements OnInit , OnDestroy {

  spinnerLoading = false;
  displayedColumns: string[] = ['date', 'category', 'from' , 'topic', 'action'];
  dataSource = new BehaviorSubject([]);
  anoucementList: Anoucement[];
  private anoucementSub: Subscription;

  anoucementDialogComponent: MatDialogRef<AnoucementDialogComponent>;

  constructor(
    public formService: AnoucementFormService,
    private anoucementService: AnoucementService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.spinnerLoading = true;
    this.anoucementService.getAnoucements();
    this.anoucementSub = this.anoucementService.getAnoucementsListener().subscribe((data: Anoucement[]) => {
      this.spinnerLoading = false;
      this.anoucementList = data;
      this.dataSource.next(this.anoucementList);
    });

  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
    this.anoucementSub.unsubscribe();
  }

  public onAddNew() {
    this.anoucementDialogComponent = this.dialog.open(AnoucementDialogComponent, {
      width: '600px',
      data: new Anoucement()
    });

    this.anoucementDialogComponent.afterClosed().subscribe(result => {
        // console.log('Dialog result => ', result);
    });
  }

  public onDelete(_id: string , _topic: string) {

    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to delete  ${_topic}  ?`)
    .then((confirmed) => {
      if ( confirmed ) {
        this.anoucementService.deleteAnoucement(_id).subscribe(response => {

          this.toastr.success( 'Delete  successful' , 'Delete Successful', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          });
        });
      }
    }).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  public onEdit(anoucement: Anoucement) {

    this.anoucementDialogComponent = this.dialog.open(AnoucementDialogComponent, {
      width: '600px',
      data: anoucement
    });

    this.anoucementDialogComponent.afterClosed().subscribe(result => {
        // console.log('Dialog result => ', result);
    });

  }
}
