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
  MatTableModule

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
    MatTableModule
  ]
})
export class AngularMaterialModule {}
