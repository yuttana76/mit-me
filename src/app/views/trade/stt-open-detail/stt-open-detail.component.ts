import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-stt-open-detail',
  templateUrl: './stt-open-detail.component.html',
  styleUrls: ['./stt-open-detail.component.scss']
})
export class SttOpenDetailComponent implements OnInit {

  spinnerLoading = false;
  MODE_CREATE = 'CREATE';
  MODE_EDIT = 'EDIT';
  formScreen = 'N';
  private mode = this.MODE_CREATE;
  private applicationId;

  constructor(
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  // ngAfterViewInit() {
    ngAfterContentChecked() {

    this.spinnerLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('source') && paramMap.get('source') !== 'null') {
        this.formScreen = paramMap.get('source');
      }

      if (paramMap.has('appId')
      && paramMap.get('appId') !== 'undefined'
      && paramMap.get('appId') !== 'null'
      && paramMap.get('appId') !== ''
      ) {
        console.log('initial values')
        this.mode = this.MODE_EDIT;
        this.applicationId = paramMap.get('appId');
      }

    });

    console.log(`applicationId> ${this.applicationId} ; MODE> ${this.mode}`)

  }




}
