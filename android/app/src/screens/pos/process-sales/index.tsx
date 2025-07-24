import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  Platform,
} from 'react-native';
import BasicCard from '../../../components/basic-card';
import {Card} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../../../components/pos/process-sales/product-card';
import {
  getCurrentRegister,
  getDiscountsList,
  getProductCategories,
  getProducts,
  getSaleDetials,
  getSales,
  getTaxesList,
  postSaleOrder,
} from '../../../services/process-sales';
import useAuthStore from '../../../redux/feature/store';
import ProcessCustomerModal from '../../../components/modals/process-customer';
import AddCustomerModal from '../../../components/modals/add-customer';
import AddExistingCustomerModal from '../../../components/modals/add-existing-customer-modal';
import ProductVariantModal from '../../../components/modals/product-variant-modal';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '../../../constants';
import axios from 'axios';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import ErrorModal from '../../../components/modals/error-modal';
import ProductSerialModal from '../../../components/modals/product-serial-modal';
import ProductDetailModal from '../../../components/modals/product-detail-modal';
import DiscountModal from '../../../components/modals/discount-modal';
import PaymentModal from '../../../components/modals/payment-modal';
import {getLoyaltyBalance} from '../../../services/customer';
import moment from 'moment';
import NativePrintSdk from '../../../../../../specs/NativePrintSdk';
import uuid from 'react-native-uuid';
import {set} from 'react-hook-form';

export interface Tax {
  id: string;
  rate: number;
  name: string;
  value: string;
}

export interface LineItem {
  product: any;
  productId: string;
  quantity: number;
  selectedVariant: Variant;
  selectedTax: Tax;
}

export interface Variant {
  _id: string;
  retailPrice: number;
  combination: string[];
  costPrice: number;
  retailPriceInclTax: number;
  discount: number;
  discountTypeId: string;
}

export interface Discount {
  value: number;
  type: string;
  id: string;
}

interface ProcessSalesProps {
  salesId?: string;
}

