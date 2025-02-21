import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  Switch,
  Button,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Platform} from 'react-native';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Controller, useForm} from 'react-hook-form';
import {createCustomer} from '../../services/customer';
import PopupDatePicker from '../date-picker';

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  gender: any;
  tier: any;
  tag: any;
  setRefetch: any;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  visible,
  onClose,
  gender,
  tag,
  tier,
  setRefetch,
}) => {
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      notes: '',
      companyName: '',
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      gender: '',
      tag: '',
      tier: '',
      additional: '',
      signupLoyalty: false,
      receiveMarketing: false,
      taxExempted: false,
    },
  });
  const slideAnim = useRef(new Animated.Value(500)).current;

  const [tags, setTags] = useState([]);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    // const genderData = gender.data.map((gender: any) => ({
    //   label: gender.name,
    //   value: gender._id,
    // }));

    console.log('tag: ', tag);
    const tagData = tag.map((tag: any) => ({
      label: tag.name,
      value: tag._id,
    }));

    setTags(tagData);
    const tierData = tier.map((tier: any) => ({
      label: tier.name,
      value: tier._id,
    }));

    setTiers(tierData);
  }, [tier, tag]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isLoyalityRewardEnabled, setIsLoyalityRewardEnabled] = useState(false);
  const toggleLoyalityRewardSwitch = () =>
    setIsLoyalityRewardEnabled(previousState => !previousState);

  const [isCommunicationEnabled, setIsCommunicationEnabled] = useState(false);
  const toggleCommunicationSwitch = () =>
    setIsCommunicationEnabled(previousState => !previousState);

  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const toggleTaxSwitch = () =>
    setIsTaxEnabled(previousState => !previousState);

  const onSubmit = async (data: any) => {
    console.log('Submitted Data: ', data);

    const payload = {
      accountLimit: data.additional,
      address: data.streetAddress,
      city: data.city,
      companyName: data.companyName,
      companyTaxId: 'str',
      country: data.country,
      customerGroupTag: data.tag,
      customerGroupTierId: data.tier,
      dateOfBirth: selectedDate,
      email: data.email,
      firstName: data.firstName,
      genderId: '67af88cbbdf76fc83c97ebf9',
      isActive: true,
      lastName: data.lastName,
      logo: 'http',
      notes: data.notes,
      phone: data.phone,
      signUpForLoyality: data.signupLoyalty,
      optOutForMarketing: data.receiveMarketing,
      state: data.state,
      taxExempted: data.taxExempted,
    };

    const response = await createCustomer(payload);
    console.log('Response Create Customer: ', response);
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
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={30}
                  color="#ED6964"
                />
              </TouchableOpacity>
              <Text style={styles.title}>Add Customer</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Left Container - 50% */}

              <View style={styles.leftContainer}>
                <Text style={styles.label}>Primary Details</Text>
                <View style={styles.subLeftContainer}>
                  <Controller
                    control={control}
                    name="firstName"
                    rules={{required: 'First name is required'}}
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={styles.input1}
                        placeholder="First Name"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="lastName"
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={styles.input1}
                        placeholder="Last Name"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </View>

                <View style={styles.subLeftContainer}>
                  <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={styles.input1}
                        placeholder="Email"
                        keyboardType="email-address"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="phone"
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={styles.input1}
                        placeholder="Phone"
                        keyboardType="phone-pad"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </View>

                <Controller
                  control={control}
                  name="notes"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[styles.input, styles.textarea]}
                      placeholder="Notes"
                      multiline
                      numberOfLines={4}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <Text style={styles.label}>Company Details</Text>
                <Controller
                  control={control}
                  name="companyName"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Company Name"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />

                <Text style={styles.label}>Physical Address</Text>
                <Controller
                  control={control}
                  name="streetAddress"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Street Address"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />

                <View style={styles.subLeftContainer}>
                  <Controller
                    control={control}
                    name="city"
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={[styles.input1, {textAlign: 'center'}]}
                        placeholder="City"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="state"
                    render={({field: {onChange, value}}) => (
                      <TextInput
                        style={[styles.input1, {textAlign: 'center'}]}
                        placeholder="State"
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </View>

                <Controller
                  control={control}
                  name="country"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[styles.input, {textAlign: 'center'}]}
                      placeholder="Country"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>

              {/* Right Container - 50% */}
              <View style={styles.rightContainer}>
                <Text style={styles.label}>Additional Information</Text>
                <Controller
                  control={control}
                  name="additional"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[styles.input, {textAlign: 'center'}]}
                      placeholder="0"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="gender"
                  render={({field: {onChange, value}}) => (
                    <Dropdown
                      style={styles.input}
                      data={[
                        {label: 'Male', value: 'male'},
                        {label: 'Female', value: 'female'},
                        {label: 'Other', value: 'other'},
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Gender"
                      value={value}
                      onChange={item => onChange(item.value)}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="tag"
                  render={({field: {onChange, value}}) => (
                    <Dropdown
                      style={styles.input}
                      data={tags}
                      labelField="label"
                      valueField="value"
                      placeholder="Tag"
                      value={value}
                      onChange={item => onChange(item.value)}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="tier"
                  render={({field: {onChange, value}}) => (
                    <Dropdown
                      style={styles.input}
                      data={tiers}
                      labelField="label"
                      valueField="value"
                      placeholder="Group Tier"
                      value={value}
                      onChange={item => onChange(item.value)}
                    />
                  )}
                />

                <PopupDatePicker onDateSelect={setSelectedDate} />

                <View style={styles.switchContainer}>
                  <Text style={styles.subHeading}>
                    Signup for loyalty rewards program
                  </Text>
                  <Controller
                    control={control}
                    name="signupLoyalty"
                    render={({field: {onChange, value}}) => (
                      <Switch
                        trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                        thumbColor={value ? '#ffffff' : '#ffffff'}
                        ios_backgroundColor="#e0e0e0"
                        onValueChange={onChange}
                        value={value}
                        style={styles.switch}
                      />
                    )}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.subHeading}>
                    Customer has opted in to receive marketing & promo
                    communications
                  </Text>
                  <Controller
                    control={control}
                    name="receiveMarketing"
                    render={({field: {onChange, value}}) => (
                      <Switch
                        trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                        thumbColor={value ? '#ffffff' : '#ffffff'}
                        ios_backgroundColor="#e0e0e0"
                        onValueChange={onChange}
                        value={value}
                        style={styles.switch}
                      />
                    )}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.subHeading}>
                    This customer is tax-exempt. No tax applied when this
                    customer is allocated to a sale.
                  </Text>
                  <Controller
                    control={control}
                    name="taxExempted"
                    render={({field: {onChange, value}}) => (
                      <Switch
                        trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                        thumbColor={value ? '#ffffff' : '#ffffff'}
                        ios_backgroundColor="#e0e0e0"
                        onValueChange={onChange}
                        value={value}
                        style={styles.switch}
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </ScrollView>
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
  backButton: {
    marginRight: 10,
  },
  modal: {
    position: 'absolute',
    top: '10%',
    right: 0,
    width: '60%',
    height: '80%',
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    shadowRadius: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },
  title: {
    paddingTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  leftContainer: {
    flex: 1,
    paddingRight: 10,
  },

  subLeftContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 7,
  },
  rightContainer: {
    flex: 0.7,
    paddingLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 10,
    color: 'rgb(103, 223, 135)',
    borderBottomColor: 'rgb(240,240,240)',
    borderBottomWidth: 1,
  },

  switchContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  subHeading: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  switch: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },
  input: {
    height: 40,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 15,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
  },
  input1: {
    height: 40,
    width: '50%',
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 15,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
  },
  inputDate: {
    height: 40,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 15,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
  },
  textarea: {
    height: 50,
    textAlignVertical: 'top',
    backgroundColor: 'none',
    borderWidth: 1,
    borderColor: 'rgb(202,202,202)',
  },
  button: {
    backgroundColor: '#ED6964',
    height: 40,
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
});

export default AddCustomerModal;
