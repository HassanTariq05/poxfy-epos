import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

interface DualDatePickerProps {
  onDatesSelect: (startDate: string, endDate: string) => void;
  onDatesClear: () => void;
  dateRange: any;
  setDateRange: any;
}

const DualDatePicker: React.FC<DualDatePickerProps> = ({
  onDatesSelect,
  onDatesClear,
  dateRange,
  setDateRange,
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    var start = moment(startDate).format('yyyy-MM-DD');
    var end = moment(endDate).format('yyyy-MM-DD');
    setDateRange(start + ' ⇀ ' + end);
    onDatesSelect(start, end);
    setOpen(false);
  };

  const handleClear = () => {
    setDateRange('Select Dates');
    setStartDate(new Date());
    setEndDate(new Date());
    onDatesClear();
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.inputDate} onPress={() => setOpen(true)}>
        <Text style={styles.dateText}>{dateRange}</Text>
        <Feather name="calendar" size={20} color="rgb(128,128,128)" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setOpen(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Select Date Range</Text>
            <View style={styles.datePickersRow}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.label}>Start Date</Text>
                <DatePicker
                  date={startDate || new Date()}
                  mode="date"
                  onDateChange={value => setStartDate(value)}
                />
              </View>
              <View style={styles.datePickerContainer}>
                <Text style={styles.label}>End Date</Text>
                <DatePicker
                  date={endDate || new Date()}
                  mode="date"
                  onDateChange={value => setEndDate(value)}
                />
              </View>
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={handleClear} style={styles.button1}>
                <Text style={styles.buttonText1}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                <Text style={styles.buttonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputDate: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateText: {
    color: 'black',
    flex: 1,
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
    width: 500,
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
  datePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  datePickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#ED6964',
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '48%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button1: {
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '48%',
  },
  buttonText1: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
  },
});

export default DualDatePicker;
