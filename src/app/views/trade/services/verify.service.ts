import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Subject, Observable } from 'rxjs';

const BACKEND_URL = environment.apiURL + '/verify';

@Injectable({ providedIn: 'root' })
export class VerifyService {

  constructor(private http: HttpClient ) { }

  verifyExtLink(_pid: string,_has: string): Observable<any> {
    const data = {
      'pid': _pid
      };
      return this.http.post<{ message: string, result: string }>(BACKEND_URL + '/verifyExtLink', data);
}

}
