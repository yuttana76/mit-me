import { Component, OnInit } from '@angular/core';
import {MitApplicationFormService} from './mitApplicationFrom.service';
import { BehaviorSubject } from 'rxjs';
import { Application } from '../model/application.model';

@Component({
  selector: 'app-mit-application',
  templateUrl: './mit-application.component.html',
  styleUrls: ['./mit-application.component.scss']
})
export class MitApplicationComponent implements OnInit {

  spinnerLoading = false;

  displayedColumns: string[] = ['index', 'AppId', 'AppName', 'AppGroup', 'AppLink', 'Action'];
  dataSource = new BehaviorSubject([]);
  Application: Application[];

  constructor(public formService: MitApplicationFormService) { }

  ngOnInit() {
  }

}
