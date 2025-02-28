import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddTierModal from '../../../components/modals/add-tier';
import EditTierModal from '../../../components/modals/edit-tier';
import {
  getAllListOfValueByKey,
  getSlugListOfValuesByKey,
} from '../../../services/global';
import CustomPopConfirm from '../../../components/pop-confirm';
import {deleteslug, updateSlug} from '../../../services/product/brand';
import useAuthStore from '../../../redux/feature/store';

function Tier() {
  const headers = ['Name'];
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setEditModalVisible] = useState(false);
  const [selectedTier, setSelectedTier] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [data, setData] = useState<any>([]);
  const [tier, setTier] = useState('');
  const [refetch, setRefetch] = useState(false);
  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl} = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTrue();
        const {data: tierData} = await getSlugListOfValuesByKey(
          'customer-tier',
          headerUrl,
        );
        console.log('Tier Fetch: ', tierData.data.data);

        const formattedData = tierData.data.data.map((item: any) => ({
          ...item,
          Name: item.name,
        }));

        console.log('Formatted data:', formattedData);

        setData((prev: any) => {
          console.log('Previous Data:', prev);
          console.log('New Data:', formattedData);
          return [...formattedData];
        });
        setIsLoadingFalse();
      } catch {
        setIsLoadingFalse();
        return null;
      }
    };

    fetchData();
  }, [refetch]);

  const handleHeadingAction = () => {
    setModalVisible(true);
  };

  const handleEdit = (row: {[key: string]: string | number}) => {
    console.log(row);
    setSelectedTier(row);
    setEditModalVisible(true);
  };

  const [popConfirmVisible, setPopConfirmVisible] = useState(false);
  const [popSwitchConfirmVisible, setPopSwitchConfirmVisible] = useState(false);
  const [tierToDelete, setTierToDelete] = useState(null);
  const [tierToSwitch, setTierToSwitch] = useState(null);

  const handleDelete = async () => {
    if (tierToDelete) {
      setIsLoadingTrue();
      console.log('Deleting tier:', tierToDelete);
      await deleteTier(tierToDelete);

      setData((prevData: any) =>
        prevData.filter((cust: any) => cust._id !== tierToDelete._id),
      );
      setIsLoadingFalse();
      setPopConfirmVisible(false);
      ToastAndroid.showWithGravityAndOffset(
        'Record deleted successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  };

  const deleteTier = async (tier: any) => {
    const response = await deleteslug('customer-tier', tier?._id, headerUrl);
    console.log('Delete Tier Response:', response);
  };

  const confirmDelete = (tier: any) => {
    setTierToDelete(tier);
    setPopConfirmVisible(true);
  };

  const handleSwitch = async () => {
    if (tierToSwitch) {
      setIsLoadingTrue();
      console.log('Switching tier:', tierToSwitch);
      await switchTier(tierToSwitch);
      setIsLoadingFalse();
    }
  };

  const switchTier = async (tier: any) => {
    const payload = {
      ...tier,
      isActive: !tier.isActive,
    };
    const response = await updateSlug(
      'customer-tier',
      payload,
      tier?._id,
      headerUrl,
    );
    console.log('Switch Tier Response:', response);
    setRefetch((prev: any) => !prev);
    ToastAndroid.showWithGravityAndOffset(
      'Record updated successfully',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    setPopSwitchConfirmVisible(false);
  };

  const confirmSwitch = (tier: any) => {
    setTierToSwitch(tier);
    setPopSwitchConfirmVisible(true);
  };

  const handleOnCloseAddModal = () => {
    setModalVisible(false);
  };

  const handleOnSwitchPopCancel = () => {
    setPopSwitchConfirmVisible(false);
    setRefetch((prev: any) => !prev);
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
              value={tier}
              placeholder="Find Tier"
              onChangeText={setTier}
              keyboardType="default"
            />
          </View>
          <CustomDataTable
            headers={headers}
            data={data}
            searchQuery={tier}
            showEdit={true}
            onEdit={handleEdit}
            showDelete={true}
            onDelete={confirmDelete}
            showSwitch={true}
            onToggleSwitch={confirmSwitch}
          />
          <CustomPopConfirm
            title="Confirm Deletion"
            description="Are you sure you want to delete this tier?"
            onConfirm={handleDelete}
            onCancel={() => setPopConfirmVisible(false)}
            okText="Delete"
            cancelText="Cancel"
            visible={popConfirmVisible}
            setVisible={setPopConfirmVisible}
          />
          <CustomPopConfirm
            title="Confirm"
            description="Are you sure?"
            onConfirm={handleSwitch}
            onCancel={handleOnSwitchPopCancel}
            okText="Update"
            cancelText="Cancel"
            visible={popSwitchConfirmVisible}
            setVisible={setPopSwitchConfirmVisible}
          />
        </TableCard>

        <AddTierModal
          visible={modalVisible}
          setRefetch={setRefetch}
          onClose={handleOnCloseAddModal}
        />

        <EditTierModal
          setRefetch={setRefetch}
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
});

export default Tier;