function ProcessSales() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    headerUrl,
    setIsLoadingTrue,
    setIsLoadingFalse,
    outletChange,
    setRedirectToProcessSalesTrue,
    setRedirectToProcessSalesFalse,
    salesFlag,
    salesId,
    setSalesFlag,
    setSalesId,
  } = useAuthStore();

  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'all',
  );

  const [products, setProducts] = useState<any>([]);
  // const [selectedCustomer, setSelectedCustomer] = useState<any>('Add Customer');
  const [selectedCustomerData, setSelectedCustomerData] = useState<any>({
    Name: 'Walk-In Customer',
    Phone: '',
  });
  const [registerName, setRegisterName] = useState(null);
  const [outletName, setOutletName] = useState('Outlet');
  const [outlet, setOutlet] = useState();

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const [variantModalVisible, setVariantModalVisible] = useState<any>(false);
  const [serialModalVisible, setSerialModalVisible] = useState<any>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const [subtotal, setSubtotal] = useState<number>(0);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const [taxes, setTaxes] = useState([]);
  const [taxTotal, setTaxTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [cart, setCart] = useState<Cart>({items: []} as Cart);
  const [notes, setNotes] = useState<string>('');
  const [loyalityBalance, setLoyalityBalance] = useState({
    totalPointsAccrued: 0,
    balance: 0,
    totalPointsUsed: 0,
  });

  interface Cart {
    items: LineItem[];
    selectedDiscount?: Discount;
    notes?: string;
  }

  const addItemToCart = (
    product: any,
    selectedVariant: Variant,
    selectedTax: Tax,
    quantity: number = 1,
    serial: string = '',
  ) => {
    product.serial = serial;
    const existingProductIndex = cart.items.findIndex(
      (item: LineItem) =>
        item.product._id == product._id &&
        item.selectedVariant._id == selectedVariant._id,
    );
    if (existingProductIndex > -1) {
      cart.items[existingProductIndex].quantity += quantity;
    } else {
      cart.items.push({
        product,
        productId: product._id,
        quantity,
        selectedVariant,
        selectedTax,
      });
    }
    setCart(cart);

    console.log('cart');
    console.log(cart);
  };

  const removeItemFromCart = (productId: string) => {
    const existingProductIndex = cart.items.findIndex(
      (item: LineItem) => item.product._id == productId,
    );
    if (existingProductIndex > -1 && existingProductIndex < cart.items.length) {
      cart.items.splice(existingProductIndex, 1);
    }
    setCart(cart);
  };

  const getProductSubtotal = (
    selectedVariant: Variant,
    quantity: number,
    selectedTax: Tax,
  ) => {
    return (
      selectedVariant.retailPrice * quantity +
      selectedVariant.retailPrice * quantity * ((selectedTax?.rate ?? 0) / 100)
    );
  };

  const getTaxTotal = () => {
    return cart.items.reduce(
      (total, item) =>
        total +
        item.selectedVariant.retailPrice *
          item.quantity *
          ((item.selectedTax?.rate ?? 0) / 100),
      0,
    );
  };

  const getCartSubTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.selectedVariant.retailPrice * item.quantity,
      0,
    );
  };

  const getCartTotal = () => {
    return (
      cart.items.reduce(
        (total, item) =>
          total +
          getProductSubtotal(
            item.selectedVariant,
            item.quantity,
            item.selectedTax,
          ),
        0,
      ) - (getDiscountTotal() ?? 0)
    );
  };

  const getDiscountTotal = () => {
    if (cart.selectedDiscount?.type == 'percentage') {
      return (getCartSubTotal() * cart.selectedDiscount?.value) / 100;
    } else {
      return cart.selectedDiscount?.value;
    }
  };

  const updateTotals = () => {
    setDiscountTotal(getDiscountTotal() ?? 0);
    setTaxTotal(getTaxTotal);
    setSubtotal(getCartSubTotal);
    setCartTotal(parseFloat(getCartTotal().toFixed(2)));
  };

  const handleSelectProduct = (selectedProduct: any) => {
    console.log('handleSelectProduct: selectedProduct');
    console.log(selectedProduct);

    if (!isRegisterOpen) {
      setErrorModalVisible(true);
      return;
    }
    setSelectedProduct(selectedProduct);

    if (selectedProduct.type === 'PRODUCT_WITH_VARIANT') {
      setVariantModalVisible(true);
    } else if (selectedProduct.type === 'NO_VARIANT') {
      if (selectedProduct.askSerialNo) {
        setSerialModalVisible(true);
        return;
      }

      addItemToCart(selectedProduct, selectedProduct.variants[0], taxes[0]);

      updateTotals();
    }
  };

  const handleRemoveProduct = (
    productId: string,
    attributes?: Record<string, any>,
  ) => {
    if (isRegisterOpen) {
      removeItemFromCart(productId);
      updateTotals();
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery == searchQuery) return;
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchProducts = async (category: string, query: string) => {
    setIsLoadingTrue();
    let url = `product?isSale=true&active=true`;
    if (category !== 'all') {
      url += `&productTypeIds=${selectedCategory}`;
    }
    if (query.trim() !== '') {
      url += `&name=${query}`;
    }
    try {
      const getProductsResponse = await getProducts(url, headerUrl);

      setProducts(getProductsResponse.data.data.data);

      setIsLoadingFalse();
    } catch (error) {
      setIsLoadingFalse();
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory ?? '', '');
    return () => {};
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts(selectedCategory ?? 'all', debouncedSearchQuery);
    return () => {};
  }, [debouncedSearchQuery]);

  const getAllProductCategories = async () => {
    setIsLoadingTrue();
    try {
      const getCategoriesResponse = await getProductCategories(headerUrl);

      const updatedCategories = [
        {_id: 'all', name: 'All', image: null},
        ...getCategoriesResponse.data.data.data,
      ];
      setCategories(updatedCategories);
      setIsLoadingFalse();
    } catch (error) {
      setIsLoadingFalse();
    }
  };

  useEffect(() => {
    console.log('useEffect: salesFlag:', salesFlag, salesId);
    getAllProductCategories();
  }, [outletChange]);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [summaryCollapsed, setSummaryCollapsed] = useState(true);

  useEffect(() => {
    const getSale = async (discountTypesDataFormatted: any, taxes1: any) => {
      try {
        reset1();
        console.log('Sales ID: ', salesId);

        if (salesId == '') {
          return;
        }

        setIsLoadingTrue();

        const getSalesResponse = await getSales(salesId ?? '', headerUrl);

        setIsLoadingFalse();

        console.log('getSalesResponse');
        console.log(getSalesResponse);

        var sale = getSalesResponse.data.data;
        var details = sale.saleDetails;

        cart.items = [];

        details.forEach((data: any) => {
          var selectedVariant;
          if (data.product.variants.length == 1) {
            selectedVariant = data.product.variants[0];
          } else {
            var selectedAttrSet = new Set(data.combination);
            data.product.variants.forEach((variant: any) => {
              const combSet = new Set(variant.combination as string[]);
              const eqSet =
                combSet.size === selectedAttrSet.size &&
                [...combSet].every(x => selectedAttrSet.has(x));
              if (eqSet) {
                selectedVariant = variant;
                return;
              }
            });
          }
          if (selectedVariant) {
            selectedVariant.retailPrice = data.price;
          } else {
            selectedVariant = data.product.variants[0];
          }

          var selectedTax = taxes1.find((tax: any) => tax.id === data.taxId);

          addItemToCart(
            data.product,
            selectedVariant,
            selectedTax,
            data.quantity,
            data.serialNo,
          );
        });

        var selectedDiscount = discountTypesDataFormatted.find(
          (discount: any) => discount.id === sale.discountTypeId,
        );
        cart.selectedDiscount = {
          id: selectedDiscount.id,
          value: Number(sale.discount),
          type: selectedDiscount.type,
        };
        console.log('cart');
        console.log(cart);
        setCart(cart);
        updateTotals();
      } catch (error) {
        setIsLoadingFalse();
        console.log('error');
        console.log(error);
      }
    };
    const fetchListOfTax = async (discountTypesDataFormatted: any) => {
      try {
        setIsLoadingTrue();

        const getTaxResponse = await getTaxesList(headerUrl);

        console.log('getTaxResponse:');
        console.log(getTaxResponse);

        setIsLoadingFalse();

        const taxDataFormatted = getTaxResponse.data.data.data.map(
          (tax: any) => ({
            label: tax.name + ' ' + tax.rate + '%',
            value: tax._id,
            rate: tax.rate,
            name: tax.name,
            id: tax._id,
          }),
        );

        setTaxes(taxDataFormatted);

        getSale(discountTypesDataFormatted, taxDataFormatted);
      } catch {
        setIsLoadingFalse();
        return null;
      }
    };

    const getDiscountTypes = async () => {
      try {
        setIsLoadingTrue();

        const getDiscountTypeResponse = await getDiscountsList(headerUrl);

        console.log('getDiscountTypes');
        console.log(getDiscountTypeResponse);

        setIsLoadingFalse();

        const discountTypesDataFormatted =
          getDiscountTypeResponse.data.data.data.map((discount: any) => ({
            label: discount.value,
            id: discount._id,
            type: discount.key,
          }));
        setDiscountTypes(discountTypesDataFormatted);

        fetchListOfTax(discountTypesDataFormatted);
      } catch (error) {
        setIsLoadingFalse();
        console.log('error' + error);
      }
    };
    getDiscountTypes();
  }, [salesId]);

  const [discountTypes, setDiscountTypes] = useState([]);
  const [userFullName, setUserFullName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(userFullName => {
      setUserFullName(userFullName ?? '(No Name)');
    });
  }, []);

  useEffect(() => {
    const fetchCurrentRegister = async () => {
      try {
        setIsLoadingTrue();
        const token = await AsyncStorage.getItem('userToken');
        const outletsData = await AsyncStorage.getItem('outletsData');
        const parsedOutletsData = outletsData ? JSON.parse(outletsData) : '';
        const outletId = await AsyncStorage.getItem('selectedOutlet');
        if (Array.isArray(parsedOutletsData)) {
          parsedOutletsData.map(outlet => {
            if (outlet.value == outletId) {
              setOutletName(outlet.label);
              setOutlet(outlet);
            }
          });
        }

        const response = await getCurrentRegister(outletId, headerUrl);

        if (response.data?.data?.cashRegister) {
          setRegisterName(response.data?.data?.cashRegister?.name);
          setIsRegisterOpen(true);
        } else {
          setIsRegisterOpen(false);
        }

        setIsLoadingFalse();
      } catch (err) {
        setIsLoadingFalse();
      }
    };

    fetchCurrentRegister();

    setSelectedCategory('all');
    setDebouncedSearchQuery('');
    setSearchQuery('');
    setSummaryCollapsed(true);

    reset1();

    return () => {};
  }, [outletChange]);

  const [modalVisible, setModalVisible] = useState(false);
  const [existingCustomersModalVisible, setExistingCustomersModalVisible] =
    useState(false);

  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);
  const [paymentModalVisibile, setPaymentModalVisible] = useState(false);
  const [loyality, setLoyality] = useState(false);

  const handleOnSelectExistingCustomer = () => {
    setExistingCustomersModalVisible(true);
  };

  const handleOnSelectAddCustomer = () => {
    setAddCustomerModalVisible(true);
  };

  const handleOnSelectingAddCustomer = (customer: any) => {
    const customerLabel = customer.Name + ' (' + customer.Phone + ')';
    // setSelectedCustomer(customerLabel);
    setLoyality(true);
    setSelectedCustomerData(customer);
    fetchLoyalty(customer.id);
  };

  const fetchLoyalty = async (id: any) => {
    try {
      setIsLoadingTrue();
      const response = await getLoyaltyBalance(id, headerUrl);
      console.log('getLoyaltyBalance:', response);
      setIsLoadingFalse();
      setLoyalityBalance(response.data.data);
    } catch (error) {
      setIsLoadingFalse();
      console.error('Error getLoyaltyBalance:', error);
    }
  };

  const handleVariantProductSelection = (data: any) => {
    if (isRegisterOpen) {
      addItemToCart(
        data.product,
        data.selectedVariant,
        taxes[0],
        data.quantity,
        data.serial,
      );
      updateTotals();
    }
  };

  const handleSerialProductSelection = (data: any) => {
    addItemToCart(
      data.product,
      data.product.variants[0],
      taxes[0],
      1,
      data.serial,
    );
    updateTotals();
  };

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  useEffect(() => {
    setRedirectToProcessSalesFalse();
  }, []);

  const handleOpenRegister = () => {
    setRedirectToProcessSalesTrue();
    navigation.navigate('POS-Cash-Registers');
  };

  const [productDetailModalVisible, setProductDetailModalVisible] =
    useState(false);
  const [selectedCartProduct, setSelectedCartProduct] = useState<any>();
  const [selectedLineItem, setSelectedLineItem] = useState<LineItem>(
    {} as LineItem,
  );
  const [cashReceived, setCashReceived] = useState(0);

  const handleOnConfirmProductDetails = (currentLineItem: LineItem) => {
    const index = cart.items.findIndex(item => {
      item.product._id = currentLineItem.product._id;
    });

    if (index > -1) {
      cart.items[index] = currentLineItem;
    }

    setCart(cart);
    updateTotals();
  };

  const handleOnConfirmDiscount = (discount: Discount) => {
    setDiscountModalVisible(false);
    cart.selectedDiscount = discount;
    updateTotals();
  };

  const saleDetails = cart.items.map(item => ({
    combination: item.selectedVariant.combination || [],
    skuId: item.product.skuId || null,
    skuNo: item.product.skuNo || '',
    barcode: item.product.barcode || '',
    costPrice: item.selectedVariant.costPrice || 0,
    retailPrice: item.selectedVariant.retailPrice || 0,
    discount: 0,
    discountType: item.selectedVariant.discountTypeId,
    discountTypeId: item.selectedVariant.discountTypeId,
    price: item.selectedVariant.retailPrice || 0,
    productId: item.productId,
    productName: item.product.name,
    quantity: item.quantity,
    tax: item.selectedTax?.rate || 0,
    taxId: item.selectedTax?.value || '',
    total: getProductSubtotal(
      item.selectedVariant,
      item.quantity,
      item.selectedTax,
    ),
    _id: item.selectedVariant._id,
  }));

  const getPayload = async (
    status: any,
    receivedCash: any,
    receivedCredit: any,
    receivedLoyality: any,
    salesType: any,
  ) => {
    const outletId = await AsyncStorage.getItem('selectedOutlet');

    return {
      offlineUUID: uuid.v4(),
      customerContactNo: selectedCustomerData.Phone,
      customerId: selectedCustomerData.id || null,
      customerName: selectedCustomerData.Name,
      discountTypeId: cart.selectedDiscount?.id ?? (discountTypes[0] as any).id,
      discount: cart.selectedDiscount?.value || 0,
      orderDate: new Date().toISOString(),
      outletId: outletId,
      paymentStatus: status,
      paymentType: 'CARD',
      receivedCash: receivedCash,
      receivedCredit: receivedCredit,
      receivedLoyality: receivedLoyality,
      saleDetails,
      salesType: salesType,
      surcharge: 0,
    };
  };

  const handlePaymentSubmit = async (
    updatedReceivedCash: any,
    updatedReceivedCredit: any,
    updatedReceivedLoyalty: any,
  ) => {
    console.log('handlePaymentSubmit');
    try {
      setIsLoadingTrue();

      const payload = await getPayload(
        'PAID',
        updatedReceivedCash,
        updatedReceivedCredit,
        updatedReceivedLoyalty,
        'sales',
      );

      // const response = null;
      // const response1 = null;
      const response = await postSaleOrder(payload, headerUrl);
      const response1 = await getSaleDetials(
        response?.data?.data?._id,
        headerUrl,
      );

      reset();
      setIsLoadingFalse();
      ToastAndroid.show('Order Successful', ToastAndroid.LONG);

      sendForPrint(
        response?.data?.data?.orderId ?? 'SR',
        response1?.data?.data?.logo ?? '',
        payload,
        updatedReceivedCash,
        updatedReceivedCredit,
        updatedReceivedLoyalty,
      );
    } catch (err) {
      console.error('Error posting sale order:', err);
      setIsLoadingFalse();
      if (Platform.OS === 'android') {
        ToastAndroid.show(err?.response?.data?.error, ToastAndroid.LONG);
      }
    }
  };

  const handleLoyalityPaymentSubmit = async (updatedReceivedCash: any) => {
    try {
      setIsLoadingTrue();

      const payload = await getPayload(
        'PAID',
        0,
        0,
        updatedReceivedCash,
        'sales',
      );

      const response = await postSaleOrder(payload, headerUrl);
      const response1 = await getSaleDetials(response.data.data._id, headerUrl);
      reset();
      setIsLoadingFalse();
      ToastAndroid.show('Order Successful', ToastAndroid.LONG);

      sendForPrint(
        response?.data?.data?.orderId ?? 'SR',
        response1?.data?.data?.logo,
        payload,
        updatedReceivedCash,
        0,
        0,
      );
    } catch (err) {
      console.error('Error posting sale order:', err);
      setIsLoadingFalse();
    }
  };

  const handleParkSale = async () => {
    try {
      setIsLoadingTrue();

      const payload = await getPayload('PARKED', 0, 0, 0, 'sales');

      const response = await postSaleOrder(payload, headerUrl);

      console.log('Response post sale order:', response);
      reset();
      setIsLoadingFalse();
      ToastAndroid.show('Order Parked', ToastAndroid.LONG);
      // navigation.navigate('POS-Sales-History');
    } catch (err: any) {
      console.error('Error posting sale order:', err.response);
      setIsLoadingFalse();
    }
  };

  const handleRefundSale = async (
    updatedReceivedCash: any,
    updatedReceivedCredit: any,
    updatedReceivedLoyalty: any,
  ) => {
    try {
      setIsLoadingTrue();

      const payload = await getPayload(
        'PAID',
        updatedReceivedCash,
        updatedReceivedCredit,
        0,
        'refund',
      );

      const response = await postSaleOrder(payload, headerUrl);

      console.log('Response post sale order:', response);
      reset();
      setIsLoadingFalse();
      ToastAndroid.show('Order Parked', ToastAndroid.LONG);
      navigation.navigate('POS-Sales-History');
    } catch (err) {
      console.error('Error posting sale order:', err);
      setIsLoadingFalse();
    }
  };

  const reset = () => {
    setCart({items: [], selectedDiscount: undefined, notes: undefined} as Cart);
    setSubtotal(0);
    setCashReceived(0);
    setDiscountTotal(0);
    setTaxTotal(0);
    setCartTotal(0);
    // setSelectedCustomer('Add Customer');
    setSelectedCustomerData({
      Name: 'Walk-In Customer',
      Phone: '0',
    });
    setPaymentModalVisible(false);
    setLoyality(false);
    setSalesFlag(false);
    setSalesId('');
    setNotes('');
  };

  const reset1 = () => {
    setCart({items: [], selectedDiscount: undefined, notes: undefined} as Cart);
    setSubtotal(0);
    setCashReceived(0);
    setDiscountTotal(0);
    setTaxTotal(0);
    setCartTotal(0);
    // setSelectedCustomer('Add Customer');
    setSelectedCustomerData({
      Name: 'Walk-In Customer',
      Phone: '0',
    });
    setPaymentModalVisible(false);
    setLoyality(false);
    setNotes('');
  };

  function sendForPrint(
    invoiceNo: any,
    logo: any,
    payload: any,
    cash: any,
    credit: any,
    loyalty: any,
  ) {
    var printObjs = [];
    printObjs.push({
      text: logo,
      dir: 'center',
      size: '12',
      next_line: false,
      type: 'bitmap',
    });
    // printObjs.push({
    //   text: moment().format('M/D/YY h:mm A'),
    //   dir: 'left',
    //   size: '10',
    //   next_line: false,
    // });
    // printObjs.push({
    //   text: 'Poxfy E-POS',
    //   dir: 'center',
    //   size: '10',
    //   next_line: false,
    // });
    // printObjs.push({
    //   text: ' ',
    //   dir: 'right',
    //   size: '10',
    //   next_line: true,
    // });
    printObjs.push({
      text: outletName,
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: outlet.phone,
      dir: 'center',
      size: '21',
      next_line: true,
    });
    printObjs.push({
      text: outlet.email,
      dir: 'center',
      size: '21',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: 'Tax Invoice',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });
    printObjs.push({
      text: 'Printed At: ' + moment().format('DD MMM YYYY hh:mm:ss a'),
      dir: 'center',
      size: '21',
      next_line: true,
      style: 'bold',
    });

    var linePieces = 114;
    var borderStr = '';
    for (var i = 0; i <= linePieces; i++) {
      borderStr += '_';
    }
    printObjs.push({
      text: borderStr,
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });

    printObjs.push({
      text: 'Invoice #',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: invoiceNo,
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: 'Created By',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: userFullName,
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: 'Order Date',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: moment().format('DD MMM YYYY hh:mm:ss a'),
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: 'Customer Name',
      dir: 'left',
      size: '21',
      next_line: false,
    });
    printObjs.push({
      text: payload.customerName,
      dir: 'right',
      size: '21',
      next_line: true,
    });
    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      next_line: true,
    });

    printObjs.push({
      text: 'Qty',
      dir: 'left',
      size: '21',
      next_line: false,
      style: 'bold',
    });
    printObjs.push({
      text: 'Item',
      dir: 'left',
      size: '21',
      next_line: false,
      style: 'bold',
      weight: 3.0,
    });
    printObjs.push({
      text: 'Price',
      dir: 'right',
      size: '21',
      next_line: false,
      style: 'bold',
    });
    printObjs.push({
      text: 'Total',
      dir: 'right',
      size: '21',
      next_line: true,
      style: 'bold',
    });
    saleDetails.forEach((item: any) => {
      printObjs.push({
        text: borderStr,
        dir: 'center',
        size: '10',
        style: 'bold',
        next_line: true,
      });
      printObjs.push({
        text: '  ' + item.quantity,
        dir: 'left',
        size: '21',
        next_line: false,
      });
      printObjs.push({
        text: item.productName,
        dir: 'left',
        size: '21',
        next_line: false,
        weight: 3.0,
      });
      printObjs.push({
        text: item.retailPrice.toFixed(2),
        dir: 'right',
        size: '21',
        next_line: false,
      });
      printObjs.push({
        text: item.total.toFixed(2),
        dir: 'right',
        size: '21',
        next_line: true,
      });
    });

    printObjs.push({
      text: borderStr,
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      next_line: true,
    });

    if ((getDiscountTotal() || 0) > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Discount',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: (getDiscountTotal()?.toFixed(2) ?? 0.0) + '  ',
        dir: 'right',
        size: '21',
        next_line: true,
      });
    }

    if ((getTaxTotal() || 0) > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Tax',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: getTaxTotal().toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        next_line: true,
      });
    }

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: 'Subtotal',
      dir: 'right',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: getCartSubTotal().toFixed(2) + '  ',
      dir: 'right',
      size: '21',
      next_line: true,
    });

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: 'Total',
      dir: 'right',
      size: '21',
      style: 'bold',
      next_line: false,
    });
    printObjs.push({
      text: getCartTotal().toFixed(2) + '  ',
      dir: 'right',
      size: '21',
      style: 'bold',
      next_line: true,
    });

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '10',
      style: 'bold',
      next_line: true,
    });

    if (cash > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Cash',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: cash.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: true,
      });
    }

    if (credit > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Credit',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: credit.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: true,
      });
    }

    if (loyalty > 0) {
      printObjs.push({
        text: ' ',
        dir: 'center',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: 'Loyalty',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: false,
      });
      printObjs.push({
        text: loyalty.toFixed(2) + '  ',
        dir: 'right',
        size: '21',
        style: 'bold',
        next_line: true,
      });
    }

    printObjs.push({
      text: ' ',
      dir: 'center',
      size: '15',
      next_line: true,
    });
    printObjs.push({
      text: 'Products Count: ' + saleDetails.length,
      dir: 'center',
      size: '21',
      next_line: true,
    });

    try {
      const str = JSON.stringify([printObjs]);
      NativePrintSdk?.printJson(str);
    } catch (error) {
      console.error('Error calling PrintSdk:', error);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.productView}>
        {registerName && (
          <View style={styles.outletView}>
            <Text style={styles.outletLabel}>{outletName}</Text>
            <Icon
              name={'chevron-double-right'}
              size={17}
              color={'black'}
              style={{fontWeight: 'bold'}}
            />

            <Text style={styles.cashRegisterLabel}>{registerName}</Text>
          </View>
        )}
        <View style={styles.searchView}>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <TextInput
              style={styles.searchText}
              value={searchQuery}
              placeholder="Find product by name, barcode"
              onChangeText={setSearchQuery}
              keyboardType="default"
            />
          </View>
          <TouchableOpacity
            onPress={() => {}}
            disabled={true}
            style={styles.actionButton}>
            <Text style={styles.buttonText}>Gift Card</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={true}
            style={{
              overflow: 'visible',
            }}>
            <View style={styles.categoryView}>
              {categories.map((category: any) => (
                <TouchableOpacity
                  key={category._id}
                  onPress={() => setSelectedCategory(category._id)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category._id &&
                      styles.selectedCategoryButton,
                  ]}>
                  <View style={styles.buttonContent}>
                    <Image
                      source={
                        category.image
                          ? {uri: category.image}
                          : require('../../../assets/images/no-image.png')
                      }
                      style={[
                        styles.roundedImage,
                        selectedCategory === category._id &&
                          styles.selectedImageBorder,
                      ]}
                    />

                    <Text
                      style={[
                        styles.buttonText1,
                        selectedCategory === category._id &&
                          styles.selectedText,
                      ]}>
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{flex: 1}}>
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={true}>
            <View style={styles.productCardsView}>
              {products.map((product: any, index: number) => (
                <ProductCard
                  key={index}
                  product={product}
                  onSelect={() => handleSelectProduct(product)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.cartView}>
        <View style={styles.card}>
          {/* <ScrollView contentContainerStyle={{flexGrow: 1}}> */}
          {/* <View style={styles.cardView}> */}
          <View style={{}}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: 8,
                }}>
                <Icon
                  name="account-cog-outline"
                  size={26}
                  color={'rgb(103, 223, 135)'}
                  style={{fontWeight: 500}}
                />
                <Text style={styles.sectionTitle}>
                  {selectedCustomerData.Name}{' '}
                  {selectedCustomerData.Phone != ''
                    ? '(' + selectedCustomerData.Phone + ')'
                    : ''}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.productsView}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {cart.items.map((item: LineItem, index: any) => {
                const selectedAttributes = Object.values(
                  item.product.attributes || {},
                ).map(String);

                const matchedVariant = item.product.variants?.find(
                  (variant: any) => {
                    return (
                      Array.isArray(variant.combination) &&
                      variant.combination.length ===
                        Object.keys(selectedAttributes).length &&
                      Object.values(selectedAttributes).every(attr =>
                        variant.combination.includes(attr),
                      )
                    );
                  },
                );
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedCartProduct(item.product);
                      setSelectedLineItem(item);
                      setProductDetailModalVisible(true);
                    }}>
                    <View style={styles.product} key={index}>
                      <View style={styles.productImageContainer}>
                        <View style={styles.quantityBadge}>
                          <Text style={styles.quantityText}>
                            {item.quantity}
                          </Text>
                        </View>
                        <Image
                          source={
                            item.product?.images?.length ?? 0 > 0
                              ? {
                                  uri: '' + item.product?.images[0],
                                }
                              : require('../../../assets/images/no-image.png')
                          }
                          style={styles.productImage}
                        />
                      </View>

                      <View style={styles.productDetails}>
                        <Text style={styles.productName}>
                          {item.product.name}
                        </Text>
                        {item.selectedVariant.combination.length > 0 && (
                          <Text style={styles.productName}>
                            {item.selectedVariant.combination.join(' / ')}
                          </Text>
                        )}
                      </View>

                      <View style={styles.productActionView}>
                        <TouchableOpacity>
                          <Text style={styles.productPrice}>
                            {(
                              item.selectedVariant.retailPrice * item.quantity
                            ).toFixed(2)}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveProduct(
                              item.product._id,
                              item.product.attributes,
                            )
                          }
                          style={styles.removeButton}>
                          <FeatherIcon
                            name="x-circle"
                            size={26}
                            color={'#A3A3A3'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {!isRegisterOpen && (
            <TouchableOpacity
              onPress={handleOpenRegister}
              style={styles.openRegisterButton}>
              <Text style={styles.openRegisterText}>Open Register</Text>
            </TouchableOpacity>
          )}

          <View
            pointerEvents={!isRegisterOpen ? 'none' : 'auto'} // Disables all child elements
            style={{opacity: isRegisterOpen ? 1 : 0.7}}>
            {' '}
            {/* Notes Section */}
            <View
              style={{height: summaryCollapsed ? 48 : 260, overflow: 'hidden'}}>
              <TouchableOpacity
                onPress={() => setSummaryCollapsed(!summaryCollapsed)}>
                <View
                  style={[
                    styles.section,
                    {
                      paddingTop: 10,
                      justifyContent: 'space-between',
                    },
                  ]}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name={'calendar-text-outline'}
                      size={26}
                      color={'rgb(103, 223, 135)'}
                      style={{fontWeight: '500'}}
                    />
                    <Text style={styles.sectionTitle}>Notes</Text>
                  </View>
                  <Icon
                    name={summaryCollapsed ? 'chevron-up' : 'chevron-down'}
                    size={26}
                    color={'rgba(116, 116, 116, 1)'}
                    style={{fontWeight: '500'}}
                  />
                </View>
              </TouchableOpacity>
              <TextInput
                editable={isRegisterOpen}
                style={[styles.input, !isRegisterOpen && {opacity: 0.7}]}
                placeholder="Notes"
                placeholderTextColor="#A3A3A3"
                value={notes}
                onChangeText={text => {
                  setNotes(text);
                }}
              />
              {/* Payment Summary Section */}
              <View style={styles.section}>
                <Icon
                  name="wallet-outline"
                  size={26}
                  color={'rgb(103, 223, 135)'}
                  style={{fontWeight: 500}}
                />
                <Text style={styles.sectionTitle}>Payment Summary</Text>
              </View>
              <View style={[styles.paymentSummaryView, {marginTop: 0}]}>
                <View style={[styles.paymentSummary, {paddingTop: 5}]}>
                  <Text style={styles.summaryLabel}>Sub Total</Text>
                  <Text style={styles.summaryValue}>{subtotal.toFixed(2)}</Text>
                </View>

                <TouchableOpacity onPress={() => setDiscountModalVisible(true)}>
                  <View style={styles.paymentSummary}>
                    <Text style={[styles.sectionTitle, {marginLeft: 0}]}>
                      Discount
                    </Text>
                    <Text style={[styles.summaryValue]}>
                      {discountTotal.toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.paymentSummary}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>{taxTotal.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.paymentSummary}>
              <Text style={styles.summaryLabel}>Grand Total</Text>
              <Text style={styles.summaryValue}>{cartTotal.toFixed(2)}</Text>
            </View>
            {/* Payment Buttons */}
            <View style={styles.paymentButtonsView}>
              <TouchableOpacity
                onPress={reset}
                style={[
                  styles.paymentButton,
                  !isRegisterOpen && {opacity: 0.7},
                ]}>
                <Text style={styles.paymentText}>DISCARD</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleParkSale}
                disabled={!isRegisterOpen || cart.items.length === 0}
                style={[
                  styles.paymentButton,
                  !isRegisterOpen && {opacity: 0.7},
                ]}>
                <Text style={styles.paymentText}>PARK</Text>
              </TouchableOpacity>
            </View>
            {isRegisterOpen && (
              <TouchableOpacity
                disabled={cart.items.length === 0}
                onPress={() => setPaymentModalVisible(true)}
                style={[
                  styles.payButtonView,
                  {opacity: cart.items.length === 0 ? 0.7 : 1},
                ]}>
                <Text style={styles.openRegisterText}>PAY</Text>
                <Text style={styles.openRegisterText}>
                  {cartTotal.toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* </View> */}
          {/* </ScrollView> */}
        </View>

        <ProcessCustomerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectExistingCustomer={handleOnSelectExistingCustomer}
          onSelectAddCustomer={handleOnSelectAddCustomer}
          setSelectedCustomerData={setSelectedCustomerData}
        />

        <AddExistingCustomerModal
          visible={existingCustomersModalVisible}
          onClose={() => setExistingCustomersModalVisible(false)}
          onSelectCustomer={handleOnSelectingAddCustomer}
        />

        <ProductVariantModal
          visible={variantModalVisible}
          onClose={() => setVariantModalVisible(false)}
          selectedProduct={selectedProduct}
          onConfirm={handleVariantProductSelection}
        />

        <ProductSerialModal
          visible={serialModalVisible}
          onClose={() => setSerialModalVisible(false)}
          selectedProduct={selectedProduct}
          onConfirm={handleSerialProductSelection}
        />

        <AddCustomerModal
          visible={addCustomerModalVisible}
          gender={[]}
          setRefetch={{}}
          onClose={() => setAddCustomerModalVisible(false)}
        />

        <ProductDetailModal
          visible={productDetailModalVisible}
          onClose={() => setProductDetailModalVisible(false)}
          taxes={taxes}
          selectedProduct={selectedCartProduct}
          selectedLineItem={selectedLineItem}
          onConfirm={handleOnConfirmProductDetails}
        />

        <ErrorModal
          error={'Error: Please Open Register'}
          errorModalVisible={errorModalVisible}
          setErrorModalVisible={setErrorModalVisible}
        />

        <DiscountModal
          visible={discountModalVisible}
          onClose={() => setDiscountModalVisible(false)}
          onConfirm={handleOnConfirmDiscount}
          discountTypes={discountTypes}
        />

        <PaymentModal
          visible={paymentModalVisibile}
          onClose={() => setPaymentModalVisible(false)}
          onSubmit={(
            updatedReceivedCash: any,
            updatedReceivedCredit: any,
            updatedReceivedLoyalty: any,
          ) => {
            if (salesFlag) {
              handleRefundSale(
                updatedReceivedCash,
                updatedReceivedCredit,
                updatedReceivedLoyalty,
              );
            } else {
              handlePaymentSubmit(
                updatedReceivedCash,
                updatedReceivedCredit,
                updatedReceivedLoyalty,
              );
            }
          }}
          onLoyalitySubmit={handleLoyalityPaymentSubmit}
          subTotal={subtotal}
          discount={discountTotal}
          tax={taxTotal}
          grandTotal={cartTotal}
          cashReceived={cashReceived}
          setCashReceived={setCashReceived}
          loyality={loyality}
          loyalityBalance={loyalityBalance}
          customer={selectedCustomerData}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
    flex: 1,
  },
  productView: {
    width: '65%',
  },
  cartView: {
    flex: 1,
  },
  outletView: {
    paddingStart: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10,
    paddingBottom: 10,
    borderBottomColor: 'rgb(186, 186, 186)',
    borderBottomWidth: 1,
  },
  outletLabel: {
    fontSize: 17,
    fontWeight: '500',
  },
  cashRegisterLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 20,
    width: '80%',
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  searchTextFocused: {
    borderWidth: 1,
    borderColor: 'rgb(230, 231, 235)',
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'rgb(244,244,244)',
    justifyContent: 'center',
    verticalAlign: 'middle',
    textAlignVertical: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: '18.5%',
  },
  buttonText: {
    color: 'rgb(186,186,186)',
    fontWeight: '400',
    fontSize: 14,
  },
  categoryView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
    overflow: 'visible',
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    verticalAlign: 'middle',
    textAlignVertical: 'center',
    paddingVertical: 6,
    paddingLeft: 5,
    paddingRight: 15,
    borderRadius: 20,
    minWidth: 40,
    height: 35,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  selectedCategoryButton: {
    borderColor: 'rgb(103,223,135)',
    backgroundColor: 'rgb(245,255,250)',
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundedImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderColor: 'rgb(186,186,186)',
    borderWidth: 1,
    padding: 2,
  },
  selectedImageBorder: {
    borderColor: 'rgb(186,186,186)',
    borderWidth: 1,
  },
  buttonText1: {
    fontSize: 14,
    textAlign: 'center',
    color: 'rgb(186,186,186)',
    fontWeight: '400',
  },
  selectedText: {
    color: 'rgb(103,223,135)',
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    borderRadius: 12,
    elevation: 0,
    shadowColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  cardView: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'yellow',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 14,
    color: 'rgb(103, 223, 135)',
    fontWeight: '500',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  openRegisterButton: {
    backgroundColor: 'rgb(236, 105, 100)',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 12,
  },
  paymentButton: {
    backgroundColor: 'rgb(234, 240, 253)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  openRegisterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentText: {
    color: '#A3A3A3',
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 10,
    color: '#000',
  },
  paymentSummaryView: {
    marginTop: 5,
  },
  paymentSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  summaryValue: {
    color: '#A3A3A3',
    fontSize: 14,
  },
  discount: {
    color: '#3B82F6',
  },
  paymentButtonsView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },
  payButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(236, 105, 100)',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 18,
    height: 50,
  },
  productsView: {
    flex: 1,
    width: '100%',
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 5,
    width: '100%',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    height: 80,
  },
  productActionView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productImageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  quantityBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: 'rgb(236, 105, 100)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 30,
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(103, 223, 135)',
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: '#A3A3A3',
  },
  productCardsView: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
});

export default ProcessSales;
