import { Component, Input, OnInit, OnDestroy } from '@angular/core';
// import { navItems } from './../../_nav';  // CORE UI MENU (default)
import { navItems } from './../../_MerchantNav';
// import { navItems } from './../../_devNav'; // For development


import { AuthService } from '../../views/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MitDynaNavService } from '../../views/trade/services/_mitDynaNav.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {

  userHasNew = true;
  userAuthenticated = false;
  public userData = null;

  private authListenerSubs: Subscription;
  public navItems = navItems;

  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(
    private authService: AuthService,
    private router: Router ,
    private dynaNav: MitDynaNavService
    ) {

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

  // ***************************   Dynamic NAV
  this.navItems =  null;  // For production

  if ( this.navItems == null ) {

      this.dynaNav.getMitNav2U(this.userData).subscribe( menuDyna => { // Load menu setting from db.

        const appArray = new Array();
        const repArray = new Array();
        const settingArray = new Array();

        for (const x in menuDyna) {
          if ( menuDyna[x].menuGroup === 'Applications') {
            appArray.push(menuDyna[x]);

          } else if (menuDyna[x].menuGroup === 'Report & Enquiry') {
            repArray.push(menuDyna[x]);

          } else if (menuDyna[x].menuGroup === 'Setting') {
            settingArray.push(menuDyna[x]);
          }
        }

        const navDyna = [

          { name: 'Trade Dashboard',
            url: '/trade/TradeDash',
            icon: 'icon-speedometer',
          } ,
          { name: 'Anoucement',
            url: '/trade/anoucementr',
            icon: 'icon-bell',
          },
          {
            name: 'Documents',
            url: '',
            icon: 'icon-briefcase',
          },
          {name: 'Applications ',
          url: '/trade',
          icon: 'icon-layers',
          children: appArray},

          {name: 'Report & Enquiry',
          url: '/trade',
          icon: 'icon-pie-chart',
          children: repArray},
          {name: 'Setting',
          url: '',
          icon: 'icon-user',
          children:  settingArray }
        ];

        this.navItems = navDyna;
      });



  }
// ***************************   Dynamic NAV


  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
