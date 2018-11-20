import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Application} from '../model/application.model';
import { environment } from '../../../../environments/environment';
import { ThemeRoutingModule } from '../../theme/theme-routing.module';

const navItems = [
  {
    name: 'Trade Dashboard',
    url: '/trade/TradeDash',
    icon: 'icon-speedometer',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: 'Anoucement',
    url: '',
    icon: 'icon-bell',
    // children: [
    //   {
    //     name: 'News',
    //     url: '/trade/SummaryRepport',
    //     icon: 'icon-sapace'
    //   },
    //   {
    //     name: 'Company',
    //     url: '/base/carousels',
    //     icon: 'icon-sapace'
    //   },
    // ]
  },

  {
    name: 'Documents',
    url: '',
    icon: 'icon-briefcase',
    // children: [
    //   {
    //     name: 'File 1',
    //     url: '/trade/SummaryRepport',
    //     icon: 'icon-sapace'
    //   },
    //   {
    //     name: 'File 2',
    //     url: '/base/carousels',
    //     icon: 'icon-sapace'
    //   },
    // ]
  },
  {
    name: 'Setting',
    url: '',
    icon: 'icon-user',
    children: [
      {
        name: 'User',
        url: '/trade/userList',
        icon: 'icon-sapace'
      },
      {
        name: 'Applications',
        url: '/trade/mitApplication',
        icon: 'icon-sapace'
      },
      {
        name: 'Group',
        url: '/trade/mitGroup',
        icon: 'icon-sapace'
      },

    ]
  },
  {
    name: 'Applications ',
    url: '/trade',
    icon: 'icon-layers',
    children: [
      {
        name: 'Customer',
        url: '/trade/customerList',
        icon: 'icon-sapace'
      }
      , {
        name: 'Work Flow',
        url: '/trade/workflow',
        icon: 'icon-sapace'
      }
    ]
  },
  {
    name: 'Report & Enquiry',
    url: '/trade',
    icon: 'icon-pie-chart',
    children: [
      {
        name: 'Summary Transac Info',
        url: '/trade/SummaryRepport',
        icon: 'icon-sapace'
      },
      {
        name: 'Client Portfolio',
        url: '/base/carousels',
        icon: 'icon-sapace'
      },
      {
        name: 'Account Info.',
        url: '/base/collapses',
        icon: 'icon-sapace'
      },
      {
        name: 'Transaction Info.',
        url: '/base/forms',
        icon: 'icon-sapace'
      }
    ]
  },
  // {
  //   name: 'ขอความช่วยเหลือ',
  //   url: 'http://coreui.io/angular/',
  //   icon: 'icon-cloud-download',
  //   class: 'mt-auto',
  //   variant: 'success'
  // },
];

const BACKEND_URL = environment.apiURL + '/nav';

@Injectable({ providedIn: 'root' })
export class MitDynaNavService {

  constructor(private http: HttpClient , private router: Router) { }

  public getMitDynaNav() {

    return navItems;
  }

  // this.getMitNav2U('yuttana76@gmail.com');
  public getMitNav2U(userId: string) {

    const queryParams = `?userId=${userId}`;

    return this.http.get<{result: any }>(BACKEND_URL + queryParams )
    .pipe(
      map(data => {
        return data.result.map(rtnData => {
          return {
            AppId: rtnData.AppId,
            AppName: rtnData.AppName,
            AppGroup: rtnData.AppGroup,
            AppLink: rtnData.AppLink,
            status: rtnData.status,
            menuOrder: rtnData.menuOrder,
            menuGroup: rtnData.menuGroup,
            name: rtnData.AppName,
            url: rtnData.AppLink,
            icon: 'icon-sapace'

          };
        });
      })
    );
  }
}
