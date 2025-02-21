import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';

interface PopupDatePickerProps {
  initialVal?: any;
  onDateSelect: any;
}

const PopupDatePicker: React.FC<PopupDatePickerProps> = ({
  initialVal,
  onDateSelect,
}) => {
  const [date, setDate] = useState(
    initialVal ? new Date(initialVal) : new Date(),
  );
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    const formattedDate = date.toISOString().split('T')[0];
    onDateSelect(formattedDate);
    setOpen(false);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* Button to open the date picker */}
      <TouchableOpacity style={styles.inputDate} onPress={() => setOpen(true)}>
        <Text style={{color: 'black'}}>
          {date.toDateString() || 'Select Date'}
        </Text>
      </TouchableOpacity>

      {/* Modal for the popup date picker */}
      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setOpen(false)} // Close when clicking outside
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Select Date</Text>

            {/* Date Picker Component */}
            <DatePicker date={date} mode="date" onDateChange={setDate} />

            {/* Confirm Button */}
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputDate: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 15,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ED6964',
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PopupDatePicker;
