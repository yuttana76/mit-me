export const navItems = [
  // {
  //   name: 'Dashboard',
  //   url: '/dashboard',
  //   icon: 'icon-speedometer',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  {
    name: 'Trade Dashboard',
    url: '/trade/TradeDash',
    icon: 'icon-speedometer',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // }
  },

  // {
  //   name: 'News',
  //   url: '/trade/TradeDash',
  //   icon: 'icon-bell '
  //   // badge: {
  //   //   variant: 'info',
  //   //   text: 'NEW'
  //   // }
  // },

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
  // {
  //   divider: true
  // },
  // {
  //   title: true,
  //   name: 'AppCtrl'
  // },
  {
    name: 'User/Group',
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
      // {
      //   name: 'Authority',
      //   url: '/trade/authority',
      //   icon: 'icon-sapace'
      // },

    ]
  },
  // {
  //   divider: true
  // },
  // {
  //   title: true,
  //   name: 'Mutual Fund Trading System',
  // },
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
      // , {
      //   name: 'Employee Information',
      //   url: '/trade/employeeList',
      //   icon: 'icon-sapace'
      // }
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
      // {
      //   name: 'Summary Trans Info.',
      //   url: '/trade/SummaryRepport',
      //   icon: 'icon-sapace'
      // },
      // {
      //   name: 'Client Portfolio',
      //   url: '/base/carousels',
      //   icon: 'icon-sapace'
      // },
      // {
      //   name: 'Account Info.',
      //   url: '/base/collapses',
      //   icon: 'icon-sapace'
      // },
      // {
      //   name: 'Transaction Info.',
      //   url: '/base/forms',
      //   icon: 'icon-sapace'
      // }
    ]
  },
  // {
  //   divider: true
  // },
  {
    name: 'ขอความช่วยเหลือ',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success'
  },
];
