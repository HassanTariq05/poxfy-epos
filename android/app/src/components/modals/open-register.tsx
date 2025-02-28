import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm, Controller} from 'react-hook-form';
import useAuthStore from '../../redux/feature/store';

interface FormData {
  openingBalance: string;
  notes: string;
}

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenPress: (data: FormData) => void;
}

const SlideInModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  onOpenPress,
}) => {
  const slideAnim = useRef(new Animated.Value(500)).current;
  const nameInputRef = useRef<TextInput>(null);
  const {isLoading} = useAuthStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      openingBalance: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
      reset();
    }
  }, [visible]);

  const onSubmit = (data: FormData) => {
    onOpenPress(data);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[styles.modal, {transform: [{translateX: slideAnim}]}]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color="black"
              />
            </TouchableOpacity>
            <Text style={styles.title}>Open Register</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>
              <Text style={styles.required}>*</Text> Opening Balance
            </Text>
            <Controller
              control={control}
              name="openingBalance"
              rules={{
                required: 'Opening balance is required',
                pattern: {
                  value: /^\d+$/,
                  message: 'Opening balance must be a number',
                },
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  ref={nameInputRef}
                  style={[
                    styles.input,
                    errors.openingBalance && styles.inputError,
                  ]}
                  placeholder="Enter opening balance"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.openingBalance && (
              <Text style={styles.errorText}>
                {errors.openingBalance.message}
              </Text>
            )}

            <Text style={styles.label}>
              <Text style={styles.required}>*</Text> Notes
            </Text>
            <Controller
              control={control}
              name="notes"
              rules={{required: 'Notes are required'}}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.textarea,
                    errors.notes && styles.inputError,
                  ]}
                  placeholder="Enter notes"
                  multiline
                  numberOfLines={4}
                  value={value}
                  onChangeText={onChange}
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
              <Text style={styles.buttonText}>Open</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  required: {
    color: 'red',
  },
  input: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 5,
    borderColor: 'rgb(240,240,240)',
    borderWidth: 1,
  },
  inputError: {
    borderColor: 'red',
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ED6964',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ED6964',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SlideInModal;
