import i18next from "i18next";


const sidebarMenu = () => [
  {
    name: 'Dashboard',
    menuItems: [
      {
        name: 'Domain Health',
        path: `/account`,
        icon: '🍊',
      },
      {
        name: 'Analytics',
        path: `/account/analytics`,
        icon: '📊',
      },
      {
        name: 'Reports',
        path: `/account/reports`,
        icon: '📋',
      },
    ],
  },
  {
    name: 'Management',
    menuItems: [
      {
        name: 'Domains',
        path: `/account/domains`,
        icon: '🌐',
      },
      {
        name: 'Health Checks',
        path: `/account/health-checks`,
        icon: '🔍',
      },
      {
        name: 'Alerts',
        path: `/account/alerts`,
        icon: '🚨',
      },
    ],
  },
  {
    name: 'Account',
    menuItems: [
      {
        name: 'Settings',
        path: `/account/settings`,
        icon: '⚙️',
      },
      {
        name: 'Billing',
        path: `/account/billing`,
        icon: '💳',
      },
    ],
  },
];

export default sidebarMenu;

