import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper } from 'pdfmake-wrapper';

@Component({
  selector: 'app-fc-app-form',
  templateUrl: './fc-app-form.component.html',
  styleUrls: ['./fc-app-form.component.scss']
})
export class FcAppFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  pdfApplicationFrom(){

    const pdf = new PdfMakeWrapper();

    pdf.pageSize('A4');

    // custom page size
    pdf.pageSize({
      width: 595.28,
      height: 'auto'
    });

  }
}
