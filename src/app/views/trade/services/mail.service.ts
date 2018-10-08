import { Mail } from "../model/mail.model";
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class MailService {


  constructor(private http: HttpClient , private router: Router) { }

  sendMail(mail: Mail) {
        console.log('Form:' + mail.form + ' ;TO:' +  mail.to + ' ;MSG:' + mail.subject);
  }

}
