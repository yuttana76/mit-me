

export const navItems = [
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
    name: 'E-Open(DEV)',
    url: '/trade/open-account-first',
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
    name: 'Applications-',
    url: '/trade',
    icon: 'icon-layers',
    children: [
      {
        name: 'Customer',
        url: '/trade/customerList',
        icon: 'icon-sapace'
      }
      , {
        name: 'Connext Calendar',
        url: '/trade/connextCalendar',
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
  {
    name: 'ขอความช่วยเหลือ',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success'
  },
];
