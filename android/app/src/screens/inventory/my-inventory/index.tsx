import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {dummyMyInventoryData} from '../../../data/dummyData';
import {Dropdown} from 'react-native-element-dropdown';
import {
  API_BASE_URL,
  inventoryType,
  productTypeWithAllFilter,
} from '../../../constants';
import {getAllOutletApi} from '../../../services/outlet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function MyInventory() {
  const headers = [
    'Inventory Item',
    'On Hand',
    'Committed',
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

  const [data, setData] = useState<any>([]);
  const [outlets, setOutlets] = useState<any>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const getOutlet = async () => {
    try {
      const {data: response} = await getAllOutletApi();
      if (response?.data?.length > 0) {
        const outletsData = response.data.map((outlet: any) => ({
          label: outlet.name,
          value: outlet._id,
        }));

        setOutlets(outletsData);
      }
    } catch (err) {
      console.log('Error fetching outlets:', err);
    }
  };

  useEffect(() => {
    getOutlet();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

        // Initialize base URL
        let url = `${API_BASE_URL}/inventory-ledger?`;

        // Define query parameters dynamically
        const queryParams: string[] = [];

        if (selectedProduct) {
          queryParams.push(`productType=${selectedProduct}`);
        }
        if (selectedOutlet) {
          queryParams.push(`outletId=${selectedOutlet}`);
        }
        if (selectedItem) {
          queryParams.push(`inventoryType=${selectedItem}`);
        }

        // Append query parameters to the URL
        url += queryParams.join('&');

        console.log('Request URL:', url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response Inventory List:', response.data.data);

        const formattedData = response.data.data.map((item: any) => ({
          ...item,
          ['Inventory Item']: item.name,
          ['On Hand']: item.onHand,
          ['Committed']: item.commited,
          ['Available']: item.available,
          ['Outlets']: item.outletName,
        }));

        console.log('Formatted data:', formattedData);

        setData(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [selectedItem, selectedProduct, selectedOutlet]);

  const outletsWithAll = [{id: 0, value: '', label: 'All'}, ...outlets];

  const handleOnAddClick = async (row: any, key: string, value: any) => {
    console.log('Updated:', row, key, value);
    const token = await AsyncStorage.getItem('userToken');
    const url = `${API_BASE_URL}/inventory-ledger`;
    const payload = {
      notes: '-',
      quantity: value,
      outletId: selectedOutlet,
      productId: row.productId,
    };
    const response = await axios.post(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Response Add POST:', response);
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
                data={inventoryType}
                labelField="label"
                valueField="value"
                placeholder="Select Inventory Type"
                value={selectedItem}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={item => setSelectedItem(item.value)}
              />
              <Dropdown
                style={styles.dropdown}
                data={productTypeWithAllFilter}
                labelField="label"
                valueField="value"
                placeholder="Select Product Type"
                value={selectedProduct}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={item => setSelectedProduct(item.value)}
              />
              <Dropdown
                style={styles.dropdown}
                data={outletsWithAll}
                labelField="label"
                valueField="value"
                placeholder="Select Outlet"
                value={selectedOutlet}
                placeholderStyle={{color: 'gray'}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 14}}
                onChange={item => setSelectedOutlet(item.value)}
              />
            </View>
          }>
          <CustomDataTable
            headers={headers}
            data={data}
            showInputButton={true}
            addDisabled={!selectedOutlet}
            editableFields={['Edit Available Quantity']}
            onInputChange={(row, key, value) =>
              handleOnAddClick(row, key, value)
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
