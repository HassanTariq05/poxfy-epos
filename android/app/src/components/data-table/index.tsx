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

  useEffect(() => {
    const initialSwitchStates: Record<number, boolean> = {};
    data.forEach((row, index) => {
      initialSwitchStates[index] = Boolean(row.isActive);
    });
    setSwitchStates(initialSwitchStates);
  }, [data]);

  const currentRows = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const toggleSwitch = (index: number, row: DataFormat) => {
    const newState = !switchStates[index];
    setSwitchStates(prev => ({...prev, [index]: newState}));

    if (onToggleSwitch) {
      onToggleSwitch(row, newState);
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
            <DataTable.Title textStyle={styles.headerText}>
              Action
            </DataTable.Title>
          )}
        </DataTable.Header>

        {currentRows.map((row, rowIndex) => (
          <DataTable.Row key={rowIndex} style={styles.row}>
            {headers.map((header, cellIndex) => (
              <DataTable.Cell key={cellIndex} style={styles.cell}>
                {editableFields.includes(header) ? (
                  <TextInput
                    style={styles.input}
                    value={
                      inputValues[rowIndex]?.[header] ?? String(row[header])
                    }
                    onChangeText={text =>
                      setInputValues(prev => ({
                        ...prev,
                        [rowIndex]: {...prev[rowIndex], [header]: text},
                      }))
                    }
                  />
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
          numberOfPages={Math.ceil(data.length / rowsPerPage)}
          onPageChange={setPage}
          label={`${page * rowsPerPage + 1} - ${(page + 1) * rowsPerPage} of ${
            data.length
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
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
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
  row: {borderBottomWidth: 1, borderBottomColor: 'rgb(240,240,240)'},
  cell: {minWidth: 100, paddingRight: 10, paddingLeft: 10, textAlign: 'center'},
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
  switch: {alignSelf: 'flex-start'},
  editButton: {alignSelf: 'flex-start', paddingBottom: 5},
  crossButton: {alignSelf: 'flex-start', paddingBottom: 5, paddingLeft: 5},
  errorText: {color: 'red', textAlign: 'center', marginVertical: 10},
});

export default CustomDataTable;
