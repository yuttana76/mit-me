import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {

      // console.log('**** AuthGuard() ');
      // NOT WORK
      // route.queryParams.subscribe(params => {
      //   const has = params['has'];
      //   console.log('****' + has);
      // });

    const isAuth = this.authService.getIsAuth();

    if ( !isAuth ) {
        this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
