
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Application} from '../model/application.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + '/application' ;

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  private application: Application[] = [];
  private applicationUpdated = new Subject<Application[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getApplication() {
    this.http.get<{ message: string, result: any }>(BACKEND_URL )
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

  deleteApplication(appId: string): Observable<any> {

    return new Observable((observer) => {
        this.http
        .delete<{ message: string, result: string }>( BACKEND_URL + '/' + appId)
        .subscribe((data) => {
                    const updatedGroup = this.application.filter(application => application.AppId !== appId);
                    this.application = updatedGroup;
                    this.applicationUpdated.next([...this.application]);
                    // observable execution
                    observer.next(data);
                    // observer.complete();

                });
      });
}


}
