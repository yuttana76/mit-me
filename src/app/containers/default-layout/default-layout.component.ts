import { Component, Input, OnInit, OnDestroy } from '@angular/core';
// import { navItems } from './../../_nav';  // CORE UI MENU (default)
import { navItems } from './../../_MerchantNav';


import { AuthService } from '../../views/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MitDynaNavService } from '../../views/_mitDynaNav.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  userHasNew = true;
  userAuthenticated = false;
  public userData = null;

  private authListenerSubs: Subscription;
  // public navItems = navItems;
  public navItems =  null;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(private authService: AuthService,  private router: Router , private dynaNav: MitDynaNavService) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }

  ngOnInit() {

    this.userData = this.authService.getUserData();

    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });

  // NAV
  this.navItems =  this.dynaNav.getMitDynaNav();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
