import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyCustomerTierData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddTierModal from '../../../components/modals/add-tier';
import EditTierModal from '../../../components/modals/edit-tier';

function Tier() {
  const headers = ['Name'];

  const [customer, setcustomer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [modalEditVisible, setEditModalVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const handleEdit = (row: {[key: string]: string | number}) => {
    console.log(row);
    setSelectedTier(row);
    setEditModalVisible(true);
  };

  const handleAction = (row: {[key: string]: string | number}) => {
    // setSelectedRow(row);
    // setModalVisible(true);
  };

  const handleHeadingAction = () => {
    setModalVisible(true);
  };

  return (
    <>
      <View>
        <TableCard
          heading="Tier"
          button={'Add Tier'}
          onAction={handleHeadingAction}>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={customer}
              placeholder="Find..."
              onChangeText={setcustomer}
              keyboardType="default"
            />
          </View>
          <CustomDataTable
            headers={headers}
            data={dummyCustomerTierData}
            showEdit={true}
            onEdit={handleEdit}
            showDelete={true}
            onDelete={() => {}}
            showSwitch={true}
            onToggleSwitch={() => {}}
          />
        </TableCard>
        <AddTierModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        <EditTierModal
          visible={modalEditVisible}
          onClose={() => setEditModalVisible(false)}
          tier={selectedTier}
        />
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
});

export default Tier;
