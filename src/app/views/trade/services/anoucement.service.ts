
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Anoucement} from '../model/anoucement.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + '/anoucement' ;

@Injectable({ providedIn: 'root' })
export class AnoucementService {

  private anoucements: Anoucement[] = [];
  private anoucementsSub = new Subject<Anoucement[]>();

  private activeAnoucements: Anoucement[] = [];
  private activeAnoucementsSub = new Subject<Anoucement[]>();


  constructor(private http: HttpClient , private router: Router) { }

  getAnoucements() {

    this.http.get<{ message: string, result: any }>(BACKEND_URL )
    .pipe(map((fundtData) => {
        return fundtData.result.map(data => {

            return {
              id: data.id,
              Topic: data.Topic,
              AnouceFrom: data.AnouceFrom,
              Catgory: data.Catgory,
              status: data.status,
              AnouceDate: data.AnouceDate,
              SourceType: data.SourceType,
              SourcePath: data.SourcePath,
              SourceContent: data.SourceContent,
              CreateBy: data.CreateBy,
              CreateDate: data.CreateDate,
              UpdateBy: data.UpdateBy,
              UpdateDate: data.UpdateDate
            };
        });
    }))
    .subscribe((transformedData) => {
        this.anoucements = transformedData;
        this.anoucementsSub.next([...this.anoucements]);
    });
  }

  getAnoucementsListener() {
    return this.anoucementsSub.asObservable();
  }


  getActiveAnoucements() {

    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/active' )
    .pipe(map((fundtData) => {
        return fundtData.result.map(data => {
            return {
              id: data.id,
              Topic: data.Topic,
              AnouceFrom: data.AnouceFrom,
              Catgory: data.Catgory,
              status: data.status,
              AnouceDate: data.AnouceDate,
              SourceType: data.SourceType,
              SourcePath: data.SourcePath,
              SourceContent: data.SourceContent,
              CreateBy: data.CreateBy,
              CreateDate: data.CreateDate,
              UpdateBy: data.UpdateBy,
              UpdateDate: data.UpdateDate
            };
        });
    }))
    .subscribe((transformedData) => {
        this.activeAnoucements = transformedData;
        this.activeAnoucementsSub.next([...this.activeAnoucements]);
    });
  }

  getActiveApplicationListener() {
    return this.activeAnoucementsSub.asObservable();
  }



  addApplication(model: Anoucement, image: File): Observable<any> {

    //  console.log( 'Service addApplication()' + image );
    // const appData = {
    //   'Topic': model.Topic,
    //   'AnouceFrom': model.AnouceFrom,
    //   'Catgory': model.Catgory,
    //   'status': model.status,
    //   'AnouceDate': model.AnouceDate,
    //   'SourceType': model.SourceType,
    //   'SourcePath': model.SourcePath,
    //   'SourceContent': model.SourceContent,
    //   'CreateBy': model.CreateBy,
    //   'image': image
    //   };

      const appData = new FormData();
      appData.append('Topic', model.Topic);
      appData.append('AnouceFrom', model.AnouceFrom);
      appData.append('Catgory', model.Catgory);
      appData.append('status', model.status);
      appData.append('AnouceDate', model.AnouceDate || '');
      appData.append('SourceType', model.SourceType || '');
      appData.append('SourcePath', model.SourcePath || '');
      appData.append('SourceContent', model.SourceContent || '');
      appData.append('CreateBy', model.CreateBy);
      appData.append('image', image);

    return new Observable((observer) => {
      this.http.post<{ message: string, result: string }>(BACKEND_URL , appData).subscribe ((data) => {
        this.getAnoucements();
        observer.next(data);
      });
    });
  }

  updateApplication(model: Anoucement, image: File | string): Observable<any> {

    if ( typeof(image) === 'object' ) {

    } else {

    }

    const appData = {
      'Id': model.id,
      'Topic': model.Topic,
      'AnouceFrom': model.AnouceFrom,
      'Catgory': model.Catgory,
      'status': model.status,
      'AnouceDate': model.AnouceDate,
      'SourceType': model.SourceType,
      'SourcePath': model.SourcePath,
      'SourceContent': model.SourceContent,
      'CreateBy': model.CreateBy
      };
    // return this.http.post<{ message: string, result: string }>(BACKEND_URL , appData);
    return new Observable((observer) => {
      this.http.put<{ message: string, result: string }>(BACKEND_URL , appData).subscribe ((data) => {

        // this.getApplication();
        const updateData = this.anoucements.find(item => item.id === model.id);
        const index = this.anoucements.indexOf(updateData);
        this.anoucements.indexOf[index] = model;
        this.anoucementsSub.next([...this.anoucements]);
        // // observable execution
        observer.next(data);
      });
    });
  }

  deleteAnoucement(id: string): Observable<any> {
    return new Observable((observer) => {
        this.http
        .delete<{ message: string, result: string }>( BACKEND_URL + '/' + id)
        .subscribe((data) => {
                    const updateList = this.anoucements.filter(list => list.id !== id);
                    this.anoucements = updateList;
                    this.anoucementsSub.next([...this.anoucements]);
                    // observable execution
                    observer.next(data);
                    // observer.complete();
                });
      });
  }
}
