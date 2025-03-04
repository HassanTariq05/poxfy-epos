import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import CustomDataTable from '../../../components/data-table';
import TableCard from '../../../components/table-card';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddTagModal from '../../../components/modals/add-tag';
import EditTagModal from '../../../components/modals/edit-tag';
import {
  getAllListOfValueByKey,
  getSlugListOfValuesByKey,
} from '../../../services/global';
import CustomPopConfirm from '../../../components/pop-confirm';
import {deleteslug, updateSlug} from '../../../services/product/brand';
import useAuthStore from '../../../redux/feature/store';

function Tag() {
  const headers = ['Name'];
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setEditModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{
    [key: string]: string | number;
  } | null>(null);
  const [data, setData] = useState<any>([]);
  const [tag, setTag] = useState('');
  const [refetch, setRefetch] = useState(false);
  const {setIsLoadingTrue, setIsLoadingFalse, headerUrl} = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingTrue();
        const {data: tagData} = await getSlugListOfValuesByKey(
          'customer-tag',
          headerUrl,
        );
        console.log('Tag Fetch: ', tagData.data.data);

        const formattedData = tagData.data.data.map((item: any) => ({
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
    setSelectedTag(row);
    setEditModalVisible(true);
  };

  const [popConfirmVisible, setPopConfirmVisible] = useState(false);
  const [popSwitchConfirmVisible, setPopSwitchConfirmVisible] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [tagToSwitch, setTagToSwitch] = useState(null);

  const handleDelete = async () => {
    if (tagToDelete) {
      setIsLoadingTrue();
      console.log('Deleting tag:', tagToDelete);
      await deleteTag(tagToDelete);

      setData((prevData: any) =>
        prevData.filter((cust: any) => cust._id !== tagToDelete._id),
      );

      setIsLoadingFalse();

      ToastAndroid.showWithGravityAndOffset(
        'Record deleted successfully',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      setPopConfirmVisible(false);
    }
  };

  const deleteTag = async (tag: any) => {
    const response = await deleteslug('customer-tag', tag?._id, headerUrl);
    console.log('Delete Tag Response:', response);
  };

  const confirmDelete = (tag: any) => {
    setTagToDelete(tag);
    setPopConfirmVisible(true);
  };

  const handleSwitch = async () => {
    if (tagToSwitch) {
      console.log('Switching tag:', tagToSwitch);
      await switchTag(tagToSwitch);
    }
  };

  const switchTag = async (tag: any) => {
    setIsLoadingTrue();
    const payload = {
      ...tag,
      isActive: !tag.isActive,
    };
    const response = await updateSlug(
      'customer-tag',
      payload,
      tag?._id,
      headerUrl,
    );
    console.log('Switch Tag Response:', response);
    setRefetch((prev: any) => !prev);
    setIsLoadingFalse();
    ToastAndroid.showWithGravityAndOffset(
      'Record updated successfully',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    setPopSwitchConfirmVisible(false);
  };

  const confirmSwitch = (tag: any) => {
    setTagToSwitch(tag);
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
          heading="Tag"
          button={'Add Tag'}
          onAction={handleHeadingAction}>
          <View style={[styles.searchContainer, styles.searchTextFocused]}>
            <MaterialCommunityIcons name="magnify" size={20} color="black" />
            <TextInput
              style={styles.searchText}
              value={tag}
              placeholder="Find Tag"
              onChangeText={setTag}
              keyboardType="default"
            />
          </View>
          <CustomDataTable
            flexes={[1]}
            alignments={['flex-start']}
            headers={headers}
            data={data}
            searchQuery={tag}
            showEdit={true}
            onEdit={handleEdit}
            showDelete={true}
            onDelete={confirmDelete}
            showSwitch={true}
            onToggleSwitch={confirmSwitch}
          />
          <CustomPopConfirm
            title="Confirm Deletion"
            description="Are you sure you want to delete this tag?"
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

        <AddTagModal
          visible={modalVisible}
          setRefetch={setRefetch}
          onClose={handleOnCloseAddModal}
        />

        <EditTagModal
          setRefetch={setRefetch}
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
});

export default Tag;
