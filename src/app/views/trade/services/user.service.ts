import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const BACKEND_URL = environment.apiURL + '/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient ) { }


}
