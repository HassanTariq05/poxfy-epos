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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../../redux/feature/store';
import axios from 'axios';
import {Discount} from '../../screens/pos/process-sales';

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (discount: Discount) => void;
  discountTypes: any[];
}

const DiscountModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  onConfirm,
  discountTypes,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      discountType: '',
      discountValue: '',
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

  const {headerUrl, setIsLoadingTrue, setIsLoadingFalse} = useAuthStore();
  const [discountId, setDiscountId] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.notesModalOverlay}>
        <View style={styles.notesModalContent}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={{padding: 8, width: 300}}>
            <Text style={styles.modalTitle}>Discount</Text>

            {/* Discount Type */}
            <Text style={styles.label}>Discount Type</Text>
            <Controller
              control={control}
              name="discountType"
              rules={{required: 'Discount type is required'}}
              render={({field: {value, onChange}}) => (
                <Dropdown
                  style={[
                    styles.input,
                    errors.discountType && styles.inputError,
                  ]}
                  data={discountTypes}
                  labelField="label"
                  valueField="type"
                  placeholder="Select Discount Type"
                  value={discountType}
                  onChange={item => {
                    setDiscountId(item.id);
                    setDiscountType(item.type);
                  }}
                  mode="auto"
                />
              )}
            />
            {errors.discountType && (
              <Text style={styles.errorText}>
                {errors.discountType.message}
              </Text>
            )}

            {/* Discount Value */}
            <Text style={styles.label}>Discount Value</Text>
            <Controller
              control={control}
              name="discountValue"
              rules={{
                required: 'Discount value is required',
                pattern: {
                  value: /^[0-9]+(\.[0-9]{1,2})?$/,
                  message: 'Enter a valid numeric value',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  ref={nameInputRef}
                  style={[
                    styles.input,
                    errors.discountValue && styles.inputError,
                  ]}
                  placeholder="Enter Discount Value"
                  keyboardType="numeric"
                  onChangeText={text => {
                    setDiscountValue(text);
                  }}
                  value={discountValue}
                />
              )}
            />
            {errors.discountValue && (
              <Text style={styles.errorText}>
                {errors.discountValue.message}
              </Text>
            )}

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={() => {
                var param = {
                  id: discountId,
                  value: Number(discountValue),
                  type: discountType,
                };
                onConfirm(param);
              }}
              style={styles.confirmButton}>
              <Text style={{color: 'white'}}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  notesModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesModalContent: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    zIndex: 10,
  },
  modalTitle: {
    color: 'black',
    marginBottom: 10,
    paddingRight: 25,
    fontWeight: 'bold',
    fontSize: 18,
  },
  label: {
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 5,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  confirmButton: {
    backgroundColor: '#ED6964',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default DiscountModal;
