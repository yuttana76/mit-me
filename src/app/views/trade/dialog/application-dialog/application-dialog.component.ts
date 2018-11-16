import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Application } from '../../model/application.model';

@Component({
  selector: 'app-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ApplicationDialogComponent> ,
    @Inject(MAT_DIALOG_DATA) public application: Application ,
  ) { }

  ngOnInit() {
  }

}
