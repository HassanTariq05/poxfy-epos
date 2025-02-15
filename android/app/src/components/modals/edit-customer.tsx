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
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface EditCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  customer: any;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  visible,
  onClose,
  customer,
}) => {
  const slideAnim = useRef(new Animated.Value(500)).current;

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

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [email, setEmail] = useState(customer?.Email || '');
  const [phone, setPhone] = useState(customer?.Phone || '');
  const [company, setCompany] = useState(customer?.Company || '');
  const [country, setCountry] = useState(customer?.Country || '');

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName || '');
      setLastName(customer.lastName || '');
      setEmail(customer.Email || '');
      setPhone(customer.Phone || '');
      setCompany(customer.Company || '');
      setCountry(customer.Country || '');
    }
  }, [customer]);

  const onChange = (event: any, selectedDate: any) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const [isLoyalityRewardEnabled, setIsLoyalityRewardEnabled] = useState(false);
  const toggleLoyalityRewardSwitch = () =>
    setIsLoyalityRewardEnabled(previousState => !previousState);

  const [isCommunicationEnabled, setIsCommunicationEnabled] = useState(false);
  const toggleCommunicationSwitch = () =>
    setIsCommunicationEnabled(previousState => !previousState);

  const [isTaxEnabled, setIsTaxEnabled] = useState(false);
  const toggleTaxSwitch = () =>
    setIsTaxEnabled(previousState => !previousState);
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
                  <TextInput
                    style={styles.input1}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                  />
                  <TextInput
                    style={styles.input1}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="First Name"
                  />
                </View>

                <View style={styles.subLeftContainer}>
                  <TextInput
                    style={styles.input1}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                  />
                  <TextInput
                    style={styles.input1}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone"
                  />
                </View>

                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Notes"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>Company Details</Text>
                <TextInput style={styles.input} placeholder="Company Name" />

                <Text style={styles.label}>Physical Address</Text>
                <TextInput style={styles.input} placeholder="Street Address" />

                <View style={styles.subLeftContainer}>
                  <TextInput
                    style={[styles.input1, {textAlign: 'center'}]}
                    placeholder="City"
                  />
                  <TextInput
                    style={[styles.input1, {textAlign: 'center'}]}
                    placeholder="State"
                  />
                </View>

                <TextInput
                  style={[styles.input, {textAlign: 'center'}]}
                  placeholder="Country"
                  value={country}
                  onChange={setCountry}
                />
              </View>

              {/* Right Container - 50% */}
              <View style={styles.rightContainer}>
                <Text style={styles.label}>Additional Information</Text>
                <TextInput
                  style={[styles.input, {textAlign: 'center'}]}
                  value="0"
                  placeholder="0"
                />

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
                  placeholderStyle={{color: 'gray'}}
                  containerStyle={{borderRadius: 10}}
                  selectedTextStyle={{fontSize: 14}}
                  onChange={function (item: any): void {}}
                />

                <Dropdown
                  style={styles.input}
                  data={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                    {label: 'Other', value: 'other'},
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Tag"
                  placeholderStyle={{color: 'gray'}}
                  containerStyle={{borderRadius: 10}}
                  selectedTextStyle={{fontSize: 14}}
                  onChange={function (item: any): void {}}
                />

                <Dropdown
                  style={styles.input}
                  data={[
                    {label: 'Male', value: 'male'},
                    {label: 'Female', value: 'female'},
                    {label: 'Other', value: 'other'},
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="Group Tier"
                  placeholderStyle={{color: 'gray'}}
                  containerStyle={{borderRadius: 10}}
                  selectedTextStyle={{fontSize: 14}}
                  onChange={function (item: any): void {}}
                />

                <TouchableOpacity
                  style={styles.inputDate}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={{color: 'black'}}>
                    {date.toDateString() || 'Select Date'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.switchContainer}>
                  <Text style={styles.subHeading}>
                    Signup for loyalty rewards program
                  </Text>
                  <Switch
                    trackColor={{false: '#e0e0e0', true: '#eb6b6b'}} // Light gray for off, red for on
                    thumbColor={isLoyalityRewardEnabled ? '#ffffff' : '#ffffff'} // White thumb
                    ios_backgroundColor="#e0e0e0"
                    onValueChange={toggleLoyalityRewardSwitch}
                    value={isLoyalityRewardEnabled}
                    style={styles.switch}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.subHeading}>
                    Customer has optedin to receive marketing & promo
                    communications
                  </Text>
                  <Switch
                    trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                    thumbColor={isCommunicationEnabled ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#e0e0e0"
                    onValueChange={toggleCommunicationSwitch}
                    value={isCommunicationEnabled}
                    style={styles.switch}
                  />
                </View>

                <View style={styles.switchContainer}>
                  <Text style={styles.subHeading}>
                    This customer is tax exempted. No tax applied when this
                    customer allocate to sale
                  </Text>
                  <Switch
                    trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                    thumbColor={isTaxEnabled ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#e0e0e0"
                    onValueChange={toggleTaxSwitch}
                    value={isTaxEnabled}
                    style={styles.switch}
                  />
                </View>
                {/* {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )} */}
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.button}>
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

export default EditCustomerModal;
