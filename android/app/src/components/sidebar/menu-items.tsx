export const menuItems = [
  {
    name: 'Dashboard',
    icon: 'home-outline',
    color: '#32CD32',
    backgroundTint: 'rgb(245, 255, 250)',
    component: 'Dashboard',
  },
  {
    name: 'Landing Page',
    icon: 'file-download-outline',
    color: '#FFD700',
    backgroundTint: 'rgb(254, 246, 221)',
    component: 'Landing-Page',
  },
  {
    name: 'Pages',
    icon: 'file-document-outline',
    color: '#6495ED',
    backgroundTint: 'rgb(224, 229, 253)',
    component: 'Pages',
  },
];

export const collapsibleItems = [
  {
    name: 'Point of Sales',
    icon: 'basket-outline',
    color: 'rgb(237, 111, 106)',
    backgroundTint: 'rgb(253, 242, 238)',
    subItems: [
      {
        name: 'Process Sales',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'POS-Process-Sales',
      },
      {
        name: 'Sale History',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'POS-Sale-History',
      },
      {
        name: 'Cash Registers',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'POS-Cash-Registers',
      },
    ],
  },
  {
    name: 'Inventory',
    icon: 'archive-outline',
    color: 'rgb(106, 141, 41)',
    backgroundTint: 'rgb(239, 254, 198)',
    subItems: [
      {
        name: 'My Inventory',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Inventory-My-Inventory',
      },
      {
        name: 'Opening Balance',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Inventory-Opening-Balance',
      },
      {
        name: 'Purchase',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Inventory-Purchase',
      },
      {
        name: 'Inventory Transfer',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Inventory-Inventory-Transfer',
      },
    ],
  },
  {
    name: 'Customer',
    icon: 'account-group-outline',
    color: 'rgb(133, 50, 19)',
    backgroundTint: 'rgb(249, 213, 197)',
    subItems: [
      {
        name: 'Customers',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Customer-Customer',
      },
      {
        name: 'Tag',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Customer-Tag',
      },
      {
        name: 'Tier',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Customer-Tier',
      },
    ],
  },
  ,
  {
    name: 'User',
    icon: 'account-outline',
    color: '#00BFFF',
    backgroundTint: 'rgb(227, 247, 254)',
    subItems: [
      {
        name: 'User',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'User-User',
      },
      {
        name: 'Role',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'User-Role',
      },
    ],
  },
  {
    name: 'Subscriptions',
    icon: 'gesture-tap',
    color: '#FF69B4',
    backgroundTint: 'rgb(251, 228, 241)',
    subItems: [
      {
        name: 'Tenant',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Subscriptions-Tenant',
      },
      {
        name: 'Packages',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Subscriptions-Packages',
      },
    ],
  },

  {
    name: 'Reporting',
    icon: 'gesture-tap',
    color: '#FF69B4',
    backgroundTint: 'rgb(251, 228, 241)',
    subItems: [
      {
        name: 'Sales',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Sales',
      },
      {
        name: 'Inventory',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Inventory',
      },
      {
        name: 'Register',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Register',
      },
      {
        name: 'Payment',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Payment',
      },
      {
        name: 'Customer',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Customer',
      },
      {
        name: 'Custom Report',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Custom-Report',
      },
      {
        name: 'Daily Reports',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Daily-Reports',
      },
      {
        name: 'Users',
        color: '#FF6347',
        backgroundTint: 'rgb(255, 238, 238)',
        component: 'Reporting-Users',
      },
    ],
  },
];
