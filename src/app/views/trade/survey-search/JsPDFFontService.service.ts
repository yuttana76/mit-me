import { Injectable } from '@angular/core';

import * as jsPDF from 'jspdf';

@Injectable()
export class JsPDFFontService {

regularNormal = 'font in base64';
regularBold = 'font in base64';

AddFontArimo(doc: jsPDF) {
(doc as any).addFileToVFS('arimo.regular-normal.ttf', this.regularNormal);
(doc as any).addFileToVFS('arimo.regular-bold.ttf', this.regularBold);

doc.addFont('arimo.regular-normal.ttf', 'arimo', 'normal');
doc.addFont('arimo.regular-bold.ttf', 'arimo', 'bold');
doc.setFont('arimo');
}
}
