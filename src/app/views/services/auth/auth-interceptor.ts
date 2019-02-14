import { HttpRequest, HttpHandler, HttpInterceptor} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.authService.getToken();

    // console.log('AuthInterceptor  authToken>> '+JSON.stringify(authToken));
    // Get token by parameter

    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });

    return next.handle(authRequest);
  }
}
