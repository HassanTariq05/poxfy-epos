import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import BasicCard from '../../../components/basic-card';
import {Card} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProductCard from '../../../components/pos/process-sales/product-card';
import {
  getProductCategories,
  getProducts,
} from '../../../services/process-sales';
import useAuthStore from '../../../redux/feature/store';
import ProcessCustomerModal from '../../../components/modals/process-customer';
import AddCustomerModal from '../../../components/modals/add-customer';
import AddExistingCustomerModal from '../../../components/modals/add-existing-customer-modal';
import ProductVariantModal from '../../../components/modals/product-variant-modal';

function ProcessSales() {
  const [searchQuery, setSearchQuery] = useState('');

  const {headerUrl, setIsLoadingTrue, setIsLoadingFalse} = useAuthStore();
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'all',
  );

  const [products, setProducts] = useState<any>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>('Add Customer');

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [cartItems, setCartItems] = useState<any>([]);

  const [variantModalVisible, setVariantModalVisible] = useState<any>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  const handleSelectProduct = (selectedProduct: any) => {
    console.log('Selected product: ', selectedProduct);
    setSelectedProduct(selectedProduct);

    if (selectedProduct.type === 'PRODUCT_WITH_VARIANT') {
      setVariantModalVisible(true);
    } else if (selectedProduct.type === 'NO_VARIANT') {
      setCartItems((prevCart: any) => {
        const existingProductIndex = prevCart.findIndex(
          (item: any) => item.product._id === selectedProduct._id,
        );

        if (existingProductIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingProductIndex].quantity += 1;
          return updatedCart;
        } else {
          return [
            ...prevCart,
            {
              product: selectedProduct,
              name: selectedProduct.name,
              price: selectedProduct.price,
              image: selectedProduct.image,
              quantity: 1,
            },
          ];
        }
      });
    }
  };

  const handleRemoveProduct = (productId: string, attributes?: any) => {
    setCartItems((prevCart: any) =>
      prevCart.filter((item: any) => {
        if (item.product._id !== productId) {
          return true;
        }
        if (!attributes) {
          return false;
        }
        return !(
          item.attributes?.Size === attributes?.Size &&
          item.attributes?.Color === attributes?.Color &&
          item.attributes?.Stuff === attributes?.Stuff
        );
      }),
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingTrue();
      let url = `product?isSale=true&active=true`;

      if (debouncedSearchQuery.trim() !== '') {
        url += `&name=${debouncedSearchQuery}`;
      }
      if (selectedCategory !== 'all') {
        url += `&productTypeIds=${selectedCategory}`;
      }

      try {
        const getProductsResponse = await getProducts(url, headerUrl);
        console.log(
          'Get Products response:',
          getProductsResponse.data.data.data,
        );

        setProducts(getProductsResponse.data.data.data);
        setIsLoadingFalse();
      } catch (error) {
        setIsLoadingFalse();
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearchQuery]);

  useEffect(() => {
    const getAllProductCategories = async () => {
      setIsLoadingTrue();
      try {
        const getCategoriesResponse = await getProductCategories(headerUrl);
        console.log(
          'Get Categories response: ',
          getCategoriesResponse.data.data.data,
        );

        const updatedCategories = [
          {_id: 'all', name: 'All', image: null},
          ...getCategoriesResponse.data.data.data,
        ];
        setCategories(updatedCategories);
        setIsLoadingFalse();
        console.log(updatedCategories);
      } catch (error) {
        setIsLoadingFalse();
        console.error('Error fetching categories:', error);
      }
    };
    getAllProductCategories();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [existingCustomersModalVisible, setExistingCustomersModalVisible] =
    useState(false);

  const [addCustomerModalVisible, setAddCustomerModalVisible] = useState(false);

  const handleOnSelectExistingCustomer = () => {
    setExistingCustomersModalVisible(true);
  };

  const handleOnSelectAddCustomer = () => {
    setAddCustomerModalVisible(true);
  };

  const handleOnSelectingAddCustomer = (customer: any) => {
    console.log('Customer selected: ', customer);
    const customerLabel = customer.Name + ' (' + customer.Phone + ')';
    setSelectedCustomer(customerLabel);
  };

  const handleVariantProductSelection = (selectedProductVariant: any) => {
    if (
      !selectedProductVariant ||
      !selectedProductVariant.product ||
      !selectedProductVariant.attributes
    ) {
      console.error('Invalid product data:', selectedProductVariant);
      return;
    }

    setCartItems((prevCart: any) => {
      const existingProductIndex = prevCart.findIndex((item: any) => {
        if (item.product._id !== selectedProductVariant.product._id)
          return false;

        return Object.keys(selectedProductVariant.attributes).every(
          key =>
            item.attributes?.[key] === selectedProductVariant.attributes[key],
        );
      });

      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += 1;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            product: selectedProductVariant.product,
            name: selectedProductVariant.product.name,
            price: selectedProductVariant.product.price,
            image: selectedProductVariant.product.image,
            attributes: {...selectedProductVariant.attributes},
            quantity: selectedProductVariant.quantity || 1,
          },
        ];
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.productView}>
        <View style={styles.outletView}>
          <Text style={styles.outletLabel}>Main Store</Text>
          <Icon
            name={'chevron-double-right'}
            size={30}
            color={'black'}
            style={{fontWeight: 'bold'}}
          />

          <Text style={styles.cashRegisterLabel}>Cash Register</Text>
        </View>
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
          <ScrollView horizontal showsVerticalScrollIndicator={true}>
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
          <ScrollView showsVerticalScrollIndicator={true}>
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
        <Card style={styles.card}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.cardView}>
              {/* Add Customer Section */}
              <View style={styles.section}>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="account-cog-outline"
                    size={26}
                    color={'rgb(103, 223, 135)'}
                    style={{fontWeight: 500}}
                  />
                  <Text style={styles.sectionTitle}>{selectedCustomer}</Text>
                </TouchableOpacity>
              </View>

              <ProcessCustomerModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectExistingCustomer={handleOnSelectExistingCustomer}
                onSelectAddCustomer={handleOnSelectAddCustomer}
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

              <AddCustomerModal
                visible={addCustomerModalVisible}
                gender={[]}
                setRefetch={{}}
                onClose={() => setAddCustomerModalVisible(false)}
              />

              <View style={styles.divider} />

              <View style={styles.productsView}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                  {cartItems.map((product: any, index: any) => {
                    const selectedAttributes = Object.values(
                      product.attributes || {},
                    ).map(String);

                    const matchedVariant = product.product.variants?.find(
                      (variant: any) => {
                        return (
                          Array.isArray(variant.combination) &&
                          variant.combination.length ===
                            selectedAttributes.length &&
                          selectedAttributes.every(attr =>
                            variant.combination.includes(attr),
                          )
                        );
                      },
                    );
                    return (
                      <View style={styles.product} key={index}>
                        {/* Product Image & Quantity */}
                        <View style={styles.productImageContainer}>
                          <View style={styles.quantityBadge}>
                            <Text style={styles.quantityText}>
                              {product.quantity}
                            </Text>
                          </View>
                          <Image
                            source={
                              product.images?.image
                                ? {
                                    uri: product.images?.image,
                                  }
                                : require('../../../assets/images/no-image.png')
                            }
                            style={styles.productImage}
                          />
                        </View>

                        {/* Product Name & Price */}
                        <View style={styles.productDetails}>
                          <Text style={styles.productName}>
                            {product.product.name}
                          </Text>
                          {product.attributes &&
                            Object.keys(product.attributes).length > 0 && (
                              <Text style={styles.productName}>
                                {['Size', 'Color', 'Stuff']
                                  .map(
                                    attr =>
                                      product.attributes[attr] ||
                                      product.attributes[attr.toLowerCase()],
                                  ) // Handle different key cases
                                  .filter(Boolean) // Remove undefined or empty values
                                  .join(' / ')}
                              </Text>
                            )}
                        </View>

                        <View style={styles.productActionView}>
                          <TouchableOpacity>
                            <Text style={styles.productPrice}>
                              {matchedVariant
                                ? matchedVariant.retailPrice?.toFixed(2)
                                : product.product.price?.toFixed(2)}
                            </Text>
                          </TouchableOpacity>

                          {/* Remove Button */}
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveProduct(
                                product.product._id,
                                product.attributes,
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
                    );
                  })}
                </ScrollView>
              </View>

              {/* Open Register Button */}
              <TouchableOpacity style={styles.openRegisterButton}>
                <Text style={styles.openRegisterText}>Open Register</Text>
              </TouchableOpacity>

              {/* Notes Section */}
              <View style={styles.section}>
                <Icon
                  name={'calendar-text-outline'}
                  size={26}
                  color={'rgb(103, 223, 135)'}
                  style={{fontWeight: 500}}
                />
                <Text style={styles.sectionTitle}>Notes</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Notes"
                placeholderTextColor="#A3A3A3"
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
                  <Text style={styles.summaryValue}>0</Text>
                </View>

                <View style={styles.paymentSummary}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={[styles.summaryValue, styles.discount]}>
                    0.00
                  </Text>
                </View>

                <View style={styles.paymentSummary}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>0.00</Text>
                </View>

                <View style={styles.paymentSummary}>
                  <Text style={styles.summaryLabel}>Grand Total</Text>
                  <Text style={styles.summaryValue}>0.00</Text>
                </View>
              </View>

              <View style={styles.paymentButtonsView}>
                <TouchableOpacity style={styles.paymentButton}>
                  <Text style={styles.paymentText}>DISCARD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentButton}>
                  <Text style={styles.paymentText}>PARK</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.payButtonView}>
                <Text style={styles.openRegisterText}>PAY</Text>
                <Text style={styles.openRegisterText}>0.00</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    paddingRight: 20,
  },
  productView: {
    width: '65%',
  },
  cartView: {
    width: '35%',
  },
  outletView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
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
    fontSize: 22,
    fontWeight: '500',
  },
  cashRegisterLabel: {
    fontSize: 22,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    // marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
  },
  cardView: {
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    marginVertical: 8,
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
  },
  //   productsView: {
  //     backgroundColor: 'pink',
  //     height: 205,
  //     width: '100%',
  //   },
  productsView: {
    height: 205,
    width: '100%',
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 5,
    // backgroundColor: '#fff',
    // marginBottom: 10,
    width: '100%',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
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

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Shadow for Android
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
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
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
  //   productCardsView: {
  //     marginTop: 10,
  //     flexDirection: 'row',
  //     gap: 10,
  //     flexWrap: 'wrap',
  //   },
  productCardsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

export default ProcessSales;
