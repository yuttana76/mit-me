import { Component, inject, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: './customError.component.html'
})
export class CustomErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string} ) {}
}
