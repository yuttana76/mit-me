import { Component, OnInit, OnDestroy } from '@angular/core';
import {MitApplicationFormService} from './mitApplicationFrom.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Application } from '../model/application.model';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-mit-application',
  templateUrl: './mit-application.component.html',
  styleUrls: ['./mit-application.component.scss']
})
export class MitApplicationComponent implements OnInit , OnDestroy {

  spinnerLoading = false;

  displayedColumns: string[] = ['index', 'AppId', 'AppName', 'AppGroup', 'AppLink', 'Action'];
  dataSource = new BehaviorSubject([]);
  applicationList: Application[];
  private applicationSub: Subscription;

  constructor(
    public formService: MitApplicationFormService,
    private applicationService: ApplicationService
    ) { }

  ngOnInit() {

    this.spinnerLoading = true;

    this.applicationService.getApplication();
    this.applicationSub = this.applicationService.getApplicationListener().subscribe((data: Application[]) => {
      this.spinnerLoading = false;
      this.applicationList = data;
      this.dataSource.next(this.applicationList);
    }
    );
  }

  ngOnDestroy() {
    this.applicationSub.unsubscribe();
  }
}
