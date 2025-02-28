import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyPurchaseData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Purchase() {
  const headers = [
    'Purchase ID',
    'Purchase Date',
    'Supplier',
    'Payment Status',
    'Payment Type',
    'Discount',
    'Subtotal',
    'Remaining Balance',
    'Created By',
    'Modified By',
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const [purchase, setPurchase] = useState<string>('');

  const handleAction = (row: {[key: string]: string | number}) => {
    setSelectedRow(row);
    setModalVisible(true);
  };

  return (
    <>
      <View>
        <TableCard
          heading="Purchase"
          headerChildren={
            <View style={styles.headerChildrenView}>
              <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                <Text style={styles.buttonText}>Add Purchase</Text>
              </TouchableOpacity>
            </View>
          }>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={purchase}
              placeholder="Find Purchase by name, barcode"
              onChangeText={setPurchase}
              keyboardType="email-address"
            />
          </View>
          <CustomDataTable
            headers={headers}
            data={dummyPurchaseData}
            showEdit={true}
            showDelete={true}
            onDelete={() => {}}
            onEdit={() => {}}
          />
        </TableCard>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderRadius: 20,
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
  },
  searchText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#000',
  },
  searchTextFocused: {
    borderWidth: 1,
    borderColor: 'rgb(230, 231, 235)',
    paddingHorizontal: 10,
  },
  modalContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    width: '100%',
    marginVertical: 5,
    borderRadius: 5,
  },
  headerChildrenView: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    width: '50%',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'rgb(237,105, 100)',
    paddingVertical: 4,
    justifyContent: 'center',
    borderRadius: 20,
    height: 30,
    width: '30%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
});

export default Purchase;
