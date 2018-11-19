
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
        return fundtData.result.map(data => {
            return {
              AppId: data.AppId,
              AppName: data.AppName,
              AppGroup: data.AppGroup,
              AppLink: data.AppLink,
              status: data.status,
              menuOrder: data.menuOrder,
              menuGroup: data.menuGroup,
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


  addApplication(insertApplication: Application): Observable<any> {
    // console.log( 'Service addGroup()' + groupId + ' ;groupName:' + groupName);
    const appData = {
      'AppId': insertApplication.AppId,
      'AppName': insertApplication.AppName,
      'AppGroup': insertApplication.AppGroup,
      'AppLink': insertApplication.AppLink,
      'status': insertApplication.status,
      'menuOrder': insertApplication.menuOrder,
      'menuGroup': insertApplication.menuGroup
      };

    return new Observable((observer) => {
      this.http.post<{ message: string, result: string }>(BACKEND_URL , appData).subscribe ((data) => {

        this.getApplication();
        observer.next(data);
      });
    });
  }

  updateApplication(updateApplication: Application): Observable<any> {
    // console.log( 'Service addGroup()' + groupId + ' ;groupName:' + groupName);
    const appData = {
      'AppId': updateApplication.AppId,
      'AppName': updateApplication.AppName,
      'AppGroup': updateApplication.AppGroup,
      'AppLink': updateApplication.AppLink,
      'status': updateApplication.status,
      'menuOrder': updateApplication.menuOrder,
      'menuGroup': updateApplication.menuGroup
      };
    // return this.http.post<{ message: string, result: string }>(BACKEND_URL , appData);
    return new Observable((observer) => {
      this.http.put<{ message: string, result: string }>(BACKEND_URL , appData).subscribe ((data) => {
        console.log('addApplication()>>', JSON.stringify(data));

        // this.getApplication();
        const updateData = this.application.find(item => item.AppId === updateApplication.AppId);
        const index = this.application.indexOf(updateData);
        this.application.indexOf[index] = updateApplication;

        this.applicationUpdated.next([...this.application]);
        // // observable execution
        observer.next(data);
      });
    });
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
