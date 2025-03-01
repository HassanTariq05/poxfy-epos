import React, {useEffect, useRef, useState} from 'react';
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
import {cashInnOutApi} from '../../services/register';
import useAuthStore from '../../redux/feature/store';
import {Controller, useForm} from 'react-hook-form';

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  registerData: any;
}

const CashInModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  registerData,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      amount: '',
      notes: '',
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
  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl, isLoading} =
    useAuthStore();

  const handleOpen = async () => {};

  const onSubmit = async (data: any) => {
    let response;
    try {
      const payload = {
        amount: Number(data.amount),
        isActive: true,
        notes: data.notes,
      };
      console.log('Payload:', payload);
      if (data.amount || data.notes) {
        setIsLoadingTrue();
        response = await cashInnOutApi(
          registerData.cashRegister._id,
          registerData._id,
          'IN',
          payload,
          headerUrl,
        );
        console.log('Cash IN Response:', response.data.data);
      }
      if (response?.data.meta.success) {
        onClose();
        setIsLoadingFalse();
        reset();
        ToastAndroid.showWithGravityAndOffset(
          'Record added successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } catch (err) {
      console.log(err);
      setIsLoadingFalse();
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle="overFullScreen">
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
                  color="black"
                />
              </TouchableOpacity>
              <Text style={styles.title}>Cash In</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>
                <Text style={styles.required}></Text> Amount
              </Text>
              <Controller
                control={control}
                name="amount"
                rules={{
                  required: 'Amount is required',
                  pattern: {
                    value: /^[0-9]+(\.[0-9]*)?$/, // Allows only numbers with optional decimal
                    message: 'Amount must be a valid number',
                  },
                }}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    ref={nameInputRef}
                    style={styles.input}
                    placeholder="0.00"
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount.message}</Text>
              )}
              <View style={styles.iconContainer}>
                <Icon
                  name={'calendar-text-outline'}
                  size={22}
                  color={'rgb(103, 223, 135)'}
                />
                <Text style={styles.notesText}>Notes</Text>
              </View>

              <Controller
                control={control}
                name="notes"
                rules={{required: 'Notes are required'}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.notes && (
                <Text style={styles.errorText}>{errors.notes.message}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={[styles.button, isLoading && {opacity: 0.7}]}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
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
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
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
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'rgb(103, 223, 135)',
  },
  required: {
    color: 'red',
  },
  input: {
    height: 45,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 10,
    borderColor: 'rgb(240,240,240)',
    borderWidth: 1,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: 'none',
    borderWidth: 1,
    borderColor: 'rgb(240,240,240)',
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default CashInModal;
