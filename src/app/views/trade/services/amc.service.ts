
import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Amc} from './amc.model';
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL ;

@Injectable({ providedIn: 'root' })
export class AmcService {

  private amc: Amc[] = [];
  private amcUpdated = new Subject<Amc[]>();

  constructor(private http: HttpClient , private router: Router) { }

  getAmc() {

    console.log(' Amc service getAmc():');

    this.http.get<{ message: string, result: any }>(BACKEND_URL + '/amc')
    .pipe(map((fundtData) => {
        return fundtData.result.map(amc => {
            return {
              amcid: amc.Amc_Id,
              amcCode: amc.Amc_Code,
              amcName: amc.Amc_Name,
            };
        });
    }))
    .subscribe((transformedData) => {
        this.amc = transformedData;
        this.amcUpdated.next([...this.amc]);
    });
  }

  getAmcUpdateListener() {
    return this.amcUpdated.asObservable();
  }

}
