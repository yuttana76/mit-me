import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Injectable()
export class MenuGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {

      console.log('MenuGuard:' , JSON.stringify(route));

    // const isAuth = this.authService.getIsAuth();
    // if ( !isAuth ) {
    //     this.router.navigate(['/login']);
    // }
    // return isAuth;
    return true;
  }
}
