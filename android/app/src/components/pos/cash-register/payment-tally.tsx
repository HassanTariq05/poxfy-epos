import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface PaymentProps {
  registerData: any;
  countedCash: string;
  setCountedCash: React.Dispatch<React.SetStateAction<string>>;
  countedCard: string;
  setCountedCard: React.Dispatch<React.SetStateAction<string>>;
  countedCredit: string;
  setCountedCredit: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentTally: React.FC<PaymentProps> = ({
  registerData,
  countedCash,
  setCountedCash,
  countedCard,
  setCountedCard,
  countedCredit,
  setCountedCredit,
}) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Payment</Text>
          <Text style={styles.headerText}>Expected</Text>
          <Text style={styles.headerText}>Counted</Text>
          <Text style={styles.headerText}>Difference</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>Cash</Text>
          <Text style={styles.rowText}>{registerData?.transaction?.cash}</Text>
          <TextInput
            style={styles.input}
            value={countedCash}
            onChangeText={text => {
              const numericText = text.replace(/[^0-9.]/g, '');
              if (/^\d*\.?\d*$/.test(numericText)) {
                setCountedCash(numericText);
              }
            }}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text style={styles.rowText}>
            {Number(countedCash) - Number(registerData?.transaction?.cash)}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>Card</Text>
          <Text style={styles.rowText}>{registerData?.transaction?.card}</Text>
          <TextInput
            style={styles.input}
            value={countedCard}
            onChangeText={text => {
              const numericText = text.replace(/[^0-9.]/g, '');
              if (/^\d*\.?\d*$/.test(numericText)) {
                setCountedCard(numericText);
              }
            }}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text style={styles.rowText}>
            {Number(countedCard) - Number(registerData?.transaction?.card)}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>Store Credit</Text>
          <Text style={styles.rowText}>
            {registerData?.transaction?.credit}
          </Text>
          <TextInput
            style={styles.input}
            value={countedCredit}
            onChangeText={text => {
              const numericText = text.replace(/[^0-9.]/g, '');
              if (/^\d*\.?\d*$/.test(numericText)) {
                setCountedCredit(numericText);
              }
            }}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text style={styles.rowText}>
            {Number(countedCredit) - Number(registerData?.transaction?.credit)}
          </Text>
        </View>
      </View>

      <View style={styles.notesSection}>
        <View style={styles.iconContainer}>
          <Icon
            name={'calendar-text-outline'}
            size={22}
            color={'rgb(103, 223, 135)'}
          />
          <Text style={styles.notesText}>Notes</Text>
        </View>

        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
        />
      </View>

      {/* Cash Count Popup Modal */}
      <Modal visible={isPopupVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setPopupVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Cash Count</Text>
            <View style={styles.modalContent}>
              <Text>Total = </Text>
              <TextInput
                style={styles.input}
                defaultValue="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setPopupVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  table: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(232, 231, 233)',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(232, 231, 233)',
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(232, 231, 233)',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: '25%',
  },
  rowText: {
    fontSize: 14,
    textAlign: 'center',
    width: '25%',
  },
  input: {
    width: '25%',
    borderWidth: 1,
    borderColor: 'rgb(221, 221, 221)',
    padding: 8,
    borderRadius: 25,
    textAlign: 'center',
  },
  notesSection: {
    marginTop: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 18,
    marginRight: 8,
  },
  notesText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgb(103, 223, 135)',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: 'rgb(221, 221, 221)',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  closeButton: {
    textAlign: 'right',
    color: '#FF0000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
    width: '40%',
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
  },
});

export default PaymentTally;
