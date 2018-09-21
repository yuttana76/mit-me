export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  // {
  //   title: true,
  //   name: 'Theme'
  // },
  // {
  //   name: 'Colors',
  //   url: '/theme/colors',
  //   icon: 'icon-drop'
  // },
  // {
  //   name: 'Typography',
  //   url: '/theme/typography',
  //   icon: 'icon-pencil'
  // },
  {
    divider: true
  },
  // {
  //   title: true,
  //   name: 'AppCtrl'
  // },
  {
    name: 'User/Group Management',
    url: '/trade',
    icon: 'icon-user',
    children: [
      {
        name: 'User',
        url: '/trade/SummaryRepport',
        icon: 'icon-sapace'
      },
      {
        name: 'Group',
        url: '/base/carousels',
        icon: 'icon-sapace'
      },
    ]
  },
  {
    divider: true
  },
  // {
  //   title: true,
  //   name: 'Mutual Fund Trading System',
  // },
  {
    name: 'Account Management',
    url: '/trade',
    icon: 'icon-briefcase',
    children: [
      {
        name: 'Customer Information',
        url: '/trade/customerList',
        icon: 'icon-sapace'
      }
      , {
        name: 'Customer Detail',
        url: '/trade/customerDetail',
        icon: 'icon-sapace'
      }
      // , {
      //   name: 'Cust-Detail',
      //   url: '/trade/CustDetail',
      //   icon: 'icon-sapace'
      // }
    ]
  },
  {
    name: 'Report & Enquiry',
    url: '/trade',
    icon: 'icon-pie-chart',
    children: [
      {
        name: 'Summary Trans Info.',
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
  {
    divider: true
  },
  {
    name: 'ขอความช่วยเหลือ',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success'
  },
];
