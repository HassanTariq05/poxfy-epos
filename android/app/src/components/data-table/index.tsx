import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import {Switch} from 'react-native-switch';

type DataFormat = {
  [key: string]: string | number | boolean;
  isActive?: any;
};

interface CustomDataTableProps {
  headers: string[];
  data: {[key: string]: string | number}[];
  searchQuery?: string;
  showSwitch?: boolean;
  showOpenRegister?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  editableFields?: string[];
  showInputButton?: boolean;
  onToggleSwitch?: (row: any, value: boolean) => void;
  onOpenRegister?: (row: DataFormat) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: DataFormat) => void;
  onInputChange?: (row: DataFormat, key: string, value: string) => void;
  onInputChangeForSet?: (row: DataFormat, key: string, value: string) => void;
  addDisabled?: boolean;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
  headers,
  data,
  searchQuery = '',
  onToggleSwitch,
  onOpenRegister,
  onEdit,
  onDelete,
  onInputChange,
  onInputChangeForSet,
  showSwitch = false,
  showOpenRegister = false,
  showEdit = false,
  showDelete = false,
  editableFields = [],
  showInputButton = false,
  addDisabled = false,
}) => {
  const rowsPerPage = 5;
  const [page, setPage] = useState(0);
  const [switchStates, setSwitchStates] = useState<Record<number, boolean>>({});
  const [inputValues, setInputValues] = useState<
    Record<number, Record<string, string>>
  >({});

  useEffect(() => {
    const initialSwitchStates: Record<number, boolean> = {};
    data.forEach((row, index) => {
      initialSwitchStates[index] = Boolean(row.isActive);
    });
    setSwitchStates(initialSwitchStates);
  }, [data]);

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const currentRows = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage,
  );

  const toggleSwitch = (index: number, row: DataFormat) => {
    const newState = !switchStates[index];
    setSwitchStates(prev => ({...prev, [index]: newState}));

    if (onToggleSwitch) {
      onToggleSwitch(row, newState);
    }
  };
  const handleInputChange = (rowIndex: number, key: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [key]: value,
      },
    }));
  };

  const handleAddPress = (row: DataFormat, rowIndex: number, key: string) => {
    console.log(`Add button pressed for row ${rowIndex}, key: ${key}`);
    if (onInputChange) {
      onInputChange(row, key, inputValues[rowIndex]?.[key] || '');
    }
  };

  const handleSetPress = (row: DataFormat, rowIndex: number, key: string) => {
    console.log(`Set button pressed for row ${rowIndex}, key: ${key}`);
    if (onInputChangeForSet) {
      onInputChangeForSet(row, key, inputValues[rowIndex]?.[key] || '');
    }
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
            <DataTable.Title textStyle={styles.headerActionText}>
              <Text style={styles.headerActionTextInside}>Action</Text>
            </DataTable.Title>
          )}
        </DataTable.Header>

        {currentRows.map((row, rowIndex) => (
          <DataTable.Row key={rowIndex} style={styles.row}>
            {headers.map((header, cellIndex) => (
              <DataTable.Cell key={cellIndex} style={styles.cell}>
                {editableFields.includes(header) ? (
                  <View style={styles.editableView}>
                    {showInputButton && (
                      <TouchableOpacity
                        disabled={addDisabled}
                        onPress={() => handleAddPress(row, rowIndex, header)}
                        style={[
                          styles.addButton,
                          addDisabled && {
                            backgroundColor: 'rgba(230, 231, 235, 0.39)',
                            borderColor: 'rgba(230, 231, 235, 0.39)',
                          },
                        ]}>
                        <Text style={styles.inputButtonText}>Add</Text>
                      </TouchableOpacity>
                    )}

                    <TextInput
                      style={styles.input}
                      value={inputValues[rowIndex]?.[header] || ''}
                      onChangeText={text =>
                        handleInputChange(rowIndex, header, text)
                      }
                    />

                    {showInputButton && (
                      <TouchableOpacity
                        disabled={addDisabled}
                        onPress={() => handleSetPress(row, rowIndex, header)}
                        style={styles.settButton}>
                        <Text style={styles.inputButtonText}>Set</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <Text>{row[header]}</Text>
                )}
              </DataTable.Cell>
            ))}

            {(showSwitch || showOpenRegister || showEdit || showDelete) && (
              <DataTable.Cell style={styles.actionCell}>
                {showSwitch && (
                  <View style={{paddingLeft: 5, paddingRight: 5}}>
                    <Switch
                      value={switchStates[rowIndex]}
                      onValueChange={() => toggleSwitch(rowIndex, row)}
                      disabled={false}
                      activeText=""
                      inActiveText=""
                      circleSize={22}
                      barHeight={24}
                      circleBorderWidth={1}
                      backgroundActive={'#eb6b6b'}
                      backgroundInactive={'#e0e0e0'}
                      circleActiveColor={'#fff'}
                      circleInActiveColor={'#fff'}
                      changeValueImmediately={true}
                      innerCircleStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      switchLeftPx={10}
                      switchRightPx={10}
                      switchWidthMultiplier={1.6}
                    />
                  </View>
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
                  <>
                    <TouchableOpacity
                      onPress={() => onDelete(row)}
                      style={styles.crossButton}>
                      <Feather name="x" size={22} color="black" />
                    </TouchableOpacity>
                  </>
                )}
              </DataTable.Cell>
            )}
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(filteredData.length / rowsPerPage)}
          onPageChange={setPage}
          label={`${page * rowsPerPage + 1} - ${(page + 1) * rowsPerPage} of ${
            filteredData.length
          }`}
        />
      </DataTable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {width: '100%'},
  dataTable: {flex: 1, backgroundColor: 'white', minWidth: '100%'},
  header: {
    backgroundColor: 'rgb(250,250,250)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
  headerText: {
    color: 'black',
    justifyContent: 'flex-end',
  },
  headerActionText: {
    color: 'black',
    width: '100%',

    textAlign: 'right',
  },
  headerActionTextInside: {
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(237,105, 100)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: 120,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
  },
  row: {borderBottomWidth: 1, borderBottomColor: 'rgb(240,240,240)'},
  cell: {minWidth: 100, textAlign: 'center'},
  actionCell: {
    minWidth: 100,
    paddingRight: 0,
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
  switch: {alignSelf: 'flex-start'},
  editButton: {
    alignSelf: 'flex-start',
    paddingBottom: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  crossButton: {alignSelf: 'flex-start', paddingBottom: 5, marginTop: 5},
  errorText: {color: 'red', textAlign: 'center', marginVertical: 10},
  editableView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
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
  inputButtonText: {
    color: 'black',
  },
});

export default CustomDataTable;
