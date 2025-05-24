import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useAuthStore from '../../redux/feature/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {LineItem, Tax} from '../../screens/pos/process-sales';

interface SlideInModalProps {
  visible: boolean;
  taxes: Tax[];
  onClose: () => void;
  selectedProduct: any;
  selectedLineItem: LineItem;
  onConfirm: any;
}

const ProductDetailModal: React.FC<SlideInModalProps> = ({
  visible,
  taxes,
  onClose,
  selectedProduct,
  selectedLineItem,
  onConfirm,
}) => {
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      name: '',
    },
  });

  const slideAnim = useRef(new Animated.Value(500)).current;
  const nameInputRef = useRef<TextInput>(null);
  const [selectedTax, setSelectedTax] = useState<Tax>({} as Tax);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    } else {
      Animated.timing(slideAnim, {
        toValue: 500, // Slide out
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const {isLoading} = useAuthStore();

  const [serial, setSerial] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedLineItem.product) {
      setSerial(
        selectedLineItem.product.serialNo
          ? selectedLineItem.product.serialNo.toString()
          : '',
      );
      const totalPrice = selectedLineItem.selectedVariant.retailPrice;
      const qty = selectedLineItem.quantity;
      setRetailPrice(totalPrice.toString());
      setQuantity(qty);
      setSelectedTax(selectedLineItem.selectedTax);
    }
  }, [visible]); // Runs whenever selectedProduct changes

  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleConfirm = () => {
    let newErrors: {[key: string]: string} = {};

    if (
      selectedLineItem.product.askSerialNo &&
      (selectedLineItem.product.serial == undefined ||
        selectedLineItem.product?.serial == '')
    ) {
      newErrors.serial = 'Serial Number is required';
    }

    if (!retailPrice.trim()) {
      newErrors.retailPrice = 'Retail Price Ex. Tax is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const selectedData = {
      product: selectedProduct,
      serial,
      quantity: 1,
      attributes: selectedAttributes,
    };

    selectedLineItem.quantity = quantity;
    selectedLineItem.selectedTax = selectedTax;
    selectedLineItem.selectedVariant.retailPrice = Number(retailPrice);

    onConfirm(selectedLineItem);

    setSelectedAttributes({});
    setSerial('');
    setErrors({});
    onClose();
  };

  const {headerUrl, setIsLoadingTrue, setIsLoadingFalse} = useAuthStore();

  const handleOnClose = () => {
    setErrors({});
    onClose();
    setSerial('');
    setRetailPrice('');
    setQuantity(1);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleOnClose} />
        <Animated.View
          style={[styles.modal, {transform: [{translateX: slideAnim}]}]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#ED6964"
                />
              </TouchableOpacity>
              <Text style={styles.title}></Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Quantity:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    setQuantity((prev: any) => Math.max(1, prev - 1))
                  }>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input1}
                  value={String(quantity)}
                  keyboardType="numeric"
                  onChangeText={text => setQuantity(Number(text) || 1)}
                />

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity((prev: any) => prev + 1)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>* Retail Price Ex.Tax</Text>
            </View>

            <TextInput
              ref={nameInputRef}
              style={[styles.input, errors.retailPrice && {borderColor: 'red'}]}
              placeholder="Enter Retail Price Ex.Tax"
              onChangeText={text => {
                setRetailPrice(text);
                if (errors.retailPrice) {
                  setErrors(prev => ({...prev, retailPrice: ''}));
                }
              }}
              value={retailPrice}
            />
            {errors.retailPrice && (
              <Text style={styles.errorText}>{errors.retailPrice}</Text>
            )}

            {selectedProduct?.serialNo && (
              <>
                <View style={styles.row}>
                  <Text style={[styles.label, {marginTop: 10}]}>
                    * Serial No
                  </Text>
                </View>

                <TextInput
                  style={[styles.input, errors.serial && {borderColor: 'red'}]}
                  placeholder="Enter Serial Number"
                  onChangeText={text => {
                    setSerial(text);
                    if (errors.serial) {
                      setErrors(prev => ({...prev, serial: ''}));
                    }
                  }}
                  value={serial}
                />
                {errors.serial && (
                  <Text style={styles.errorText}>{errors.serial}</Text>
                )}
              </>
            )}

            <View style={styles.row}>
              <View style={styles.row1}>
                <Icon
                  name="file-table-box-multiple-outline"
                  size={26}
                  color={'rgb(103, 223, 135)'}
                  style={{fontWeight: 500}}
                />
                <Text style={styles.sectionTitle}>Tax Rate</Text>
              </View>
            </View>

            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={taxes}
              labelField="label"
              valueField="value"
              placeholder="Tax Rate"
              value={selectedTax}
              onChange={item => {
                setSelectedTax(item);
                if (errors.tax) {
                  setErrors(prev => ({...prev, tax: ''}));
                }
              }}
              selectedTextStyle={styles.selectedText1}
              itemTextStyle={styles.itemText}
              itemContainerStyle={styles.itemContainer}
              flatListProps={{
                nestedScrollEnabled: true,
                keyboardShouldPersistTaps: 'handled',
              }}
              mode="auto"
            />

            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.button, isLoading && {opacity: 0.7}]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  notesText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(103, 223, 135)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backdrop: {
    flex: 1,
    width: '100%',
  },
  modal: {
    position: 'absolute',
    right: 0,
    width: '40%',
    maxHeight: '80%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomColor: 'rgb(240,240,240)',
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 15,
    color: 'rgb(103, 223, 135)',
    fontWeight: '500',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    alignContent: 'center',
  },

  row1: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  input: {
    height: 45,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 5,
    borderColor: 'rgb(240,240,240)',
    borderWidth: 1,
  },

  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 12,
    marginBottom: 5,
    borderColor: 'rgb(240,240,240)',
    borderWidth: 1,
    justifyContent: 'center',
  },
  dropdownContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(200,200,200)',
    paddingVertical: 5,
    maxHeight: 200, // Ensures dropdown is not too large
    elevation: 5, // Adds shadow effect for visibility on Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedText1: {
    textAlign: 'center',
    fontSize: 14,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 14,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  input1: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 15,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    // borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: 'lightgreen',
    borderColor: 'lightgreen',
  },
  optionText: {
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ED6964',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 5,
    width: '80%',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    padding: 12,
    paddingHorizontal: 20,
    height: '100%',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ProductDetailModal;
