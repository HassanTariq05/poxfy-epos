import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyCustomerTagData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddTagModal from '../../../components/modals/add-tag';
import EditTagModal from '../../../components/modals/edit-tag';

function Tag() {
  const headers = ['Name'];

  const [customer, setcustomer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [modalEditVisible, setEditModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{
    [key: string]: string | number;
  } | null>(null);

  const handleAction = (row: {[key: string]: string | number}) => {
    // setSelectedRow(row);
    // setModalVisible(true);
  };

  const handleHeadingAction = () => {
    setModalVisible(true);
  };

  const handleEdit = (row: {[key: string]: string | number}) => {
    console.log(row);
    setSelectedTag(row);
    setEditModalVisible(true);
  };

  return (
    <>
      <View>
        <TableCard
          heading="Tag"
          button={'Add Tag'}
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
            data={dummyCustomerTagData}
            showEdit={true}
            onEdit={handleEdit}
            showDelete={true}
            onDelete={() => {}}
            showSwitch={true}
            onToggleSwitch={() => {}}
          />
        </TableCard>
        <AddTagModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
        <EditTagModal
          visible={modalEditVisible}
          onClose={() => setEditModalVisible(false)}
          tag={selectedTag}
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

export default Tag;
