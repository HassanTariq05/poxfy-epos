import React, {useEffect, useState} from 'react';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import {Dropdown} from 'react-native-element-dropdown';
import {
  API_BASE_URL,
  inventoryType,
  productTypeWithAllFilter,
} from '../../../constants';
import {getAllOutletApi} from '../../../services/outlet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useAuthStore from '../../../redux/feature/store';

function MyInventory() {
  const headers = [
    'Inventory Item',
    'On Hand',
    'Committed',
    'Available',
    'Edit Available Quantity',
    'Outlets',
  ];

  const [data, setData] = useState<any>([]);
  const [outlets, setOutlets] = useState<any>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(false);
  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl} = useAuthStore();

  const getOutlet = async () => {
    try {
      setIsLoadingTrue();

      const {data: response} = await getAllOutletApi(headerUrl);
      if (response?.data?.length > 0) {
        const outletsData = response.data.map((outlet: any) => ({
          label: outlet.name,
          value: outlet._id,
        }));

        setOutlets(outletsData);
        setIsLoadingFalse();
      }
    } catch (err) {
      console.log('Error fetching outlets:', err);
      setIsLoadingFalse();
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
        let url = `${API_BASE_URL}inventory-ledger?`;

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

        setIsLoadingTrue();
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            origin: headerUrl,
            referer: headerUrl,
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
        setIsLoadingFalse();
      } catch (err) {
        console.error('Error fetching data:', err);
        setIsLoadingFalse();
      }
    };

    fetchData();
  }, [selectedItem, selectedProduct, selectedOutlet, refetch]);

  const outletsWithAll = [{id: 0, value: '', label: 'All'}, ...outlets];

  const handleOnAddClick = async (row: any, notes: any, value: any) => {
    try {
      console.log('Updated:', row, notes, value);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (!selectedOutlet) {
        console.error('No outlet selected');
        return;
      }

      if (!headerUrl) {
        console.error('Header URL is undefined');
        return;
      }

      const url = `${API_BASE_URL}inventory-ledger`;
      const payload = {
        notes: notes,
        quantity: value,
        outletId: selectedOutlet,
        productId: row.productId,
      };

      setIsLoadingTrue();

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          origin: headerUrl,
          referer: headerUrl,
        },
      });

      setIsLoadingFalse();
      setRefetch((prev: any) => !prev);

      ToastAndroid.showWithGravityAndOffset(
        'Quantity updated successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      console.log('Response Add POST:', response.data);
    } catch (error) {
      setIsLoadingFalse();
      console.error('Error in handleOnAddClick:', error);

      ToastAndroid.showWithGravityAndOffset(
        'Failed to update quantity',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  };

  const handleOnSetClick = async (row: any, key: string, value: any) => {
    console.log('Updated:', row, key, value);
    const token = await AsyncStorage.getItem('userToken');
    const url = `${API_BASE_URL}outlet/${selectedOutlet}/opening-balance`;
    console.log('URL: ', url);
    const payload = [
      {
        notes: '-',
        quantity: value,
        productId: row.productId,
      },
    ];
    setIsLoadingTrue();
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        origin: headerUrl,
        referer: headerUrl,
      },
    });
    setIsLoadingFalse();
    console.log('Response Sett PUT:', response);
    setRefetch((prev: any) => !prev);
    ToastAndroid.showWithGravityAndOffset(
      'Quantity updated successfully',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
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
                placeholderStyle={{color: 'gray', fontSize: 13}}
                value={selectedItem}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 13}}
                onChange={item => setSelectedItem(item.value)}
                itemTextStyle={{fontSize: 13}}
                selectedTextProps={{numberOfLines: 1}}
              />
              <Dropdown
                style={styles.dropdown}
                data={productTypeWithAllFilter}
                labelField="label"
                valueField="value"
                placeholder="Select Product Type"
                value={selectedProduct}
                placeholderStyle={{color: 'gray', fontSize: 13}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 13}}
                onChange={item => setSelectedProduct(item.value)}
                itemTextStyle={{fontSize: 13}}
                selectedTextProps={{numberOfLines: 1}}
              />
              <Dropdown
                style={styles.dropdown}
                data={outletsWithAll}
                labelField="label"
                valueField="value"
                placeholder="Select Outlet"
                value={selectedOutlet}
                placeholderStyle={{color: 'gray', fontSize: 13}}
                containerStyle={{borderRadius: 10}}
                selectedTextStyle={{fontSize: 13}}
                onChange={item => setSelectedOutlet(item.value)}
                itemTextStyle={{fontSize: 13}}
                selectedTextProps={{numberOfLines: 1}}
              />
            </View>
          }>
          <CustomDataTable
            flexes={[2, 1, 1, 1, 2, 1]}
            headers={headers}
            data={data}
            showInputButton={true}
            addDisabled={!selectedOutlet}
            editableFields={['Edit Available Quantity']}
            highlightColumns={true}
            onInputChange={(row, key, value) =>
              handleOnAddClick(row, key, value)
            }
            onInputChangeForSet={(row, key, value) =>
              handleOnSetClick(row, key, value)
            }
            toolTip={true}
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
    width: '60%',
    justifyContent: 'flex-end',
  },
  dropdown: {
    height: 40,
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
