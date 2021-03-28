import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomErrorComponent } from './views/error/customError.component';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        console.log(JSON.stringify(error));

        let errorMessage = 'An Unknown error occurred! XXX';

        if (error.error.msg) {
          errorMessage = error.error.msg;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.error.message) {
          errorMessage = error.message;
        }
/*
https://www.npmjs.com/package/ngx-toastr

        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'

*/

        // this.toastr.error(errorMessage, 'ERROR', {
        //   timeOut: 5000,
        //   closeButton: true,
        //   positionClass: 'toast-top-center'
        // });

        this.dialog.open(CustomErrorComponent, {data: {message: errorMessage}});
        console.log(JSON.stringify(errorMessage));

        return throwError(error);
      })
    );
  }
}
