import React, {useState} from 'react';
import {Alert, Button, StyleSheet, TextInput, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyListingData} from '../../../data/dummyData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SlideInModal from '../../../components/modals/open-register';

function Listing() {
  const headers = [
    'id',
    'Name',
    'Receipt No',
    'Receipt Prefix',
    'Receipt Suffix',
    'Outlet',
    'Created By',
  ];

  const [email, setEmail] = useState('');
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
        <TableCard heading="Register">
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={email}
              placeholder="Find..."
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
          <CustomDataTable
            headers={headers}
            data={dummyListingData}
            showOpenRegister={true}
            onOpenRegister={() => setModalVisible(true)}
          />
        </TableCard>

        {/* Slide-in Modal */}

        {/* Modal Content */}
        <View>
          {selectedRow ? (
            <View>
              <Button title="Close" onPress={() => setModalVisible(false)} />
              <View style={styles.modalContent}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={40}
                  color="black"
                />
                <TextInput
                  style={styles.input}
                  value={String(selectedRow?.['Name'] || '')}
                  editable={false}
                />
                <TextInput
                  style={styles.input}
                  value={String(selectedRow?.['Receipt No'] || '')}
                  editable={false}
                />
              </View>
            </View>
          ) : null}
        </View>
        <SlideInModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
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

export default Listing;
