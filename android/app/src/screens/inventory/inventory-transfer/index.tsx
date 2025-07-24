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
import {dummyTransferData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function InventoryTransfer() {
  const headers = [
    'Transfer ID',
    'Transfer Date',
    'To Outlet',
    'From Outlet',
    'Total',
    'Created By',
    'Modified By',
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const [inventory, setinventory] = useState<string>('');
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);

  const handleAction = (row: {[key: string]: string | number}) => {
    setSelectedRow(row);
    setModalVisible(true);
  };

  return (
    <>
      <View>
        <TableCard
          heading="Inventory Transfer"
          headerChildren={
            <View style={styles.headerChildrenView}>
              <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                <Text style={styles.buttonText}>Add Transfer</Text>
              </TouchableOpacity>
            </View>
          }>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={inventory}
              placeholder="Find Inventory"
              onChangeText={setinventory}
              keyboardType="email-address"
            />
          </View>
          <CustomDataTable
            headers={headers}
            data={dummyTransferData}
            flexes={[]}
            alignments={[]}
            showEdit={true}
            showDelete={true}
            onDelete={() => {}}
            onEdit={() => {}}
            skip={skip}
            setSkip={setSkip}
            limit={limit}
            setLimit={setLimit}
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

export default InventoryTransfer;
