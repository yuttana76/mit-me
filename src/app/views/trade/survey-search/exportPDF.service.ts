import { Injectable } from '@angular/core';
// import * as jsPDF from 'jspdf'

@Injectable({
  providedIn: 'root'
})
export class ExportPDFService {


  KYC_SUIT_ToPDF(Cust_Code: string) {

  //   // D:\Merchants\apps\mit\src\assets\fonts\THSarabunNew\THSarabunNew.ttf
  //   var doc = new jsPDF();

  //   // var doc = new jsPDF('p', 'mm', 'a4');
  //   var regularNormal = 'font in base64';
  //   (doc as any).addFileToVFS('THSarabunNew.ttf', regularNormal);
  //   doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');
  //   doc.setFont('THSarabunNew');

  //   // doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');
  //   // doc.setFont('THSarabunNew');

  //   doc.text(15, 15, 'Hello');
  //   doc.text(30, 15, 'สวัสดี ยินดีที่ได้รู้จักคุณ');

  //   doc.save('custom_fonts.pdf');

  }


}
