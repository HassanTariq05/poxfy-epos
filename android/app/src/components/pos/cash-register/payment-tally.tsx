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
  registerData: {
    transaction: {
      cash: number;
      card: number;
      credit: number;
    };
  };
  cashDifference: number;
  cardDifference: number;
  creditDifference: number;
}

const PaymentTally: React.FC<PaymentProps> = ({
  registerData,
  cashDifference,
  cardDifference,
  creditDifference,
}) => {
  const {transaction} = registerData || {};
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [countedCash, setCountedCash] = useState('');
  const [countedCard, setCountedCard] = useState('');
  const [countedCredit, setCountedCredit] = useState('');
  const [notes, setNotes] = useState('');

  const safeNumber = (value: any) =>
    isNaN(Number(value)) ? 0 : Number(value).toFixed(2);

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
          <Text style={styles.rowText}>{safeNumber(transaction?.cash)}</Text>
          <TextInput
            style={styles.input}
            value={countedCash}
            onChangeText={setCountedCash}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text style={styles.rowText}>
            {Number(cashDifference).toFixed(2)}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>Card</Text>
          <Text style={styles.rowText}>{transaction?.card || 0}</Text>
          <TextInput
            style={styles.input}
            value={countedCard}
            onChangeText={setCountedCard}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text style={styles.rowText}>
            {Number(cardDifference).toFixed(2) || 0}
          </Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.rowText}>Store Credit</Text>
          <Text style={styles.rowText}>{transaction?.credit || 0}</Text>
          <TextInput
            style={styles.input}
            value={countedCredit}
            onChangeText={setCountedCredit}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text style={styles.rowText}>{creditDifference || 0}</Text>
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
