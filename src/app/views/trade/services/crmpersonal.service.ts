import { Injectable } from "../../../../../node_modules/@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { CrmPersonModel } from "../model/crmPersonal.model";

const BACKEND_URL = environment.apiURL + '/crm';

@Injectable({ providedIn: 'root' })
export class CrmPersonalService {

  constructor(private http: HttpClient) {}


}

