import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createSlug} from '../../services/product/brand';
import useAuthStore from '../../redux/feature/store';

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  selectedProduct: any;
  onConfirm: any;
}

const ProductVariantModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  selectedProduct,
  onConfirm,
}) => {
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      name: '',
    },
  });

  const slideAnim = useRef(new Animated.Value(500)).current;
  const nameInputRef = useRef<TextInput>(null);

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

  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSelection = (attrType: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrType]: value,
    }));
  };

  const handleConfirm = () => {
    let newErrors: {[key: string]: string} = {};

    if (Array.isArray(selectedProduct?.attributes)) {
      selectedProduct.attributes.forEach((attr: any) => {
        if (!selectedAttributes[attr.type]) {
          newErrors[attr.type] = `${attr.type} is required`;
        }
      });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const selectedData = {
      product: selectedProduct,
      quantity,
      attributes: selectedAttributes,
    };

    onConfirm(selectedData);
    console.log('Product Confirmed: ', selectedData);
    setSelectedAttributes({});
    setQuantity(1);
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
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
              <Text style={styles.title}>{selectedProduct?.name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Quantity:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(prev => Math.max(1, prev - 1))}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  value={String(quantity)}
                  keyboardType="numeric"
                  onChangeText={text => setQuantity(Number(text) || 1)}
                />

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(prev => prev + 1)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {Array.isArray(selectedProduct?.attributes) &&
              selectedProduct.attributes.map((attr: any) => (
                <>
                  <View key={attr.type} style={styles.row}>
                    <Text style={styles.label}>* {attr.type} :</Text>
                    <View style={styles.optionsRow}>
                      {Array.isArray(attr.values) &&
                        attr.values.map((value: any, index: number) => (
                          <TouchableOpacity
                            key={`${attr.type}-${value}`}
                            style={[
                              styles.option,
                              selectedAttributes[attr.type] === value &&
                                styles.selectedOption,
                              index === 0
                                ? {
                                    borderTopLeftRadius: 18,
                                    borderBottomLeftRadius: 18,
                                  }
                                : {},
                              index === attr.values.length - 1
                                ? {
                                    borderTopRightRadius: 18,
                                    borderBottomRightRadius: 18,
                                  }
                                : {},
                            ]}
                            onPress={() => {
                              handleSelection(attr.type, value);
                              setErrors(prev => ({...prev, [attr.type]: ''}));
                            }}>
                            <Text
                              style={[
                                styles.optionText,
                                selectedAttributes[attr.type] === value &&
                                  styles.selectedText,
                              ]}>
                              {value?.toUpperCase()}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>

                  {errors[attr.type] && (
                    <Text style={styles.errorText}>{errors[attr.type]}</Text>
                  )}
                </>
              ))}

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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 5,
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'center',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
    width: '100%',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    padding: 8,
    paddingHorizontal: 15,
    height: '100%',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ProductVariantModal;
