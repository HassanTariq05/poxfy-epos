import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyOpeningData} from '../../../data/dummyData';
import {Dropdown} from 'react-native-element-dropdown';

function OpeningBalance() {
  const headers = ['Name', 'Opening'];

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
          heading="Opening Balance"
          headerChildren={
            <View style={styles.dropdownView}>
              <Dropdown
                style={styles.dropdown}
                data={[{label: 'Main Store', value: 'main-store'}]}
                labelField="label"
                valueField="value"
                placeholder="Select Outlet"
                value={'main-store'}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={function (item: any): void {}}
                mode="auto"
              />
              <TouchableOpacity onPress={() => {}} style={styles.actionButton}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          }>
          <CustomDataTable
            headers={headers}
            data={dummyOpeningData}
            editableFields={['opening']}
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
    width: '70%',
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

export default OpeningBalance;
