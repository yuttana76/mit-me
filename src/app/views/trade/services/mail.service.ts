import { Mail } from "../model/mail.model";
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from '../../../../environments/environment';

const BACKEND_URL = environment.apiURL + '/mail/merchant';

@Injectable({ providedIn: 'root' })
export class MailService {


  constructor(private http: HttpClient , private router: Router) { }

  sendMail(mail: Mail) {
        // console.log('Form:' + mail.form + ' ;TO:' +  mail.to + ' ;MSG:' + mail.subject);
        const data = {
          form: mail.form,
          to: mail.to,
          subject: mail.subject,
          msg: mail.msg
          };
        this.http
            .post(BACKEND_URL , data)
            .subscribe(response => {
              console.log('Send mail result. ' + JSON.stringify(response));
            });
  }

}
