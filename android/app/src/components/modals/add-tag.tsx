import React, {useEffect, useRef} from 'react';
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createSlug} from '../../services/product/brand';

interface SlideInModalProps {
  visible: boolean;
  onClose: () => void;
  setRefetch: any;
}

const AddTagModal: React.FC<SlideInModalProps> = ({
  visible,
  onClose,
  setRefetch,
}) => {
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      name: '',
    },
  });
  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500, // Slide out
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const onSubmit = async (data: any) => {
    console.log('Submitted Data: ', data);

    const payload = {
      name: data.name,
      accountLimit: null,
      isActive: true,
    };
    console.log('Create Tag Payload: ', payload);
    const response = await createSlug('customer-tag', payload);
    console.log('Response Create Tag: ', response);
    setRefetch((prev: any) => !prev);
    onClose();
    reset();
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
                color="#ED6964"
              />
            </TouchableOpacity>
            <Text style={styles.title}>Add Tag</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>
              <Text style={styles.required}>*</Text> Name
            </Text>
            <Controller
              control={control}
              name="name"
              rules={{required: 'Name is required'}}
              render={({field: {onChange, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter Brand Name"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
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
    top: '30%',
    right: 0,
    width: '40%',
    height: '40%',
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
    fontWeight: '400',
    marginBottom: 5,
    color: 'gray',
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
    marginBottom: 15,
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

export default AddTagModal;
