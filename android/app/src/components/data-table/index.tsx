import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
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
  onInputChange?: (row: DataFormat, key: string, value: string) => void;
  showSwitch?: boolean;
  showOpenRegister?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  editableFields?: string[];
  showInputButton?: boolean;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  headers,
  data,
  onToggleSwitch,
  onOpenRegister,
  onEdit,
  onDelete,
  onInputChange,
  showSwitch = false,
  showOpenRegister = false,
  showEdit = false,
  showDelete = false,
  editableFields = [],
  showInputButton = false,
}) => {
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const [switchStates, setSwitchStates] = useState<Record<number, boolean>>({});
  const [inputValues, setInputValues] = useState<
    Record<number, Record<string, string>>
  >({});

  const toggleSwitch = (index: number, row: DataFormat) => {
    const newState = !switchStates[index];
    setSwitchStates(prev => ({...prev, [index]: newState}));
    if (onToggleSwitch) onToggleSwitch(row, newState);
  };

  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [key]: value,
      },
    }));
    if (onInputChange) {
      onInputChange(data[rowIndex], key, value);
    }
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

        {currentRows.map((row, rowIndex) => (
          <DataTable.Row key={rowIndex} style={styles.row}>
            {Object.entries(row).map(([key, value], cellIndex) => (
              <DataTable.Cell key={cellIndex} style={styles.cell}>
                {editableFields.includes(key) ? (
                  <View style={styles.editableView}>
                    {showInputButton && (
                      <TouchableOpacity
                        onPress={() => {}}
                        style={styles.addButton}>
                        <Text style={styles.inputButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}

                    <TextInput
                      style={styles.input}
                      value={inputValues[rowIndex]?.[key] ?? String(value)}
                      onChangeText={text =>
                        handleInputChange(rowIndex, key, text)
                      }
                    />
                    {showInputButton && (
                      <TouchableOpacity
                        onPress={() => {}}
                        style={styles.settButton}>
                        <Text style={styles.inputButtonText}>Set</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <Text>{value}</Text>
                )}
              </DataTable.Cell>
            ))}

            {(showSwitch || showOpenRegister || showEdit || showDelete) && (
              <DataTable.Cell style={styles.actionCell}>
                {showSwitch && (
                  <Switch
                    trackColor={{false: '#e0e0e0', true: '#eb6b6b'}}
                    thumbColor={switchStates[rowIndex] ? '#ffffff' : '#ffffff'}
                    ios_backgroundColor="#e0e0e0"
                    onValueChange={() => toggleSwitch(rowIndex, row)}
                    value={switchStates[rowIndex] || false}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 80,
    textAlign: 'center',
  },
  editableView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'none',
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 4,
    width: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  settButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(230,231,235)',
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 4,
    width: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
  inputButtonText: {
    color: 'black',
  },
});

export default CustomDataTable;
