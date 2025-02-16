import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyMyInventoryData} from '../../../data/dummyData';
import {Dropdown} from 'react-native-element-dropdown';

function MyInventory() {
  const headers = [
    'Invetory Item',
    'On Hand',
    'Commited',
    'Available',
    'Edit Available Quantity',
    'Outlets',
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const handleAction = (row: {[key: string]: string | number}) => {
    setSelectedRow(row);
    setModalVisible(true);
  };

  return (
    <>
      <View>
        <TableCard
          heading="My Inventory"
          headerChildren={
            <View style={styles.dropdownView}>
              <Dropdown
                style={styles.dropdown}
                data={[
                  {label: 'Zero Inventory', value: 'zero-inventory'},
                  {label: 'Low Inventory', value: 'low-inventory'},
                  {label: 'All', value: 'all'},
                ]}
                labelField="label"
                valueField="value"
                placeholder="Items"
                value={'all'}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={function (item: any): void {}}
              />
              <Dropdown
                style={styles.dropdown}
                data={[
                  {label: 'Simple Product', value: 'simple-product'},
                  {label: 'All', value: 'all'},
                ]}
                labelField="label"
                valueField="value"
                placeholder="Product"
                value={'all'}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={function (item: any): void {}}
              />
              <Dropdown
                style={styles.dropdown}
                data={[
                  {label: 'Main Store', value: 'main-store'},
                  {label: 'All', value: 'all'},
                ]}
                labelField="label"
                valueField="value"
                placeholder="Outlet"
                value={'main-store'}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={function (item: any): void {}}
              />
            </View>
          }>
          <CustomDataTable
            headers={headers}
            data={dummyMyInventoryData}
            showInputButton={true}
            editableFields={['editAvailableQuantity']}
            onInputChange={(row, key, value) =>
              console.log('Updated:', row, key, value)
            }
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
  dropdownView: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    width: '50%',
    justifyContent: 'flex-end',
  },
  dropdown: {
    height: 30,
    backgroundColor: 'none',
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 14,
    borderColor: 'rgb(202,202,202)',
    borderWidth: 1,
    width: '33.33%',
  },
});

export default MyInventory;
