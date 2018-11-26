import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { Fund } from '../model/fund.model';
import { FundService } from '../services/fund.service';

import { Amc } from '../model/amc.model';
import { AmcService } from '../services/amc.service';

import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthorityService } from '../services/authority.service';
import { AuthService } from '../../services/auth.service';
import { Authority } from '../model/authority.model';

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-summary-rep',
  templateUrl: './summary-rep.component.html',
  styleUrls: ['./summary-rep.component.scss']
})

export class SummaryRepComponent implements OnInit, OnDestroy {

  @ViewChild('repContent') content: ElementRef;

  spinnerLoading = false;
  form: FormGroup;
  public authority: Authority = new Authority();
  private appId = 'sumRep';
  public YES_VAL = 'Y';

  funds: Fund[] = [];
  amcs: Amc[] = [];

  private fundsSub: Subscription;

  constructor(
    private fundService: FundService,
    private amcService: AmcService,
    private authorityService: AuthorityService,
    private authService: AuthService,
    ) { }


  ngOnInit() {

    // Permission
    this.authorityService.getPermissionByAppId(this.authService.getUserData(), this.appId).subscribe( (auth: Authority[]) => {

      auth.forEach( (element) => {
        this.authority = element;
      });

    });

    this.spinnerLoading = true;
    this.form = new FormGroup({
      startDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      endDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      amc: new FormControl(null, {
        validators: [Validators.required]
      }),
      fund: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
/*
    Initial Fund
*/
    // this.fundService.getFunds(1, 5);
    // this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
    //   this.funds = funds;
    //   console.log('Final Fund>>' + JSON.stringify(this.funds) );
    // });

    this.amcService.getAmc();
    this.fundsSub = this.amcService.getAmcUpdateListener().subscribe((amc: Amc[]) => {
      this.amcs = amc;
      // console.log('AMC>>' + JSON.stringify(this.amcs) );
      this.spinnerLoading = false;
    });
  }

  ngOnDestroy(): void {
    try {
      this.fundsSub.unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }

  onGetFund() {

    this.fundService.getFunds(1, 5);
    this.fundsSub = this.fundService.getFundUpdateListener().subscribe((funds: Fund[]) => {
      this.funds = funds;
    });
  }

  onExecute() {

    if (this.form.invalid) {
      console.log('form.invalid() ' + this.form.invalid);
      return true;
    }
    console.log( 'NEXT FORM VALUES>>' + this.form.value.amc);
  }

  reset() {
    console.log('Reset()');

  }

  public onPrint() {

    // let doc = new jsPDF();
    let doc = new jsPDF('p', 'pt', 'letter');

    doc.text(100, 225, 'Summary Report');

    let specialElementHandlers = {
      '#editor' : function(element, renderer) {
        return true;
      }
    }

    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('test.pdf');

  }


//   public onPrint2() {
//     var pdf = new jsPDF('p', 'pt', 'letter');
//     // var text = document.getElementById("Text1").value;
//     pdf.text(100, 225, 'Summary Report');
//     // source can be HTML-formatted string, or a reference
//     // to an actual DOM element from which the text will be scraped.
//     source = $('#customers')[0];

//     // we support special element handlers. Register them with jQuery-style
//     // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
//     // There is no support for any other type of selectors
//     // (class, of compound) at this time.
//     specialElementHandlers = {
//         // element with id of "bypass" - jQuery style selector
//         '#bypassme': function (element, renderer) {
//             // true = "handled elsewhere, bypass text extraction"
//             return true
//         }
//     };
//     margins = {
//         top: 80,
//         bottom: 60,
//         left: 40,
//         width: 522
//     };
//     // all coords and widths are in jsPDF instance's declared units
//     // 'inches' in this case
//     pdf.fromHTML(
//     source, // HTML string or DOM elem ref.
//     margins.left, // x coord
//     margins.top, { // y coord
//         'width': margins.width, // max width of content on PDF
//         'elementHandlers': specialElementHandlers
//     },

//     function (dispose) {
//         // dispose: object with X, Y of the last line add to the PDF
//         //          this allow the insertion of new lines after html
//         pdf.save('Test.pdf');
//     }, margins);
// }

}
