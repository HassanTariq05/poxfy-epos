// export const API_BASE_URL = "http://localhost:3001/api/v1";

// heroku
export const API_BASE_URL = 'http://18.204.116.214/api/v1';

// export const API_BASE_URL ="https://aka.poxfy.com/api/v1";

// client server alma linux
// export const API_BASE_URL = "/api/v1";

export const productType = [
  {
    id: 1,
    value: 'NO_VARIANT',
    label: 'Simple Product, No Variants',
  },
  {
    id: 2,
    value: 'PRODUCT_WITH_VARIANT',
    label: 'Product With Variants',
  },
  {
    id: 3,
    value: 'COMPOSITE_PRODUCT',
    label: 'Composite Product',
  },
];
export const productTypeWithAllFilter = [
  {
    id: 0,
    value: '',
    label: 'ALL',
  },
  {
    id: 1,
    value: 'NO_VARIANT',
    label: 'Simple Product, No Variants',
  },
  {
    id: 2,
    value: 'PRODUCT_WITH_VARIANT',
    label: 'Product With Variants',
  },
  {
    id: 3,
    value: 'COMPOSITE_PRODUCT',
    label: 'Composite Product',
  },
];

export const inventoryType = [
  {
    id: 1,
    value: 'ALL',
    label: 'All',
  },
  {
    id: 2,
    value: 'LOW_INVENTORY',
    label: 'Low Inventory',
  },
  {
    id: 3,
    value: 'ZERO_ITEMS',
    label: 'Zero Items',
  },
  {
    id: 4,
    value: 'GREATER_ZERO_ITEMS',
    label: 'Greater Zero Items',
  },
];
