import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyCustomerData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddCustomerModal from '../../../components/modals/add-customer';
import EditCustomerModal from '../../../components/modals/edit-customer';

function Customer() {
  const headers = ['Code', 'Name', 'Phone', 'Email', 'Country'];

  const [customer, setCustomer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const handleHeadingAction = () => {
    setModalVisible(true);
  };

  const handleEdit = (row: {[key: string]: string | number}) => {
    console.log(row);
    setSelectedCustomer(row);
    setEditModalVisible(true);
  };

  return (
    <>
      <View>
        <TableCard
          heading="Customer"
          button={'Add Customer'}
          onAction={handleHeadingAction}>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={customer}
              placeholder="Find Customer"
              onChangeText={setCustomer}
              keyboardType="default"
            />
          </View>
          <CustomDataTable
            headers={headers}
            data={dummyCustomerData}
            showEdit={true}
            onEdit={handleEdit}
            showDelete={true}
            onDelete={() => {}}
            showSwitch={true}
            onToggleSwitch={() => {}}
          />
        </TableCard>

        <AddCustomerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        <EditCustomerModal
          visible={modalEditVisible}
          onClose={() => setEditModalVisible(false)}
          customer={selectedCustomer}
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
});

export default Customer;
