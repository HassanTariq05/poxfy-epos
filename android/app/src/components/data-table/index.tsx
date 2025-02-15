import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

type DataFormat = {
  [key: string]: string | number;
};

interface CustomDataTableProps {
  headers: string[];
  data: DataFormat[];
  onToggleSwitch?: (row: DataFormat, value: boolean) => void;
  onOpenRegister?: (row: DataFormat) => void;
  onEdit?: (row: DataFormat) => void;
  onDelete?: (row: DataFormat) => void;
  showSwitch?: boolean;
  showOpenRegister?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  headers,
  data,
  onToggleSwitch,
  onOpenRegister,
  onEdit,
  onDelete,
  showSwitch = false,
  showOpenRegister = false,
  showEdit = false,
  showDelete = false,
}) => {
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const [switchStates, setSwitchStates] = useState<Record<number, boolean>>({});

  const toggleSwitch = (index: number, row: DataFormat) => {
    const newState = !switchStates[index];
    setSwitchStates(prev => ({...prev, [index]: newState}));
    if (onToggleSwitch) onToggleSwitch(row, newState);
  };

  const currentRows = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ScrollView horizontal style={styles.scrollView}>
      <DataTable style={styles.dataTable}>
        <DataTable.Header style={styles.header}>
          {headers.map((header, index) => (
            <DataTable.Title key={index} textStyle={styles.headerText}>
              {header}
            </DataTable.Title>
          ))}
          {(showSwitch || showOpenRegister || showEdit || showDelete) && (
            <DataTable.Title
              textStyle={styles.headerText}
              style={styles.leftAlignedHeader}>
              Action
            </DataTable.Title>
          )}
        </DataTable.Header>

        {currentRows.map((row, index) => (
          <DataTable.Row key={index} style={styles.row}>
            {Object.values(row).map((value, cellIndex) => (
              <DataTable.Cell key={cellIndex} style={styles.cell}>
                {value}
              </DataTable.Cell>
            ))}

            {(showSwitch || showOpenRegister || showEdit || showDelete) && (
              <DataTable.Cell style={styles.actionCell}>
                {showSwitch && (
                  <Switch
                    trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                    thumbColor={switchStates[index] ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#e0e0e0"
                    onValueChange={() => toggleSwitch(index, row)}
                    value={switchStates[index] || false}
                    style={styles.switch}
                  />
                )}
                {showOpenRegister && onOpenRegister && (
                  <TouchableOpacity
                    onPress={() => onOpenRegister(row)}
                    style={styles.actionButton}>
                    <Text style={styles.buttonText}>Open Register</Text>
                  </TouchableOpacity>
                )}
                {showEdit && onEdit && (
                  <TouchableOpacity
                    onPress={() => onEdit(row)}
                    style={styles.editButton}>
                    <Feather name="edit-3" size={22} color="black" />
                  </TouchableOpacity>
                )}
                {showDelete && onDelete && (
                  <TouchableOpacity
                    onPress={() => onDelete(row)}
                    style={styles.crossButton}>
                    <Feather name="x" size={22} color="black" />
                  </TouchableOpacity>
                )}
              </DataTable.Cell>
            )}
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / rowsPerPage)}
          onPageChange={handleChangePage}
          label={`${page * rowsPerPage + 1} - ${(page + 1) * rowsPerPage} of ${
            data.length
          }`}
        />
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  dataTable: {
    backgroundColor: 'white',
    minWidth: 720,
    width: '100%',
  },
  header: {
    backgroundColor: 'rgb(250,250,250)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
  headerText: {
    color: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  leftAlignedHeader: {
    justifyContent: 'flex-end',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
  cell: {
    minWidth: 100,
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: 'center',
    justifyContent: 'flex-start',
  },
  actionCell: {
    minWidth: 100,
    paddingRight: 0,
    paddingLeft: 10,
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
  switch: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingBottom: 5,
  },
  crossButton: {
    alignSelf: 'flex-start',
    paddingBottom: 5,
    paddingLeft: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(237,105, 100)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 120,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
});

export default CustomDataTable;
