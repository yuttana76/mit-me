
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Application} from '../model/application.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL ;

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  private application: Application[] = [];
  private applicationUpdated = new Subject<Application[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getApplication() {
    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/application')
    .pipe(map((fundtData) => {
        return fundtData.result.map(amc => {
            return {
              AppId: amc.AppId,
              AppName: amc.AppName,
              AppGroup: amc.AppGroup,
              AppLink: amc.AppLink,
            };
        });
    }))
    .subscribe((transformedData) => {
        this.application = transformedData;
        this.applicationUpdated.next([...this.application]);
    });
  }

  getApplicationListener() {
    return this.applicationUpdated.asObservable();
  }


}
