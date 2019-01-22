import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CustomErrorComponent } from './views/error/customError.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
   return next.handle(req).pipe(
     catchError((error) => {

       let errorMessage = 'An Unknown error occurred!';

       if (error.error.MSG_DESC) {
        errorMessage = error.error.MSG_DESC;
     }

      //  if (error.error.message) {
      //     errorMessage = error.error.message;
      //  }

      this.dialog.open(CustomErrorComponent, {data: {message: errorMessage}});

      return throwError(error);
     })
   );
  }
}
