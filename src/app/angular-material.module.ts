import { NgModule } from "@angular/core";
import {
  MatFormFieldModule,
  MatButtonModule,
  MatCardModule ,
  MatInputModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSelectModule,
  MatOptionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
  MatTableModule,
  MatTabsModule,
  MatRadioModule,
  MatIconModule,
  MatCheckboxModule,
  MatListModule,

} from '@angular/material';

@NgModule({
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatTableModule,
    MatTabsModule,
    MatRadioModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule
  ]
})
export class AngularMaterialModule {}
