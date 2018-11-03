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
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
   return next.handle(req).pipe(
     catchError((error: HttpErrorResponse) => {

       let errorMessage = 'An Unknown error occurred! XXX';
       if (error.error.message) {
          // errorMessage = error.error.message;
          errorMessage = error.message;
       }

       this.toastr.error( errorMessage , 'ERROR', {
        timeOut: 0,
        positionClass: 'toast-top-center',
      });
      // this.dialog.open(CustomErrorComponent, {data: {message: errorMessage}});

      return throwError(error);
     })
   );
  }
}
