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
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Controller, useForm} from 'react-hook-form';
import {createCustomer, updateCustomer} from '../../services/customer';
import PopupDatePicker from '../date-picker';
import useAuthStore from '../../redux/feature/store';
import {getSlugListOfValuesByKey} from '../../services/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface EditCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  setRefetch: any;
  customer: any;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  visible,
  onClose,
  setRefetch,
  customer,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
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
      additional: '0',
      signupLoyalty: false,
      receiveMarketing: false,
      taxExempted: false,
      dateOfBirth: '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        notes: customer?.notes || '',
        companyName: customer?.companyName || '',
        streetAddress: customer?.address || '',
        city: customer?.city || '',
        state: customer?.state || '',
        country: customer?.country || '',
        gender: customer?.genderId || '',
        tag: customer?.customerGroupTag || '',
        tier: customer?.customerGroupTierId || '',
        additional: customer?.accountLimit?.toString() || '0',
        signupLoyalty: customer?.signUpForLoyality || false,
        receiveMarketing: customer?.optOutForMarketing || false,
        taxExempted: customer?.taxExempted || false,
        dateOfBirth: customer?.dateOfBirth,
      });
    }
  }, [customer, reset]);

  const slideAnim = useRef(new Animated.Value(500)).current;
  const nameInputRef = useRef<TextInput>(null);

  const [tags, setTags] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [genders, setGenders] = useState([]);

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
    }
  }, [visible]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    customer?.dateOfBirth,
  );

  useEffect(() => {
    const fetchListOfValues = async () => {
      try {
        setIsLoadingTrue();
        const {data: response} = await getSlugListOfValuesByKey(
          'customer-tier',
          headerUrl,
        );

        const tierData = response.data.data.map((tier: any) => ({
          label: tier?.name,
          value: tier?._id,
        }));

        setTiers(tierData);

        const {data: tagData} = await getSlugListOfValuesByKey(
          'customer-tag',
          headerUrl,
        );

        const tagDataFormatted = tagData.data.data.map((tag: any) => ({
          label: tag?.name,
          value: tag?._id,
        }));

        setTags(tagDataFormatted);

        const token = await AsyncStorage.getItem('userToken');
        const API_URL = await AsyncStorage.getItem('API_BASE_URL');
        const url = `${API_URL}list-of-values?type=gender`;
        const payload = {type: 'gender'};

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            origin: headerUrl,
            referer: headerUrl,
            'access-key': 12345,
          },
          params: payload,
        };

        const {data: genderData} = await axios.get(url, config);

        const genderDataFormatted = genderData.data.data.map((gender: any) => ({
          label: gender?.value,
          value: gender?._id,
        }));

        setGenders(genderDataFormatted);

        console.log('Tag: ', tagData.data.data);
        console.log('Tier: ', response.data.data);
        console.log('Gender in edit: ', genderData.data.data);
        setIsLoadingFalse();
      } catch {
        setIsLoadingFalse();
        return null;
      }
    };

    fetchListOfValues();
  }, [visible]);

  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl, isLoading} =
    useAuthStore();

  const onSubmit = async (data: any) => {
    setIsLoadingTrue();
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
      genderId: data.gender,
      isActive: true,
      lastName: data.lastName,
      logo: 'http',
      notes: data.notes,
      optOutForMarketing: data.receiveMarketing,
      phone: data.phone,
      signUpForLoyality: data.signupLoyalty,
      state: data.state,
      taxExempted: data.taxExempted,
    };

    console.log('Update Customer payload: ', payload);

    const response = await updateCustomer(payload, customer?._id, headerUrl);
    console.log('Response Update Customer: ', response);
    setRefetch((prev: any) => !prev);
    onClose();
    setIsLoadingFalse();
    ToastAndroid.showWithGravityAndOffset(
      'Record updated successfully',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    reset();
  };

  const handleClose = () => {
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
              <Text style={styles.title}>Edit Customer</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Left Container - 50% */}

              <View style={styles.leftContainer}>
                <Text style={styles.label}>Primary Details</Text>
                <View style={styles.subLeftContainer}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.floatingLabel}>First Name *</Text>
                    <Controller
                      control={control}
                      name="firstName"
                      rules={{required: 'First name is required'}}
                      render={({field: {onChange, value}}) => (
                        <>
                          <TextInput
                            ref={nameInputRef}
                            style={styles.input1}
                            placeholder="Enter First Name"
                            onChangeText={onChange}
                            value={value}
                          />
                          {errors.firstName && (
                            <Text style={styles.errorText}>
                              {errors.firstName.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View style={{width: '50%'}}>
                    <Text style={styles.floatingLabel}>Last Name *</Text>
                    <Controller
                      control={control}
                      name="lastName"
                      rules={{required: 'Last name is required'}}
                      render={({field: {onChange, value}}) => (
                        <>
                          <TextInput
                            style={styles.input1}
                            placeholder="Enter Last Name"
                            onChangeText={onChange}
                            value={value}
                          />
                          {errors.lastName && (
                            <Text style={styles.errorText}>
                              {errors.lastName.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>
                </View>

                <View style={styles.subLeftContainer}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.floatingLabel}>Email *</Text>
                    <Controller
                      control={control}
                      name="email"
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      }}
                      render={({field: {onChange, value}}) => (
                        <>
                          <TextInput
                            style={styles.input1}
                            placeholder="Enter Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            value={value}
                          />
                          {errors.email && (
                            <Text style={styles.errorText}>
                              {errors.email.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View style={{width: '50%'}}>
                    <Text style={styles.floatingLabel}>Phone *</Text>
                    <Controller
                      control={control}
                      name="phone"
                      rules={{required: 'Phone is required'}}
                      render={({field: {onChange, value}}) => (
                        <>
                          <TextInput
                            style={styles.input1}
                            placeholder="Enter Phone Number"
                            onChangeText={onChange}
                            value={value}
                          />
                          {errors.phone && (
                            <Text style={styles.errorText}>
                              {errors.phone.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>
                </View>

                <Text style={styles.floatingLabel}>Notes *</Text>
                <Controller
                  control={control}
                  name="notes"
                  rules={{required: 'Notes is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <TextInput
                        style={[styles.input, styles.textarea]}
                        placeholder="Enter Notes"
                        multiline
                        numberOfLines={4}
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.notes && (
                        <Text style={styles.errorText}>
                          {errors.notes.message}
                        </Text>
                      )}
                    </>
                  )}
                />
                <Text style={styles.label}>Company Details</Text>
                <Text style={styles.floatingLabel}>Company Name *</Text>
                <Controller
                  control={control}
                  name="companyName"
                  rules={{required: 'Company Name is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Company Name"
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.companyName && (
                        <Text style={styles.errorText}>
                          {errors.companyName.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text style={styles.label}>Physical Address</Text>

                <Text style={styles.floatingLabel}>Street Address *</Text>
                <Controller
                  control={control}
                  name="streetAddress"
                  rules={{required: 'Street Address is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Street Address"
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.streetAddress && (
                        <Text style={styles.errorText}>
                          {errors.streetAddress.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <View style={styles.subLeftContainer}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.floatingLabel}>City *</Text>
                    <Controller
                      control={control}
                      name="city"
                      rules={{required: 'City is required'}}
                      render={({field: {onChange, value}}) => (
                        <>
                          <TextInput
                            style={styles.input1}
                            placeholder="Enter City"
                            onChangeText={onChange}
                            value={value}
                          />
                          {errors.city && (
                            <Text style={styles.errorText}>
                              {errors.city.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View style={{width: '50%'}}>
                    <Text style={styles.floatingLabel}>State *</Text>
                    <Controller
                      control={control}
                      name="state"
                      rules={{required: 'State is required'}}
                      render={({field: {onChange, value}}) => (
                        <>
                          <TextInput
                            style={styles.input1}
                            placeholder="Enter State"
                            onChangeText={onChange}
                            value={value}
                          />
                          {errors.state && (
                            <Text style={styles.errorText}>
                              {errors.state.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>
                </View>

                <Text style={styles.floatingLabel}>Country *</Text>
                <Controller
                  control={control}
                  name="country"
                  rules={{required: 'Country is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter Country"
                        onChangeText={onChange}
                        value={value}
                      />
                      {errors.country && (
                        <Text style={styles.errorText}>
                          {errors.country.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Right Container - 50% */}
              <View style={styles.rightContainer}>
                <Text style={styles.label}>Additional Information</Text>

                <Text style={styles.floatingLabel}>Amount *</Text>
                <Controller
                  control={control}
                  name="additional"
                  rules={{
                    required: 'This is required',
                    pattern: {
                      value: /^\d+$/,
                      message: 'Only numbers are allowed',
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <>
                      <TextInput
                        style={[styles.input, {textAlign: 'center'}]}
                        placeholder="0"
                        keyboardType="numeric"
                        onChangeText={text => {
                          // Ensure only numbers are entered
                          if (/^\d*$/.test(text)) {
                            onChange(text);
                          }
                        }}
                        value={value}
                      />
                      {errors.additional && (
                        <Text style={styles.errorText}>
                          {errors.additional.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text style={styles.floatingLabel}>Gender *</Text>
                <Controller
                  control={control}
                  name="gender"
                  rules={{required: 'Gender is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <Dropdown
                        style={styles.input}
                        data={genders}
                        labelField="label"
                        valueField="value"
                        placeholder="Gender"
                        value={value}
                        onChange={item => onChange(item.value)}
                      />
                      {errors.gender && (
                        <Text style={styles.errorText}>
                          {errors.gender.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text style={styles.floatingLabel}>Tag *</Text>
                <Controller
                  control={control}
                  name="tag"
                  rules={{required: 'Tag is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <Dropdown
                        style={styles.input}
                        data={tags}
                        labelField="label"
                        valueField="value"
                        placeholder="Tag"
                        value={value}
                        onChange={item => onChange(item.value)}
                      />
                      {errors.tag && (
                        <Text style={styles.errorText}>
                          {errors.tag.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <Text style={styles.floatingLabel}>Tier *</Text>
                <Controller
                  control={control}
                  name="tier"
                  rules={{required: 'Group Tier is required'}}
                  render={({field: {onChange, value}}) => (
                    <>
                      <Dropdown
                        style={styles.input}
                        data={tiers}
                        labelField="label"
                        valueField="value"
                        placeholder="Group Tier"
                        value={value}
                        onChange={item => onChange(item.value)}
                      />
                      {errors.tier && (
                        <Text style={styles.errorText}>
                          {errors.tier.message}
                        </Text>
                      )}
                    </>
                  )}
                />

                <View>
                  <Text style={styles.floatingLabel}>Date of Birth *</Text>
                  <PopupDatePicker onDateSelect={setSelectedDate} />
                </View>

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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
    alignSelf: 'flex-start',
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
    top: '5%',
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
  floatingLabel: {
    fontSize: 14,
    fontWeight: '500',
    paddingBottom: 10,
    color: 'black',
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
    width: '100%',
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 10,
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

export default EditCustomerModal;
